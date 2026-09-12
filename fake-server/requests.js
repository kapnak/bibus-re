const zlib = require('zlib');
const { promisify } = require('util');

const gunzip = promisify(zlib.gunzip);
const inflate = promisify(zlib.inflate);


/**
 * @typedef {Object} ReplayRequest
 * @property {string|null} host - The original target host (e.g., 'https://example.com')
 * @property {string|null} port - The original target port (e.g., 443 or '8080')
 * @property {string} url - The request path or URL string
 * @property {string} method - HTTP method (GET, POST, PUT, etc.)
 * @property {Record<string, string> | Headers} headers - Key-value pair object or Headers instance of HTTP headers
 * @property {Buffer} [body] - Optional payload for request body
 */

/**
 * Parse the request and extract the original host and port.
 * @param request
 * @return {Promise<ReplayRequest>}
 */
async function parse(request) {
    const buffers = [];
    for await (const chunk of request) {
        buffers.push(chunk);
    }
    let bodyBuffer = Buffer.concat(buffers);

    // 1. Handle Decompression
    const contentEncoding = request.headers['content-encoding'] || '';
    if (bodyBuffer.length > 0) {
        try {
            if (contentEncoding.includes('gzip')) {
                bodyBuffer = await gunzip(bodyBuffer);
            } else if (contentEncoding.includes('deflate')) {
                bodyBuffer = await inflate(bodyBuffer);
            }
        } catch (err) {
            console.warn('Decompression failed:', err.message);
        }
    }

    // 2. Parse Content
    const contentType = request.headers['content-type'] || '';
    let parsedBody = '[empty body]';

    if (bodyBuffer.length > 0) {
        const bodyString = bodyBuffer.toString('utf-8');

        if (contentType.includes('application/json')) {
            try {
                parsedBody = JSON.parse(bodyString);
            } catch {
                parsedBody = bodyString;
            }
        } else if (
            contentType.includes('text/') ||
            contentType.includes('application/x-www-form-urlencoded')
        ) {
            parsedBody = bodyString;
        } else {
            parsedBody = {
                _type: 'Binary Payload',
                lengthBytes: bodyBuffer.length,
                hexPreview: bodyBuffer.subarray(0, 64).toString('hex'),
                utf8PrintableExtract: bodyString.replace(/[^\x20-\x7E]/g, '.'),
            };
        }
    }

    // 3. Extract original host and port
    let host = null;
    if ('x-original-host' in request.headers) {
        host = request.headers['x-original-host'];
        delete request.headers['x-original-host'];
    }
    let port = null;
    if ('x-original-port' in request.headers) {
        port = request.headers['x-original-port'];
        delete request.headers['x-original-port'];
    }

    return {
        timestamp: new Date().toISOString(),
        host,
        port,
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: bodyBuffer,
        parsedBody: parsedBody,
    };
}


/**
 * Replays the request to the original host and port.
 * @param {ReplayRequest} request - The request object containing original host, port, headers, and body
 * @returns {Promise<Response>} The Fetch API Response object
 */
async function replay(request) {

    // Check input
    if (request.host === null) {
        throw new Error('Original host is not set');
    }

    // Modify the request
    if ('host' in request.headers) {
        delete request.headers['host'];
    }

    if ('content-length' in request.headers) {
        delete request.headers['content-length'];
    }

    if ('x-android-cert' in request.headers) {
        request.headers['x-android-cert'] = 'BF44243DC75187BD5E39EE0DD967DFDC73F823CA';
    }

    // Send the request
    return await fetch(
        `https://${request.host}${request.url.startsWith('/') ? '' : '/'}${request.url}`,
        {
            method: request.method,
            headers: request.headers,
            ...Buffer.byteLength(request.body) !== 0 && {body: request.body}
        }
    );
}

module.exports = {
    parse,
    replay
};
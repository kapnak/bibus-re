const http = require("http");
const requests = require("./requests");

const PORT = Number(process.env.PORT || 80);


const server = http.createServer(async (req, res) => {
    const request = await requests.parse(req);

    console.log("--- Receive request ---");
    console.log(request);

    // Loading middleware to intercept the request
    const middlewares = [
        require('./middleware/contracts.js'),
        require('./middleware/validations.js'),
    ];

    for (const middleware of middlewares) {
        const response = await middleware(request, res)
        if (response !== null) {
            return response
        }
    }

    // If the request is not intercepted by any middleware, replay it
    const allowedHosts = [
        'firebaseinstallations.googleapis.com',
        'prod.instant-system.com',
        'instant-system.com'
    ];

    if (request.host && allowedHosts.includes(request.host)) {
        try {
            console.log("---> Replaying the request");
            const response = await requests.replay(request);
            console.log("--- Response received ---");

            const responseHeaders = Object.fromEntries(response.headers.entries());
            if ('content-encoding' in responseHeaders) {
                delete responseHeaders['content-encoding'];
            }
            res.writeHead(response.status, responseHeaders);
            const arrayBuffer = await response.arrayBuffer();

            console.log({
                status: response.status,
                headers: responseHeaders,
                body: Buffer.from(arrayBuffer).toString('utf-8')
            });

            return res.end(Buffer.from(arrayBuffer));
        } catch (error) {
            console.error("--- Replay Error ---", error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('{}');
        }
    }
});


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
});

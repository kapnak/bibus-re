import os
from pathlib import Path
from mitmproxy import http

FAKE_HOST = os.getenv("FAKE_HOST", "fake-server")
FAKE_PORT = int(os.getenv("FAKE_PORT", "80"))

CA_PATH = Path.home() / ".mitmproxy" / "mitmproxy-ca-cert.pem"

def request(flow: http.HTTPFlow):

    if flow.request.path == "/__ca.cer":
        try:
            ca = CA_PATH.read_bytes()
            flow.response = http.Response.make(
                200,
                ca,
                { "Content-Type": "application/x-pem-file", "Content-Disposition": 'inline; filename="mitmproxy-ca.pem"', "Cache-Control": "no-store", }
            )
        except FileNotFoundError:
            flow.response = http.Response.make(
                500,
                b"CA certificate not found",
                {"Content-Type": "text/plain"}
            )
        return

    flow.request.headers["x-original-host"] = flow.request.pretty_host
    flow.request.headers["x-original-port"] = str(flow.request.port)
    flow.request.host = FAKE_HOST
    flow.request.port = FAKE_PORT
    flow.request.scheme = "http"

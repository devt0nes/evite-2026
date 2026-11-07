const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const verifyName = require("../api/verify-name");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT) || 3000;
const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function handleVerification(request, response) {
  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
  });
  request.on("end", () => {
    try {
      request.body = body ? JSON.parse(body) : {};
    } catch {
      sendJson(response, 400, { error: "Invalid JSON" });
      return;
    }

    const apiResponse = {
      status(statusCode) {
        response.statusCode = statusCode;
        return apiResponse;
      },
      json(payload) {
        sendJson(response, response.statusCode || 200, payload);
      },
    };
    verifyName(request, apiResponse);
  });
}

function serveStatic(request, response) {
  const requestedPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

http.createServer((request, response) => {
  if (request.url.startsWith("/api/verify-name")) {
    handleVerification(request, response);
    return;
  }
  serveStatic(request, response);
}).listen(port, () => {
  console.log(`Local invitation server running at http://localhost:${port}`);
});

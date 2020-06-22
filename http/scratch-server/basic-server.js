const http = require("http");
const fs = require("fs");

function send404(res) {
  res.writeHead(404, { "content-type": "text/plain" });
  res.write("404 error: source not found");
  res.end();
}

const server = http.createServer((req, res) => {
  if (req.method == "GET" && req.url == "/") {
    res.writeHead(200, { "content-type": "text/html" });
    fs.createReadStream("./public/index.htlm").pipe(res);
  } else {
    send404();
  }
});

server.listen(3000);
console.log("Server running on port 3000.");

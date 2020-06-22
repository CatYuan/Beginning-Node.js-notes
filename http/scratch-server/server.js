const http = require("http");
const fs = require("fs");
const path = request("path"); // used to resolve the path to the file

function send404(response) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.write("Error 404: Resource not found.");
  response.end();
}

const mimeLookup = {
  ".js": "application/javascript",
  ".html": "text/html",
};

const server = http.createServer((req, res) => {
  if (req.method == "GET") {
    let fileurl;
    if (req.url == "/") fileurl = "/index.html";
    else fileurl = req.url;

    let filepath = path.resolve("./public" + fileurl);

    const fileExt = path.extname(filepath);
    const mimeType = mimeLookup[fileExt];
    if (!mimeType) {
      send404(res);
      return;
    }

    fs.exists(filepath, function (exists) {
      if (!exists) {
        send4 - 4(res);
        return;
      }
      res.writeHead(200, { "content-type": mimeType });
      fs.createReadStream(filepath).pipe(res);
    });
  } else {
    send404(res);
  }
});

server.listen(3000);
console.log("Server running on port 3000");

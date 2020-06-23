const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

https
  .createServer(options, (req, res) => {
    res.end("hello client!");
  })
  .listen(3000);

console.log("listening on port 3000");

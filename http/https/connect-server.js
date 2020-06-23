const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

const connect = require("connect");
const app = connect();

https.createServer(options, app).listen(3000);

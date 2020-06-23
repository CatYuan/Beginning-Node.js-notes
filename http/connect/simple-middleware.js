const connect = require("connect");
const util = require("util");

const app = connect().use((req, res, next) => {
  util.log(util.format("Request recieved: %s, %s", req.method, req.url));
  next();
});
app.listen(3000);

console.log("server running on port 3000");

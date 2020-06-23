const connect = require("connect");

function auth(req, res, next) {
  function send401() {
    res.writeHead(401, { "WWW-Authenticate": "Basic" });
    res.end();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    send401();
    return;
  }

  const auth = new Buffer(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const password = auth[1];
  if (user == "foo" && password == "bar") {
    next();
  } else {
    send401();
  }
}

connect()
  .use("/admin", auth)
  .use("/admin", (req, res) => {
    res.end("Authorized!");
  })
  .use((req, res) => {
    res.end("Public");
  })
  .listen(3000);

console.log("listening on port 3000");

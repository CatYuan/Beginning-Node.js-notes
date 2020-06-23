// middleware that echoes the client request back to the client
const connect = require("connect");

function echo(req, res, next) {
  req.pipe(res);
}

const app = connect()
  .use("/echo", echo)
  .use((req, res, next) => {
    res.end("Wassup!");
  });
app.listen(3000);

console.log("listening on port 3000");

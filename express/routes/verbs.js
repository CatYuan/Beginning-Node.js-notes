// the methods form a middleware chain,
// where calling next() and the order matter

/**
 * you can test using
 * `curl -X POST http://localhost:3000`
 * where -X specifies the request verb to use
 */
const express = require("express");

const app = express();

app.all("/", (req, res, next) => {
  res.write("all\n");
  next();
});

app.get("/", (req, res, next) => {
  res.end("get");
});

app.put("/", (req, res, next) => {
  res.end("put");
});

app.post("/", (req, res, next) => {
  res.end("post");
});

app.delete("/", (req, res, next) => {
  res.end("delete");
});

app.listen(3000);
console.log("listening on port 3000");

const express = require("express");

const app = express();

app
  .route("/")
  .all((req, res, next) => {
    res.write("all");
    next();
  })
  .get((req, res, next) => {
    res.end("get");
  })
  .put((req, res, next) => {
    res.end("put");
  })
  .post((req, res, next) => {
    res.end("post");
  })
  .delete((req, res, next) => {
    res.end("delete");
  });

app.listen(3000);
console.log("listening on port 3000");

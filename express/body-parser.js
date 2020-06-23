const express = require("express");
// const bodyParser = require("body-parser");

const app = express()
  .use(express.json())
  .use((req, res, next) => {
    if (req.body.foo) {
      res.end("Body parsed. Value of foo: " + req.body.foo);
    } else {
      res.end("Body does not have foo");
    }
  })
  .use((err, req, res, next) => {
    res.end("Invalid body");
  })
  .listen(3000);

console.log("listening on port 3000");

const express = require("express");

const app = express()
  .use(express.static(__dirname + "/public"))
  .listen(3000);

console.log("Listening on http://localhost:3000");

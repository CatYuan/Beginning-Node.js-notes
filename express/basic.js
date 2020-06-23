// const http = require("http");
// const express = require("express");

// const app = express();
// app.use((req, res, next) => {
//   res.end("hello express");
// });

// http.createServer(app).listen(3000);
// console.log("Listening on http://localhost:3000");

// the above can be simplified into

const express = require("express");

const app = express()
  .use((req, res, next) => {
    res.end("hello express");
  })
  .listen(3000);

console.log("listening on http://localhost:3000");

const express = require("express");
const timeout = require("connect-timeout");

function haltOnTimedout(req, res, next) {
  if (!req.timedOut) next();
}

const app = express()
  .use("/api", timeout(5000))
  .use("/api", (req, res, next) => {
    // simulate a request that takes 6 seconds to complete
    setTimeout(() => {
      next();
    }, 6000);
  })
  .use(haltOnTimedout) // utility function that checks if error request has been called
  .use("/api", (req, res, next) => {
    // when you reach here, the error request will already have terminated
    res.end("Done");
  })
  .use("/api", (error, req, res, next) => {
    // the error handling middleware
    if (req.timedout) {
      res.statusCode = 500;
      res.end("Request timed out");
    } else {
      next(error);
    }
  })
  .listen(3000);

console.log("listening on port 3000");

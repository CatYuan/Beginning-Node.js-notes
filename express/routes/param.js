const express = require("express");

const app = express();

app.get("/user/:userId", (req, res, next) => {
  res.send("userId is: " + req.params["userId"]);
});

app.listen(3000);

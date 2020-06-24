const express = require("express");
const cookieParser = require("cookie-parser");

const app = express()
  .use(cookieParser("my super secret sign key"))
  .use("./toggle", (req, res) => {
    if (req.signedCookies.name) {
      console.log("User name", req.signedCookies.name);
      res.clearCookie("name");
      res.end("name cookie was cleared. Was:" + req.signedCookies.name);
    } else {
      res.cookie("name", "foo", { signed: true });
      res.end("name cookie set");
    }
  })
  .listen(3000);
console.log("listening on port 3000");

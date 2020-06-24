const express = require("express");
const cookieParser = require("cookie-parser");

const app = express()
  .use(cookieParser())

  // the cookie will only be set at the '/toggle' path
  .use("/toggle", (req, res) => {
    // searching for cookie
    if (req.cookies.name) {
      console.log("User name: ", req.cookies.name);

      // clearing the cookie
      res.clearCookie("name");
      res.end("name cookie was cleared");
    } else {
      res.cookie("name", "foo");
    }
    res.end("name cookie set");
  })
  .listen(3000);
console.log("listening on port 3000");

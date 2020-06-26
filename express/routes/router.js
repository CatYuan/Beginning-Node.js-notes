const express = require("express");
const bodyParser = require("body-parser");

let items = [];

// create a router
const router = express.Router();
router.use(bodyParser());

// set up collection routes
router
  .route("/")
  .get((req, res, next) => {
    res.send({
      status: "items found",
      items: items,
    });
  })
  .post((req, res, next) => {
    items.push(req.body);
    res.send({
      status: "item added",
      itemId: items.length - 1,
    });
  })
  .put((req, res, next) => {
    items = req.body;
    res.send({
      status: "items replaced",
    });
  })
  .delete((req, res, next) => {
    items = [];
    res.send({
      status: "items cleared",
    });
  });

// setup item routes
router
  .route("/:id")
  .get((req, res, next) => {
    const id = req.params["id"];
    if (id && items[Number(id)]) {
      res.send({
        status: "item found",
        item: items[Number(id)],
      });
    } else {
      res.send(404, { status: "not found" });
    }
  })
  .all((req, res, next) => {
    res.send(501, { status: "not implemented" });
  });

// use the router
const app = express().use("/todo", router).listen(3000);
console.log("listening on port 3000");

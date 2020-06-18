const EventEmitter = require("events").EventEmitter;
const inherits = require("util").inherits;

// create a custom event emitter
function Foo() {
  EventEmitter.call(this); // calling Parent constructor
}
inherits(Foo, EventEmitter); // setting up prototype chain

Foo.prototype.connect = function () {
  this.emit("connected");
};

const foo = new Foo();
foo.on("connected", () => {
  console.log("listening to connected");
});
foo.connect();

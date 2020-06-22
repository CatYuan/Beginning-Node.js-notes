const connect = require("connect");
const http = require("http");

const app = connect(); // creating connect dispatcher

http.createServer(app).listen(3000);
console.log("Server running on port 3000.");

//** The above can also be simplified in the following manner */
// const connect = require('connect');

// var app = connect().listen(3000); // automatically registered with http
// console.log("Server running on port 3000.");

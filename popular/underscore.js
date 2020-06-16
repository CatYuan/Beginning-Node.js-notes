var _ = require("underscore");

var foo = [1, 10, 50, 200, 900, 90, 40];
var results = _.filter(foo, (item) => item > 100);

console.log(results);

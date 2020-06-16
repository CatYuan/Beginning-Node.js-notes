// the moment library allows you to wrap a JS Date into a `moment` object

var moment = require("moment");

// to create a moment object, instantiate w/ a JS Date object
var wrapped = moment(new Date());
console.log("moment object: ", wrapped);

// you can convert moment to Date as well
var date = wrapped.toDate();
console.log("date object: ", date);

// moment also provides string parsing
var stringDate = "12-25-1995";
var stringFormat = "MM-DD-YYYY";
var parsedStringMoment = moment(stringDate, stringFormat).toDate();
console.log("parsing moment to string: ", parsedStringMoment);

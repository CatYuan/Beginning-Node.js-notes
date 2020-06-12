# Beginning-Node.js-notes

- [Understanding Node.js](#understanding-node.js)
  - [Functions](#functions)
  - [Closures](#closures)
  - [Thread Starvation](#thread-starvation)
  - [Data Intensive Applications](#data-intensive-applications)
  - [Truthy and Falsy](#truthy-and-falsy)
  - [Prototype](#prototype)
  - [Error Handling](#error-handling)
- [Core Node.js](#core-node.js)
  - [File Based Module System](#file-based-module-system)
  - [Important Globals](#important-globals)

# Understanding Node.js

## Functions

### Immediately Executing Functions

```
(function foo() {
    console.log('foo was executed!');
})();
```

- What's the purpose?
  - to create a new variable scope
  - functions are the only recommended way of creating a new variable scope in Java Script

```
var foo = 123;
if (ture) {
    var foo = 456;
}
console.log(foo); // 456
```

```
var foo = 123;
if (true) {
    (function() {
        var foo = 456;
    })();
}
console.log(foo); // 123
```

### Higher-Order Functions

- What are they? - Functions that take functions as arguments

```
setTimeout(function () {
    console.log('2 seconds have passed since start of demo');
}, 2000);
```

## Closures

- When a function is declared in another function, the inner function has access to the variables in the outer function

```
function outerFunct(arg) {
    var varInOuterFunc = arg;
    function bar() {
        console.log(varInOuterFunc);
    }

    bar();
}
outerFunct("Hello Closure"); // logs 'Hello Closure'
```

## Thread Starvation

- Node.js is single threaded event loop. A process that takes a long time to run, will hold up the event loop and make the application slow

## Data Intensive Applications

- Node.js is great for data-intensive applications

## Truthy and Falsy

- Truthy values behave like `true` and falsy values behave like `false`
  - `null`, `undefined`, `0`, and the empty string (`''`) are falsy
- In the case of `null` and `undefined` it's better to use an `if/else/!`

```
if (!false) {...}
if (!null) {...}
if (!undefined) {...}
```

## Prototype

```
function foo() { };
foo.prototype.bar = 123;

//creating an object using `new`
//this copies foo.prototype to bas._proto_
var bas = new foo();

console.log(bas._proto_ === foo.prototype); //true
console.log(bas.bar); //123
```

- all functionality on prototype is shared throughout all instances

```
function foo() { };
foo.prototype.bar = 123;

var bas = new foo(); // bas.bar === 123
var qux = new foo(); // qux.bar === 123

//modify prototype
foo.prototype.bar = 456

console.log(bas.bar); // prints 456
console.log(qux.bar); // prints 456
```

- However, modifying the property of an instance will not affect other instances
  - modifying `bas.bar = 789`, will not change the value of the `prototype` or of object `qux`
- creating classes

```
function someClass() {
    // Define properties as follows
    this.someProperty = 'some initial value';
}
```

## Error Handling

- `try`, `throw` and `catch` exceptions
- `finally` runs whether an exception was caught or not
- However, `try`, `catch` doesn't work under an async flow
  - error handling must be done _inside_ the callback
  - callbacks ussually have `error` as the first parameter, so the callback can still access the data from within the `try` `catch`

```
function getConnection(callback) {
    var connection;
    try {
        throw new Error('connection failed');

        // if connection is successful, notify callback
        callback(null, connection);
    } catch (error) {
        //notify callback of error
        callback(error, null);
    }
}

//using the getConnection() function
getConnection( (error, connection) => {
    if (error) {
        console.log('Error: ', error.message);
    } else {
        console.log('Connection succeeded: ', connection);
    }
} );
```

# Core Node.js

## File Based Module System

- Some points on the module system
  - each file is its own module
  - each file has access to the current module definition using the `module` variable
  - the export of current modules is determined by the `module.exports` variable
  - to import a module, use the `require` function
- there are three types of modules in Node
  1. file modules - imported w/ `require('./filename')`, using the relative file path - (discussed below)
  2. core modules
  3. external node_modules

### Require

- node.js avoids clutter in the global namespace
  - you must assign the result of `require` to a local varaible

```
var localVariable = require('./foo');
```

- node also lets you conditionally load a module

````
if (iNeedModule) { var foo = require('./foo');}```
````

- there are named exports and default exports
  - for named exports you can simply use `module.exports.someExport = ` or `exports.someExport`
    - How this works? `module.exports` is automatically assigned to `{}`, so assigning `module.exports.someExport = 'hi';` `module.exports` essentially becomes `{someExport: 'hi'}`
  - for default exports, you assign `module.exports = someExport` or `export default someExport`

```
const someExport = 'hi';
export default someExport;
/** 
 * module.exports = {'hi'}
**/
```

- node.js shares state between modules
  - if a module is modified, this change persists to all other modules that `require` it
  - in other words, the same object is returned each time a `require` call is made

```
// foo.js
module.exports = { something: 123 };

// app.js
var foo = require('./foo');
console.log(foo.something); // 123
foo.something = 456;
var bas = require('./bar');

// bar.js
var foo = require('./foo');
console.log(foo.something); // 456
```

- However, if you want to create a new object for each `require` call, you must export a function that returns a new object

```
// foo.js
module.exports = () => ({something: 123});

// app.js
var foo = require('./foo');
// creates a new object
var obj = foo();
```

```
// app.js
//you can also do this in one line
var obj = require('./foo')();
```

### Node.js Exports

- exporting multiple objects from one file
  - we can also shorten `module.exports` to `exports` when exporting as shown below

```
exports.a = function() { console.log('called a') };
exports.b = function() { console.log('called b') };
```

- you can only use `exports` to attach stuff, not assign it directly (`exports.a = 123`)
  - directly assigning an object requires the use of `module.exports = a`
- when you have multiple modules that go together that need to be imported, avoid repeating the import
  - instead create a single `index.js` in `some` folder and import all the modules once and then export them from this module

```
// index.js
exports.foo = require('./foo');
exports.bar = require('./bar');
exports.bas = require('./bas');
exports.qux = require('./qux');

// app.js
var something = require('../some/index');
something.foo();
something.bar();
```

## Important Globals

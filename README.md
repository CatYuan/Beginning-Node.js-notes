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
  - [Core Modules](#core-modules)
    - [path Module](#path-module)
    - [fs Module](#fs-module)
    - [os Module](#os-module)
    - [util Modules](#util-modules)
- [Node.js Packages](#node.js-packages)
  - [Node Modules](#node-modules)
  - [JSON](#json)
    - [JSON Global](#json-global)
  - [NPM](#npm)
    - [package.json](#package.json)
  - [Semantic Versioning](#semantic-versioning)
  - [Global Node.js Packages](#global-node.js-packages)
  - [Package.json and require](#package.json-and-require)
  - [Popular Node.js Packages](#popular-node.js-packages)
- [Events and Streams](#events-and-streams)
  - [Classical Inheritance](#Classical-Inheritance)
    - [Arriving at an Inheritance Pattern](#arriving-at-an-inheritance-pattern)
    - [The Proper Node.js Way](#the-proper-node.js-way)
    - [Overriding Functions in Child Classes](#overriding-functions-in-child-classes)
  - [Node.js Events](#node.js-events)
    - [EventEmitter Class](#eventemitter-class)
      - [Error Event](#error-event)
    - [Creating your Own Event Emitters](#creating-your-own-event-emitters)
    - [Process Events](#process-events)
  - [Streams](#streams)

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
  2. [core modules](#core-modules)
  3. [external node_modules](#node-modules)

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
  - for named exports you can simply use `module.exports.someExport =` or `exports.someExport`
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

- `__filename` and `__dirname`, these variables give you full path to the file and directory for the current module
- `process` is used ot access command line arguments
- `buffer` - allows the developer to interact with file systems

## Core Modules

- imported to a file using `require`, but you only specify the name of the module not the relative path

### path Module

- to load use `require('path')`
- what does this module do? provide string transformations that are common when working with the file system
  - why was this created? to remove inconsistencies in handling file system paths
- some common functions of this module
  - `path.normalize(str)` - removes duplicate slashes, and fixes slashes to be OS specific
  - `path.join([str1], [str2], ...)` - joins strings while taking into account the OS
  - `path.dirname`, `path.basename`, and `path.extname`
    - these functions respectively give the directory portion of a path, the name of the file, the file extension

```
var path = require('path');
var completePath = '/foo/bar/bas.html';

console.log(path.dirname(completePath)); // logs: /foo/bar
console.log(path.basename(completePath)); // logs: bas.html
console.log(path.extname(completePath)); //logs: .html
```

### fs module

- provides access to the filesystem
- used to write, read, delete, rename files
- fs has both async and sync functions

### os module

- provides basic operating system related utility functions and properties

### util Module

- contains general purpose functions
- `util.log` allows you to log something to console w/ a timestamp
- `util.format` allows you to print statements with placeholders
  - common placeholders are `%s` and `%d`

```
var util = require('util');
var name = 'nate';
var money = 33;

console.log(util.format("%s has %d dollars", name, money));
//prints "nate has 33 dollars
```

- you can also check if something is of a specific type
  - `isArray`, `isDate`, `isError`

# Node.js Packages

## Node modules

- How does node go about looking for node_modules?

  - if we `require('bar')`, the order Node.js scans the file system is in the following order
    - `/home/cat/project/node_modules/bar.js`
    - `/home/cat/node_modules/bar.js`
    - `/home/node_modules/bar.js`
    - `/node_modules/bar.js`

- For folder based modules, we require the folder bar - `require('./bar');`
  - then node will look for an `index.js` file within that folder and return that as the module file

```
// bar/bar1.js
module.exports = function() { console.log('bar1 called'); }

// bar/bar2.js
module.exports = function() { console.log('bar2 called'); }

// bar/index.js
exports.bar1 = require('./bar1');
exports.bar2 = require('./bar2');

// foo.js
var bar = require('./bar');
bar.bar1(); // logs "bar1 called"
bar.bar2(); // logs "bar2 called"
```

- When loading node_modules - `require('bar')` - if `bar` is a folder w/in `node_modules`, node still looks for an index.js file w/in `/bar/`

- Some advantages of using node modules over file-based modules
  - simplify long file relative paths
  - increases reusability - you can reuse modules between projects
  - decreases side effects
    - you can create a `node_modules` folder w/in any module and place needed submodules there, so it does not interfere w/ other modules

## JSON

- w/in the scope of node.js, JSON can be considered a subset of JS object literals
- the purpose of JSON in javaScript? - it restricts what JS object literals are alid
- Some restrictions
  - JS object keys must be surrounded by ""
    \_ ex: `var foo = {'for': 0}`
  - JS object values must be a string, number, boolean, array, null, or another VALID JSON object
  - the last property must not have an extra comma
- loading JSON in node.js
  - w/ each `require` if node cannot find a .js file, it will look for a .json file
  - so you can load json files the same way you load modules

### JSON Global

- there is a global object in JavaScript called JSON
  - it provides utility functions for converting string representation of JSON to JS objects and vice verca
    - `JSON.stringify(someJSObject)` - returns JSON string
    - `JSON.parse(someJSONString)` - returns a js object

## NPM

### package.json

- to create this file run `npm init`
- when you install an npm package you can add the package as a dependency in `package.json` using the `--save` flag
  - ex: `npm install underscore --save`
- you should exclude `node_modules` from your source control (ie. git) b/c you can retrieve a copy of all dependencies w/ `npm install`
- you can remove a dependency using `npm rm`
  - `npm rm <dependencyName> --save` will also remove the dependency from the `package.json`

## Semantic Versioning

- this means versioning your software in a way that the version numbers have significant meaning
  - Convention follows a three digit versioning scheme - X.Y.Z
    - X is the major version, Y the minor version, Z the patch version
  - patch versions are incremented if backward compatible fixes are introduced
  - minor versions are incremented if backward compatible new features are introduced
  - major versions are incremented if backward incompatible fixes/features/changes are introduced
- semantic versioning in npm
  - ~ indicates you are ok w/ all patch versions of 1.0 - `~1.0.0`
  - ^ indicates you are ok w/ any minor versions of 1 - `^1.0.0`
  - - can be used at various locations to match any number
    * `1.0.*` == `~1.0.0`
    * `1.*` == `^1.0.0`
- to update dependencies in your project and `package.json` you can run `npm update -save`

## Global Node.js Packages

- modules installed globally are not meant to be used w/ a `require` function call in your code

## Package.json and require

- you can redirect `require` to load a different file from a folder instead of the default `index.js` using the `package.json`
  - done by using the `main` property - in the package.json it would look like

```
{
  "main": "./lib/main.js"
}
```

- this means if you `require('foo')`, node looks in `foo/lib/main.js`

## Popular Node.js Packages

- check in `/popular` folder for popular packages

# Events and Streams

## Classical Inheritance

### Arriving at an inheritance pattern

- to inherit a class, we need to inherit the parent class's functunality in the new class; we need to do the following:
  1. Call the Parent constructor from the Child constructor
  2. make all parent prototype members a member of the child's prototype's prototype (setting up the prototype chain)
     - `child._proto_._proto_.someFunction` where someFunction is `parent._proto_.someFunction`

1. Calling the Parent constructor

- we use the `call()` function b/c it forces the `this` keyword to be the first parameter of the function
- if this function was not used, the `this` of the parent constructor would not refer to the Child instance

```
function Bird(name) {
  Animal.call(this, name); // calling the constructor for Animal
}
```

2. Setting up the Prototype chain

- to set up a prototype chain means to allow the child object access to the parent's functions
- this is done by setting `Child.prototype._proto_ = Parent.prototype`

```
function Animal(name) { this.name = name; }
Animal.prototype.walk = function(destination) {
  console.log(this.name, 'is walking to ', destination);
};

function Bird(name) {
  Animal.bind(this, name); // calling the parent constructor
}
Bird.prototype._proto_ = Animal.prototype; // setting up the prototype chain
Bird.prototype.fly = function(destination) {
  console.log(this.name, 'is flying to', destination);
};

// creating an instance of a Bird object
let bird = new Bird('sparrow');
bird.walk('sydney'); // 'sparrow is walking to sydney'
bird.fly('sydney'); // 'sparrow is flying to sydney'
```

- every function gets a `prototype` member.
  - Every `prototype` has a `constructor` property that points to the function itself

### The Proper Node.js Way

- However, manually modifying `_proto_` is not recommended, we can achieve this same result using the `util` library
- `util` has a function called `inherits(childClass, parentClass)`

```
var util = require('util');

function Bird(name) {
  Animal.bind(this, name); // calling the parent constructor
  // additional construction code
}
util.inherits(Bird, Animal); // setting up prototype chain
Bird.prototype.fly = (destination) => (console.log(this.name, 'flying to', destination););

var bird = new Bird('sparrow');
bird.walk('sydney'); // sparrow walking to sydney
bird.fly('sydney'); // sparrow flying to sydney
```

- with the inheritance chain setup, you can check if a particular object instance is of a particular class or its parent class using the `instanceof` keyword

### Overriding Functions in Child Classes

- to override functions of the parent class, but still use some of the original functionality, do the following
  1. Create a function on the child `prototype` with the same name
  2. call the parent function using the `call(this, original args)`

```
var inherits = require('util').inherits;

function Base() { this.message = 'message'; };
Base.prototype.foo = () => (this.message + 'base foo');

function Child() { Base.call(this); };
inherits(Child, Base);

// overridig parent behavior
Child.prototype.foo = function() {
  return Base.prototype.foo.call(this) + 'child foo';
}

// testing
var child = new Child()
console.log(child.foo()) // 'message base foo child foo'
```

## Node.js events

### EventEmitter Class

- node has support for events in the core module `events`
  - `require('events')`
  - the events module has one class `EventEmitter`
- the purpose of EventEmitter class: to emit events and subscribe to raised events

```
// to subscribe to an event
emitter.on('eventName',
    function handleEvent(arg1, arg2, ...) { /** do something **/});
```

- the handleEvent function is also called a **listener**

```
// to raise/emit an event
emitter.emit('eventName', {arg1: 123}, {arg2: 456});
```

- when you have multiple subscribers to an event, they are called in the order that they are registered
- arguments passed in for the event are shared between subscribers as well
- to unsubscribe from an event use the `removeListener` function
  - you must pass in a reference to the function you want to remove to the `removeListener` - this means your listeners should not be anonymous functions

```
// example removing a listener
var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();
var fooHandler = () => {
  console.log('handler called');

  // removes the listener after it has been called once
  emitter.removeListener('foo', fooHandler);
}

// emit twice
emitter.emit('foo'); // prints 'handler called'
emitter.emit('foo'); // event is unnoticed
```

- EventEmitter provides a `once` function that calls the registered listener only once
  - this simplifies the above code example

```
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

emitter.once('foo', function() {
  console.log('foo has been raised');
})

emitter.emit('foo'); // foo has been raised
emitter.emit('foo'); //event is unnoticed
```

- EventEmitters has a `listeners('eventName')` function that returns all listeners subscribed to that event
- EventEmitter also raises a `newListener` and `removeListener` event on the subscription or unsubscribtion of a listener
- EventEmitter allows up to 10 listeners for each event type
  - Issues ussually appear when people add listeners in a callback and forget to unsubscribe
    - Solution: create a new event emitter in the callback. The event emitter and the listeners will be disposed after the callback terminates

#### Error Event

- the `error` event is a special condition. The code will print a stack trace and exit if this event does not have a listener

```
const EventEmitter = require('event').EventEmitter;
const emitter = new EventEmitter()

emitter.emit('error', new Error('Some error message')); // the code exits here
console.log('this line never executes');
```

- when to raise an `error` event? - in cercumstances where an `error` event **must** be handled.

### Creating your Own Event Emitters

### Process Events

## Streams

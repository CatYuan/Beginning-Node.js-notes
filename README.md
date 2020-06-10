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

## Understanding Node.js

### Functions

#### Immediately Executing Functions

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

#### Higher-Order Functions

- What are they? - Functions that take functions as arguments

```
setTimeout(function () {
    console.log('2 seconds have passed since start of demo');
}, 2000);
```

### Closures

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

### Thread Starvation

- Node.js is single threaded event loop. A process that takes a long time to run, will hold up the event loop and make the application slow

### Data Intensive Applications

- Node.js is great for data-intensive applications

### Truthy and Falsy

- Truthy values behave like `true` and falsy values behave like `false`
  - `null`, `undefined`, `0`, and the empty string (`''`) are falsy
- In the case of `null` and `undefined` it's better to use an `if/else/!`

```
if (!false) {...}
if (!null) {...}
if (!undefined) {...}
```

### Prototype

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

### Error Handling

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

## Core Node.js

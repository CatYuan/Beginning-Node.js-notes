# Beginning-Node.js-notes

* [Understanding Node.js](#understanding-node.js)

## Understanding Node.js
### Functions
#### Immediately Executing Functions
```
(function foo() {
    console.log('foo was executed!');
})();
```
* What's the purpose?
  * to create a new variable scope
  * functions are the only recommended way of creating a new variable scope in Java Script
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
* What are they? - Functions that take functions as arguments
```
setTimeout(function () {
    console.log('2 seconds have passed since start of demo');
}, 2000);
```

### Closures
* When a function is declared in another function, the inner function has access to the variables in the outer function
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
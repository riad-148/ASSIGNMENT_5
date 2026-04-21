
 1 . What is the difference between var, let, and const?

var : Function-scoped variable that can be redeclared and updated. It has hoisting behavior where the variable is moved to the top of its scope.

let : Block-scoped variable that can be updated but not redeclared within the same scope. It doesn't have hoisting issues like var.

const : Block-scoped variable that cannot be updated or redeclared. It must be initialized at declaration. Used for constants.


 2️. What is the spread operator (...)? 

The spread operator (...) allows an iterable (like an array or object) to be expanded in places where zero or more arguments or elements are expected. It can be used to:
- Copy arrays/objects
- Merge arrays/objects  
- Convert iterables to arrays
- Pass array elements as function arguments


3️ What is the difference between map(), filter(), and forEach()?
map() : Creates a new array by calling a function on every element of the original array. Returns a new array of the same length.

filter() : Creates a new array with all elements that pass a test implemented by the provided function. Returns a subset of the original array.

forEach(): Executes a provided function once for each array element. Doesn't return anything (undefined).


4️ What is an arrow function?

Arrow functions are a concise syntax for writing function expressions in JavaScript. They use => syntax and have these characteristics:
- Shorter syntax than traditional functions
- Don't have their own 'this' binding (inherit from parent scope)
- Cannot be used as constructors
- Don't have 'arguments' object

5️ What are template literals?

Template literals are string literals that allow embedded expressions and multi-line strings. They use backticks (`) instead of quotes and can:
- Interpolate variables with ${variable}
- Span multiple lines
- Include expressions that get evaluated
- Be nested





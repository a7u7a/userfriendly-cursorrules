# Study notes

Some study notes for the FEE at AWS application

## Time Complexity

- Constant -> O(1)
- Logarithmic -> O(log n)
- Linear -> O(n)
- Log-Linear -> O(n log(n))
- Quadratic -> O(n²)
- Exponential -> O(2ⁿ)

![Time complexity graph](/imgs/time_complex.jpeg)

## Data structures

### Arrays and Objects

```js
// Arrays
const arr = [1, 2, 3];

// Common operations
arr.push(4);        // O(1)
arr.pop();          // O(1)
arr.unshift(0);     // O(n)
arr.shift();        // O(n)
arr.slice();        // O(n)
arr.splice();       // O(n)

// Objects
const obj = {
  key: 'value'
};

// Common operations
obj.key;            // O(1)
obj['key'];         // O(1)
delete obj.key;     // O(1)
Object.keys(obj);   // O(n)
```

### Sets and Maps

```js
// Sets - good for unique values
const set = new Set([1, 2, 2, 3]); // [1, 2, 3]
set.add(4);         // O(1)
set.has(4);         // O(1)
set.delete(4);      // O(1)

// Maps - good for key-value pairs with non-string keys
const map = new Map();
map.set('key', 'value');
map.get('key');     // O(1)
map.has('key');     // O(1)
map.delete('key');  // O(1)
```

### Stack and Queue

```js
// Stack (LIFO) - using Array
class Stack {
  constructor() {
    this.items = [];
  }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}

// Queue (FIFO) - using Array
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.items.shift(); }
  peek() { return this.items[0]; }
}
```

### Tree-like Structures

```js
// Common in DOM manipulation and state management
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(child) {
    this.children.push(child);
  }
}
````

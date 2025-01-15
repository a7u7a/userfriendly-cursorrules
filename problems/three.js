/**
Given two integers, /and r, print all the odd numbers between /and r (land r inclusive).
Complete the oddNumbers function in the editor below. It has 2 parameters.
1. An integer, I, denoting the left part of the range.
2. An integer, r, denoting the right part of the range.
The function must return an array of integers denoting the odd numbers between /and r.
*/

function oddNumbers(l, r) {
  // Using Array.from() with map and filter
  return Array.from(
    { length: r - l + 1 }, // Creates an array of undefined values length: r-l+1
    (_, i) => l + i 
  ).filter(num => num % 2 !== 0);
}


console.log("oddNumbers", oddNumbers(1, 99));

const l = 5
const r = 20

const testArray = Array.from({ length: r - l + 1 }, (_, i) => l + i)
console.log("testArray", testArray);
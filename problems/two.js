/**
Given an unsorted array of n elements, find if the element k is present in the array or not.
Complete the findNumber function in the editor below. It has 2 parameters:
1. An array of integers, arr, denoting the elements in the array.
2. An integer, k, denoting the element to be searched in the array.
The function must return a string "YES" or
"NO" denoting if the element is present in the array or not. 
*/

function findNumber(arr, k) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === k) {
      return "YES"
    }
  }
  return "NO"
}

const arr = [5, 8, 9, 45, 3, 8, 4, 1, 2, 12]

console.log("Result", findNumber(arr, 8));

/**
  The kth Factor of n
  You are given two positive integers n and k. A factor of an integer n is defined as an integer i where n % i == 0.

  Consider a list of all factors of n sorted in ascending order, return the kth factor in this list or return -1 if n has less than k factors.

  Example 1:

  Input: n = 12, k = 3
  Output: 3
  Explanation: Factors list is [1, 2, 3, 4, 6, 12], the 3rd factor is 3.
  Example 2:

  Input: n = 7, k = 2
  Output: 7
  Explanation: Factors list is [1, 7], the 2nd factor is 7.
  Example 3:

  Input: n = 4, k = 4
  Output: -1
  Explanation: Factors list is [1, 2, 4], there is only 3 factors. We should return -1.
 */

function kthFactor(n, k) {
  const factors = []
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      factors.push(i)
    }
  }
  return k <= factors.length ? factors[k - 1] : -1
}

console.log("kthFactor", kthFactor(100000, 5));


/**
  Here the key insight is that factors always come in pairs:
  If i is a factor of n, then n/i is also a factor
*/

function kthFactorOptimized(n, k) {
  const factors = [];
  // Only need to check up to square root of n
  for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
          factors.push(i);
          // If n/i is different from i, add it to factors
          if (i !== n/i) {
              factors.push(n/i);
          }
      }
  }
  // Sort factors in ascending order
  factors.sort((a, b) => a - b);
  
  // Return -1 if k is larger than number of factors
  return k <= factors.length ? factors[k-1] : -1;
}


console.log("kthFactorOptimized", kthFactorOptimized(100000, 5));
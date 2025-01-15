
/**
  Given a string s, partition the string into one or more substrings such that the characters in each substring are unique. That is, no letter appears in a single substring more than once.
  Return the minimum number of substrings in such a partition.

  Note that each character should belong to exactly one substring in a partition.

  Example 1:

  Input: s = "abacaba"
  Output: 4
  Explanation:
  Two possible partitions are ("a","ba","cab","a") and ("ab","a","ca","ba"). "ab", "ac", "ab", "a"
  It can be shown that 4 is the minimum number of substrings needed.
  Example 2:

  Input: s = "ssssss"
  Output: 6
  Explanation:
  The only valid partition is ("s","s","s","s","s","s").
*/

// My solution
function partitionString(s) {
  const partitions = []
  let currentPartition = []
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (currentPartition.includes(c)) {
      partitions.push(currentPartition)
      currentPartition = []
    }
    currentPartition.push(c)
    if (i === s.length - 1) {
      partitions.push(currentPartition)
    }
  }
  return partitions.length
}

console.log("partitionString", partitionString("abacaba"));

console.log("partitionString", partitionString("ssssss"));




/**
 * Optimized version
 */

function partitionStringOpti(s) {
  let partitionCount = 1  // Start with 1 since we'll always have at least one partition
  let currentChars = new Set()  // Use Set for O(1) lookup

  for (const char of s) {
    if (currentChars.has(char)) {
      // If we find a duplicate, start a new partition
      partitionCount++
      currentChars.clear()
    }
    currentChars.add(char)
  }
  return partitionCount
}

console.log("partitionString", partitionStringOpti("abacaba")); // 4
console.log("partitionString", partitionStringOpti("ssssss")); // 6
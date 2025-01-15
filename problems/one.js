
// Returns a list of users that have a number of transactions above a threshold
function processLogs(logs, threshold) {
  // Create a Map to store user transaction counts
  const userCounts = new Map()

  // Process each log entry
  for (const log of logs) {
    const [sender, recipient, _] = log.split(" ")

    // Increment sender count
    userCounts.set(sender, (userCounts.get(sender) || 0) + 1)
    // Increment recipient count (if different from sender)
    if (sender !== recipient) {
      userCounts.set(recipient, (userCounts.get(recipient) || 0) + 1)
    }
  }
  // console.log("userCounts", userCounts);
  // Filter users above threshold and sort
  return Array.from(userCounts.entries())
    .filter(([_, count]) => count >= threshold)
    .map(([userId, _]) => userId)
    .sort((a, b) => Number(a) - Number(b))
}

const test = ["9 7 50", "22 7 20", "1 9 100", "7 7 20"]
const results = processLogs(test, 2)
console.log("Result", results)
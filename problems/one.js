/** 
Your Amazonian team is responsible for maintaining a monetary transaction service. The transactions are tracked in a log file.
A log file is provided as a string array where each entry represents a transaction to service. Each transaction consists of:
• sender user id: Unique identifier for the user that initiated the transaction. It consists of only digits with at most 9 digits.
• recipient user id: Unique identifier for the user that is receiving the transaction. It consists of only digits with at most 9 digits.
• amount_of transaction: The amount of the transaction. It consists of only digits with at most 9 digits.
The values are separated by a space. For example, "sender_user_id recipient_user_id amount of transaction".
Users that perform an excessive amount of transactions might be abusing the service so you have been tasked to identify the users that have a number of transactions over a threshold. The list of user ids should be ordered in ascending numeric value.

Example
logs = ["88 99 200", "88 99 300", "99 32 100", " 12
12 15"7
threshold = 2 
*/


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

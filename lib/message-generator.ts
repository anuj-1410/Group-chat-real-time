// Sample messages for simulation
const sampleMessages = [
  "Hey, how's everyone doing today?",
  "Just finished that report we were working on!",
  "Has anyone seen the latest project requirements?",
  "I'll be out of office tomorrow, FYI.",
  "Can someone help me with the database issue?",
  "The client loved our presentation!",
  "Meeting in 10 minutes, don't forget.",
  "Who's handling the deployment today?",
  "I found a bug in the latest release.",
  "Great work on the new feature, team!",
  "Does anyone have the login details for the test environment?",
  "I'm still working on those UI improvements.",
  "Let's discuss this in our standup tomorrow.",
  "The API is down again, looking into it now.",
  "Just pushed my changes, can someone review?",
]

export function generateRandomMessage(): string {
  const randomIndex = Math.floor(Math.random() * sampleMessages.length)
  return sampleMessages[randomIndex]
}

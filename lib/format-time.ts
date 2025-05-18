export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()

  // If the message is from today, just show the time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // If the message is from yesterday, show "Yesterday" and the time
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  // Otherwise, show the date and time
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

import type { Message, User } from "@/types/chat"
import MessageItem from "./message-item"
import TypingIndicator from "./typing-indicator"
import type { RefObject } from "react"

interface MessageListProps {
  messages: Message[]
  typingUsers: string[]
  users: User[]
  currentUser: User
  messagesEndRef: RefObject<HTMLDivElement>
  onDeleteMessage: (messageId: string, deleteType: "for_me" | "for_everyone") => void
}

export default function MessageList({
  messages,
  typingUsers,
  users,
  currentUser,
  messagesEndRef,
  onDeleteMessage,
}: MessageListProps) {
  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {}

  messages.forEach((message) => {
    // Skip messages deleted for the current user
    if (message.deletedForMe && message.deletedForMe.includes(currentUser.id)) {
      return
    }

    const date = new Date(message.timestamp).toLocaleDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  // Get typing users' data
  const typingUsersData = users.filter((user) => typingUsers.includes(user.id) && !user.isCurrentUser)

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300">
              {date === new Date().toLocaleDateString() ? "Today" : date}
            </div>
          </div>

          {dateMessages.map((message, index) => {
            // Check if this message is from the same user as the previous one
            const prevMessage = index > 0 ? dateMessages[index - 1] : null
            const showAvatar = !prevMessage || prevMessage.user.id !== message.user.id || prevMessage.deleted

            return (
              <MessageItem
                key={message.id}
                message={message}
                showAvatar={showAvatar}
                currentUser={currentUser}
                onDeleteMessage={onDeleteMessage}
              />
            )
          })}
        </div>
      ))}

      {typingUsersData.length > 0 && (
        <div className="mt-2">
          <TypingIndicator users={typingUsersData} />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

import type { User } from "@/types/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TypingIndicatorProps {
  users: User[]
}

export default function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-white dark:border-gray-800">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>

      <div className="flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {users.length === 1
            ? `${users[0].name} is typing`
            : users.length === 2
              ? `${users[0].name} and ${users[1].name} are typing`
              : users.length === 3
                ? `${users[0].name}, ${users[1].name}, and ${users[2].name} are typing`
                : `${users.length} people are typing`}
        </span>
        <span className="ml-1 flex">
          <span
            className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-gray-500 dark:bg-gray-400"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-gray-500 dark:bg-gray-400"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-gray-500 dark:bg-gray-400"
            style={{ animationDelay: "300ms" }}
          ></span>
        </span>
      </div>
    </div>
  )
}

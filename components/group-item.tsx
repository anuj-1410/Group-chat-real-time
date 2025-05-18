"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import type { UserGroup } from "@/types/chat"

interface GroupItemProps {
  group: UserGroup
  isSelected?: boolean
  onClick: () => void
}

export default function GroupItem({ group, isSelected = false, onClick }: GroupItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center p-1 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={group.avatar || "/placeholder.svg?height=48&width=48"} alt={group.name} />
        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={`font-medium truncate ${isSelected ? "text-blue-600 dark:text-blue-400" : ""}`}>
            {group.name}
          </h4>
          {group.lastMessage && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(group.lastMessage.timestamp), { addSuffix: true })}
            </span>
          )}
        </div>

        {group.lastMessage && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{group.lastMessage.sender}: </span>
            {group.lastMessage.content}
          </p>
        )}
      </div>

      {group.unreadCount > 0 && (
        <div className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
          {group.unreadCount}
        </div>
      )}
    </motion.div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Edit, Users, MoreVertical, Check, X, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import type { User, GroupInfo } from "@/types/chat"

interface GroupHeaderProps {
  groupInfo: GroupInfo
  members: User[]
  currentUser: User
  onGroupNameChange: (newName: string) => void
  onAddMemberClick: () => void
  onManageMembersClick: () => void
}

export default function GroupHeader({
  groupInfo,
  members,
  currentUser,
  onGroupNameChange,
  onAddMemberClick,
  onManageMembersClick,
}: GroupHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [groupName, setGroupName] = useState(groupInfo.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const isAdmin = currentUser.isAdmin

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setGroupName(groupInfo.name)
  }, [groupInfo.name])

  const handleSave = () => {
    if (groupName.trim()) {
      onGroupNameChange(groupName)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setGroupName(groupInfo.name)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  return (
    <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
      <div className="flex items-center">
        <div className="relative">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="border-2 border-white dark:border-gray-800">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          {members.length > 3 && (
            <div className="absolute -bottom-1 -right-1 bg-gray-100 dark:bg-gray-700 rounded-full px-1.5 py-0.5 text-xs border border-white dark:border-gray-800">
              +{members.length - 3}
            </div>
          )}
        </div>

        <div className="ml-3">
          {isEditing ? (
            <div className="flex items-center">
              <Input
                ref={inputRef}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 w-48 mr-2"
                maxLength={30}
              />
              <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="font-semibold text-lg">{groupInfo.name}</h2>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="ml-1 h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit group name</span>
                </Button>
              )}
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">{members.length} members</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Enhanced Member Management Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onManageMembersClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 border-0"
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            <span className="mr-1">Members</span>
            <span className="inline-flex items-center justify-center bg-white bg-opacity-20 rounded-full h-5 w-5 text-xs font-medium">
              {members.length}
            </span>
          </Button>
        </motion.div>

        {/* Add Member Button (Admin only) */}
        {isAdmin && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onAddMemberClick}
              variant="outline"
              size="sm"
              className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </motion.div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <DropdownMenuItem className="rounded-lg cursor-pointer flex items-center h-9 px-3 text-sm">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Group Info
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg cursor-pointer flex items-center h-9 px-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              Leave Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

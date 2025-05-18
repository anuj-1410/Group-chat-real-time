"use client"

import { useState } from "react"
import { MoreVertical, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import MessageAttachments from "./message-attachments"
import type { Message, User } from "@/types/chat"
import { formatMessageTime } from "@/lib/format-time"

interface MessageItemProps {
  message: Message
  showAvatar: boolean
  currentUser: User
  onDeleteMessage: (messageId: string, deleteType: "for_me" | "for_everyone") => void
}

export default function MessageItem({ message, showAvatar, currentUser, onDeleteMessage }: MessageItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isCurrentUser = message.user.isCurrentUser
  const canDelete = currentUser.isAdmin || isCurrentUser
  const hasAttachments = message.attachments && message.attachments.length > 0
  const [deleteType, setDeleteType] = useState<"for_me" | "for_everyone">("for_me")

  const handleDelete = () => {
    try {
      onDeleteMessage(message.id, deleteType)
      setConfirmDelete(false)
    } catch (error) {
      console.error("Error deleting message:", error)
      // Could add error handling UI here
    }
  }

  const openDeleteDialog = (type: "for_me" | "for_everyone") => {
    setDeleteType(type)
    setConfirmDelete(true)
  }

  if (message.deleted) {
    return (
      <div className="flex justify-center my-2">
        <div className="text-xs text-gray-500 italic bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          This message was deleted
        </div>
      </div>
    )
  }

  if (message.deletedForMe && message.deletedForMe.includes(currentUser.id)) {
    return null // Don't show messages deleted for current user
  }

  return (
    <>
      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2 group`}>
        <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} max-w-[80%]`}>
          {showAvatar ? (
            <div className={`flex-shrink-0 ${isCurrentUser ? "ml-2" : "mr-2"}`}>
              <Avatar>
                <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.name} />
                <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className={`flex-shrink-0 ${isCurrentUser ? "ml-2" : "mr-2"} w-10`}></div>
          )}

          <div className="flex flex-col">
            {showAvatar && (
              <div className={`flex items-center mb-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <span className="text-xs text-gray-500">{message.user.name}</span>
                {message.user.isAdmin && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            )}

            <div className="flex items-end group">
              <div
                className={`px-4 py-2 rounded-2xl ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                {hasAttachments && <MessageAttachments attachments={message.attachments!} />}
              </div>

              <div className="flex items-center mx-2">
                <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp)}</span>

                {canDelete && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">Message options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                        <DropdownMenuItem onClick={() => openDeleteDialog("for_me")} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete for me
                        </DropdownMenuItem>
                        {(isCurrentUser || currentUser.isAdmin) && (
                          <DropdownMenuItem onClick={() => openDeleteDialog("for_everyone")} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete for everyone
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteType === "for_me" ? "Delete Message For Me" : "Delete Message For Everyone"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === "for_me"
                ? "This message will be removed from your view but will still be visible to others."
                : "This message will be deleted for everyone in the group. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

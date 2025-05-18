"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import MessageList from "./message-list"
import GroupHeader from "./group-header"
import MemberManagementModal from "./member-management-modal"
import EmojiPicker from "./emoji-picker"
import FileUpload from "./file-upload"
import ChatLayout from "./chat-layout"
import type {
  Message,
  User,
  GroupInfo,
  Attachment,
  UserGroup,
  NotificationSettings,
  PrivacySettings,
} from "@/types/chat"
import { generateRandomMessage } from "@/lib/message-generator"
import { useMobile } from "@/hooks/use-mobile"

// Sample users
const initialUsers: User[] = [
  {
    id: "1",
    name: "You",
    email: "you@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    isCurrentUser: true,
    isAdmin: true,
    status: "Available",
  },
  {
    id: "2",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 987-6543",
    avatar: "/placeholder.svg?height=40&width=40",
    isCurrentUser: false,
  },
  {
    id: "3",
    name: "Sam Wilson",
    email: "sam@example.com",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    isCurrentUser: false,
  },
  {
    id: "4",
    name: "Taylor Kim",
    email: "taylor@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    isCurrentUser: false,
  },
]

// Initial groups
const initialGroups: Record<
  string,
  {
    info: GroupInfo
    messages: Message[]
  }
> = {
  group1: {
    info: {
      id: "group1",
      name: "Project Team",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      adminId: "1", // Current user is admin
      members: initialUsers.map((user) => user.id),
    },
    messages: [
      {
        id: "1",
        content: "Hey everyone! How's it going?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: initialUsers[1],
      },
      {
        id: "2",
        content: "Just finished that project we were working on!",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        user: initialUsers[2],
      },
      {
        id: "3",
        content: "That's awesome! Can you share the details?",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        user: initialUsers[3],
        attachments: [
          {
            id: "file-1",
            name: "project-report.pdf",
            type: "application/pdf",
            size: 2500000,
            url: "#project-report.pdf",
          },
        ],
      },
    ],
  },
  group2: {
    info: {
      id: "group2",
      name: "Marketing Team",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      adminId: "2",
      members: ["1", "2", "4"],
    },
    messages: [
      {
        id: "1",
        content: "Let's discuss the new campaign tomorrow",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: initialUsers[1],
      },
      {
        id: "2",
        content: "I've prepared some mockups for the social media posts",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        user: initialUsers[3],
      },
    ],
  },
  group3: {
    info: {
      id: "group3",
      name: "Friends",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
      adminId: "3",
      members: ["1", "2", "3", "4"],
    },
    messages: [
      {
        id: "1",
        content: "Movie night this weekend?",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        user: initialUsers[2],
      },
      {
        id: "2",
        content: "I'm in! What are we watching?",
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        user: initialUsers[3],
      },
      {
        id: "3",
        content: "How about the new sci-fi movie?",
        timestamp: new Date(Date.now() - 79200000).toISOString(),
        user: initialUsers[1],
      },
    ],
  },
}

// Sample user groups
const initialUserGroups: UserGroup[] = [
  {
    id: "group1",
    name: "Project Team",
    unreadCount: 0,
    lastMessage: {
      content: "That's awesome! Can you share the details?",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      sender: "Taylor",
    },
  },
  {
    id: "group2",
    name: "Marketing Team",
    unreadCount: 3,
    lastMessage: {
      content: "I've prepared some mockups for the social media posts",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      sender: "Taylor",
    },
  },
  {
    id: "group3",
    name: "Friends",
    unreadCount: 2,
    lastMessage: {
      content: "How about the new sci-fi movie?",
      timestamp: new Date(Date.now() - 79200000).toISOString(),
      sender: "Alex",
    },
  },
]

// Initial settings
const initialNotificationSettings: NotificationSettings = {
  groupNotifications: true,
  messagePreview: true,
  sound: true,
  vibration: true,
}

const initialPrivacySettings: PrivacySettings = {
  lastSeen: "everyone",
  profilePhoto: "everyone",
  status: "everyone",
  readReceipts: true,
}

export default function ChatInterface() {
  const [selectedGroupId, setSelectedGroupId] = useState("group1")
  const [groups, setGroups] = useState(initialGroups)
  const [messages, setMessages] = useState<Message[]>(initialGroups.group1.messages)
  const [newMessage, setNewMessage] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [userGroups, setUserGroups] = useState<UserGroup[]>(initialUserGroups)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    groupNotifications: true,
    messagePreview: true,
    sound: true,
    vibration: true,
  })
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    lastSeen: "everyone",
    profilePhoto: "everyone",
    status: "everyone",
    readReceipts: true,
  })
  const [isSignedOut, setIsSignedOut] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const { toast } = useToast()
  const currentUser = users.find((user) => user.isCurrentUser) || users[0]

  // Update messages when selected group changes
  useEffect(() => {
    if (groups[selectedGroupId]) {
      setMessages(groups[selectedGroupId].messages)

      // Mark messages as read when selecting a group
      setUserGroups((prev) =>
        prev.map((group) => (group.id === selectedGroupId ? { ...group, unreadCount: 0 } : group)),
      )
    }
  }, [selectedGroupId, groups])

  // Simulate receiving messages
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance of receiving a message
      if (Math.random() < 0.3) {
        // Pick a random group
        const groupIds = Object.keys(groups)
        const randomGroupId = groupIds[Math.floor(Math.random() * groupIds.length)]

        // Pick a random user from that group
        const groupMembers = groups[randomGroupId].info.members
        const nonCurrentUserIds = groupMembers.filter((id) => id !== currentUser.id)
        const randomUserId = nonCurrentUserIds[Math.floor(Math.random() * nonCurrentUserIds.length)]
        const user = users.find((u) => u.id === randomUserId) || users[1]

        // First show typing indicator if it's the selected group
        if (randomGroupId === selectedGroupId) {
          setTypingUsers((prev) => [...prev, user.id])
        }

        // Then after a delay, add the message
        setTimeout(
          () => {
            const newMsg = {
              id: Date.now().toString(),
              content: generateRandomMessage(),
              timestamp: new Date().toISOString(),
              user,
            }

            // Add message to the group
            setGroups((prev) => ({
              ...prev,
              [randomGroupId]: {
                ...prev[randomGroupId],
                messages: [...prev[randomGroupId].messages, newMsg],
              },
            }))

            // If this is the selected group, update the messages state
            if (randomGroupId === selectedGroupId) {
              setMessages((prev) => [...prev, newMsg])
              setTypingUsers((prev) => prev.filter((id) => id !== user.id))
            } else {
              // Otherwise, increment the unread count
              setUserGroups((prev) =>
                prev.map((group) =>
                  group.id === randomGroupId
                    ? {
                        ...group,
                        unreadCount: group.unreadCount + 1,
                        lastMessage: {
                          content: newMsg.content,
                          timestamp: newMsg.timestamp,
                          sender: user.name,
                        },
                      }
                    : group,
                ),
              )
            }
          },
          Math.random() * 2000 + 1000,
        )
      }
    }, 10000) // Less frequent messages for demo

    return () => clearInterval(interval)
  }, [selectedGroupId, groups, users, currentUser.id])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && pendingAttachments.length === 0) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      user: currentUser,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
    }

    try {
      // Add message to both states
      setMessages((prev) => [...prev, message])
      setGroups((prev) => ({
        ...prev,
        [selectedGroupId]: {
          ...prev[selectedGroupId],
          messages: [...prev[selectedGroupId].messages, message],
        },
      }))

      // Update last message in user groups
      setUserGroups((prev) =>
        prev.map((group) =>
          group.id === selectedGroupId
            ? {
                ...group,
                lastMessage: {
                  content: message.content,
                  timestamp: message.timestamp,
                  sender: "You",
                },
              }
            : group,
        ),
      )

      setNewMessage("")
      setPendingAttachments([])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  const handleFileSelect = (files: Attachment[]) => {
    setPendingAttachments((prev) => [...prev, ...files])
  }

  const handleGroupNameChange = (newName: string) => {
    try {
      // Update group info
      setGroups((prev) => ({
        ...prev,
        [selectedGroupId]: {
          ...prev[selectedGroupId],
          info: {
            ...prev[selectedGroupId].info,
            name: newName,
          },
        },
      }))

      // Also update in user groups
      setUserGroups((prev) => prev.map((group) => (group.id === selectedGroupId ? { ...group, name: newName } : group)))

      toast({
        title: "Group Updated",
        description: "Group name has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating group name:", error)
      toast({
        title: "Error",
        description: "Failed to update group name. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddMember = (email: string, phone?: string) => {
    try {
      // In a real app, this would send an invitation
      // For this mockup, we'll just add a new user
      let newUserName = ""

      if (email) {
        newUserName = email.split("@")[0] // Use part before @ as name
      } else if (phone) {
        newUserName = `User (${phone.slice(-4)})` // Use last 4 digits of phone
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: newUserName,
        email: email || "",
        phone: phone,
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: false,
      }

      setUsers((prev) => [...prev, newUser])

      // Also update group members
      setGroups((prev) => ({
        ...prev,
        [selectedGroupId]: {
          ...prev[selectedGroupId],
          info: {
            ...prev[selectedGroupId].info,
            members: [...prev[selectedGroupId].info.members, newUser.id],
          },
        },
      }))

      toast({
        title: "Member Added",
        description: `${newUserName} has been added to the group.`,
      })
    } catch (error) {
      console.error("Error adding member:", error)
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = (userId: string) => {
    try {
      // Don't allow removing yourself
      if (userId === currentUser.id) {
        toast({
          title: "Error",
          description: "You cannot remove yourself from the group.",
          variant: "destructive",
        })
        return
      }

      const memberToRemove = users.find((user) => user.id === userId)

      // Remove user from users list (in a real app, you'd just remove from group)
      setUsers((prev) => prev.filter((user) => user.id !== userId))

      // Also update group members
      setGroups((prev) => ({
        ...prev,
        [selectedGroupId]: {
          ...prev[selectedGroupId],
          info: {
            ...prev[selectedGroupId].info,
            members: prev[selectedGroupId].info.members.filter((id) => id !== userId),
          },
        },
      }))

      toast({
        title: "Member Removed",
        description: `${memberToRemove?.name || "Member"} has been removed from the group.`,
      })
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMessage = (messageId: string, deleteType: "for_me" | "for_everyone") => {
    try {
      if (deleteType === "for_everyone") {
        // Mark message as deleted for everyone
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, deleted: true } : msg)))

        // Update in groups state
        setGroups((prev) => ({
          ...prev,
          [selectedGroupId]: {
            ...prev[selectedGroupId],
            messages: prev[selectedGroupId].messages.map((msg) =>
              msg.id === messageId ? { ...msg, deleted: true } : msg,
            ),
          },
        }))

        toast({
          title: "Message Deleted",
          description: "Message has been deleted for everyone.",
        })
      } else {
        // Mark message as deleted just for current user
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              return {
                ...msg,
                deletedForMe: [...(msg.deletedForMe || []), currentUser.id],
              }
            }
            return msg
          }),
        )

        // Update in groups state
        setGroups((prev) => ({
          ...prev,
          [selectedGroupId]: {
            ...prev[selectedGroupId],
            messages: prev[selectedGroupId].messages.map((msg) =>
              msg.id === messageId ? { ...msg, deletedForMe: [...(msg.deletedForMe || []), currentUser.id] } : msg,
            ),
          },
        }))

        toast({
          title: "Message Deleted",
          description: "Message has been deleted for you.",
        })
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProfile = (updatedUser: Partial<User>) => {
    try {
      setUsers((prev) => prev.map((user) => (user.isCurrentUser ? { ...user, ...updatedUser } : user)))

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateGroup = (name: string) => {
    try {
      const newGroupId = `group-${Date.now()}`

      // Create new group info
      const newGroupInfo: GroupInfo = {
        id: newGroupId,
        name,
        createdAt: new Date().toISOString(),
        adminId: currentUser.id,
        members: [currentUser.id],
      }

      // Add to groups
      setGroups((prev) => ({
        ...prev,
        [newGroupId]: {
          info: newGroupInfo,
          messages: [],
        },
      }))

      // Add to user groups
      const newGroup: UserGroup = {
        id: newGroupId,
        name,
        unreadCount: 0,
        lastMessage: {
          content: "Group created",
          timestamp: new Date().toISOString(),
          sender: currentUser.name,
        },
      }
      setUserGroups((prev) => [...prev, newGroup])

      // Select the new group
      setSelectedGroupId(newGroupId)

      toast({
        title: "Group Created",
        description: `"${name}" group has been created successfully.`,
      })
    } catch (error) {
      console.error("Error creating group:", error)
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleJoinGroup = (id: string) => {
    // In a real app, this would send a request to join the group
    console.log(`Joining group ${id}`)
  }

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  const handleUpdateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    try {
      setNotificationSettings((prev) => ({
        ...prev,
        ...settings,
      }))

      toast({
        title: "Settings Updated",
        description: "Notification settings have been updated.",
      })
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    try {
      setPrivacySettings((prev) => ({
        ...prev,
        ...settings,
      }))

      toast({
        title: "Settings Updated",
        description: "Privacy settings have been updated.",
      })
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = () => {
    try {
      // In a real app, this would clear auth tokens, etc.
      setIsSignedOut(true)

      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      })

      // Redirect to login page in a real app
      // For this demo, we'll just show a message
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isSignedOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">You have been signed out</h1>
          <p className="mb-4">Redirecting to login page...</p>
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    )
  }

  const handleAddMemberClick = () => {
    setIsMemberModalOpen(true)
  }

  return (
    <ChatLayout
      currentUser={currentUser}
      userGroups={userGroups}
      selectedGroupId={selectedGroupId}
      notificationSettings={notificationSettings}
      privacySettings={privacySettings}
      onSelectGroup={handleSelectGroup}
      onUpdateProfile={handleUpdateProfile}
      onCreateGroup={handleCreateGroup}
      onJoinGroup={handleJoinGroup}
      onUpdateNotificationSettings={handleUpdateNotificationSettings}
      onUpdatePrivacySettings={handleUpdatePrivacySettings}
      onSignOut={handleSignOut}
    >
      <Card className="flex flex-col h-full shadow-lg">
        <GroupHeader
          groupInfo={groups[selectedGroupId]?.info || initialGroups.group1.info}
          members={users.filter((user) => groups[selectedGroupId]?.info.members.includes(user.id))}
          currentUser={currentUser}
          onGroupNameChange={handleGroupNameChange}
          onAddMemberClick={handleAddMemberClick}
          onManageMembersClick={() => setIsMemberModalOpen(true)}
        />

        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            typingUsers={typingUsers}
            users={users}
            currentUser={currentUser}
            messagesEndRef={messagesEndRef}
            onDeleteMessage={handleDeleteMessage}
          />
        </div>

        <div className="p-4 border-t">
          {pendingAttachments.length > 0 && (
            <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Attachments ({pendingAttachments.length})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-red-600"
                  onClick={() => setPendingAttachments([])}
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {pendingAttachments.map((file, index) => (
                  <div key={file.id} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded flex items-center">
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setPendingAttachments((prev) => prev.filter((_, i) => i !== index))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <FileUpload onFileSelect={handleFileSelect} />

            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1"
            />

            <EmojiPicker onEmojiSelect={handleEmojiSelect} />

            <Button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === "" && pendingAttachments.length === 0}
              size={isMobile ? "icon" : "default"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isMobile ? (
                <Send className="h-5 w-5" />
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>

        <MemberManagementModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          members={users.filter((user) => groups[selectedGroupId]?.info.members.includes(user.id))}
          currentUser={currentUser}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      </Card>
    </ChatLayout>
  )
}

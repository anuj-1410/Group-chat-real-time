export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar: string
  isCurrentUser: boolean
  isAdmin?: boolean
  status?: string
}

export interface Message {
  id: string
  content: string
  timestamp: string
  user: User
  deleted?: boolean
  deletedForMe?: string[] // Array of user IDs who can't see this message
  attachments?: Attachment[]
  reactions?: Reaction[]
}

export interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size: number
  thumbnailUrl?: string
}

export interface Reaction {
  emoji: string
  users: string[] // user IDs
}

export interface GroupInfo {
  id: string
  name: string
  createdAt: string
  adminId: string
  description?: string
  members: string[] // user IDs
}

export interface UserGroup {
  id: string
  name: string
  avatar?: string
  unreadCount: number
  lastMessage?: {
    content: string
    timestamp: string
    sender: string
  }
}

export interface NotificationSettings {
  groupNotifications: boolean
  messagePreview: boolean
  sound: boolean
  vibration: boolean
}

export interface PrivacySettings {
  lastSeen: "everyone" | "contacts" | "nobody"
  profilePhoto: "everyone" | "contacts" | "nobody"
  status: "everyone" | "contacts" | "nobody"
  readReceipts: boolean
}

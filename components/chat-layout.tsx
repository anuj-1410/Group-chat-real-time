"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileSidebar from "./profile-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import type { User, UserGroup } from "@/types/chat"

// Define the NotificationSettings and PrivacySettings types
interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
}

interface PrivacySettings {
  profileVisibility: "public" | "private"
  lastSeenVisibility: "everyone" | "contacts" | "nobody"
}

// Update the interface to include the new props
interface ChatLayoutProps {
  children: React.ReactNode
  currentUser: User
  userGroups: UserGroup[]
  selectedGroupId: string
  notificationSettings: NotificationSettings
  privacySettings: PrivacySettings
  onSelectGroup: (groupId: string) => void
  onUpdateProfile: (user: Partial<User>) => void
  onCreateGroup: (name: string) => void
  onJoinGroup: (id: string) => void
  onUpdateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  onUpdatePrivacySettings: (settings: Partial<PrivacySettings>) => void
  onSignOut: () => void
}

// Update the function parameters to include the new props
export default function ChatLayout({
  children,
  currentUser,
  userGroups,
  selectedGroupId,
  notificationSettings,
  privacySettings,
  onSelectGroup,
  onUpdateProfile,
  onCreateGroup,
  onJoinGroup,
  onUpdateNotificationSettings,
  onUpdatePrivacySettings,
  onSignOut,
}: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("profile-sidebar")
        const toggleButton = document.getElementById("sidebar-toggle")

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          toggleButton &&
          !toggleButton.contains(event.target as Node)
        ) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, sidebarOpen])

  // Auto-close sidebar when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  // Update the ProfileSidebar component to pass the new props
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar Toggle Button */}
      <Button
        id="sidebar-toggle"
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Profile Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            id="profile-sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-40 h-full ${isMobile ? "w-[85%] max-w-[320px]" : "w-[320px]"}`}
          >
            <ProfileSidebar
              user={currentUser}
              groups={userGroups}
              selectedGroupId={selectedGroupId}
              notificationSettings={notificationSettings}
              privacySettings={privacySettings}
              onSelectGroup={onSelectGroup}
              onUpdateProfile={onUpdateProfile}
              onCreateGroup={onCreateGroup}
              onJoinGroup={onJoinGroup}
              onUpdateNotificationSettings={onUpdateNotificationSettings}
              onUpdatePrivacySettings={onUpdatePrivacySettings}
              onSignOut={onSignOut}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

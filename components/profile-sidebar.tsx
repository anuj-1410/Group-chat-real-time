"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Edit, Plus, Users, Settings, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ProfileEditForm from "./profile-edit-form"
import GroupItem from "./group-item"
import CreateGroupDialog from "./create-group-dialog"
import SettingsPanel from "./settings-panel"
import type { User as UserType, UserGroup, NotificationSettings, PrivacySettings } from "@/types/chat"

interface ProfileSidebarProps {
  user: UserType
  groups: UserGroup[]
  selectedGroupId: string
  notificationSettings: NotificationSettings
  privacySettings: PrivacySettings
  onSelectGroup: (groupId: string) => void
  onUpdateProfile: (user: Partial<UserType>) => void
  onCreateGroup: (name: string) => void
  onJoinGroup: (id: string) => void
  onUpdateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  onUpdatePrivacySettings: (settings: Partial<PrivacySettings>) => void
  onSignOut: () => void
}

export default function ProfileSidebar({
  user,
  groups,
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
}: ProfileSidebarProps) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Profile Section - More Compact */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditProfileOpen(true)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Profile</span>
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800 shadow-md">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div
              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Edit className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.status || "Available"}</p>

            <div className="flex items-center space-x-1 text-xs mt-1">
              <Mail className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 truncate">{user.email}</span>
            </div>

            {user.phone && (
              <div className="flex items-center space-x-1 text-xs">
                <Phone className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300 truncate">{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Groups Section */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="groups" className="h-full flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="groups" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="groups" className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="ml-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                onClick={() => setIsCreateGroupOpen(true)}
              >
                <Plus className="h-5 w-5" />
                <span className="sr-only">Create Group</span>
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1 w-full max-w-full">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <GroupItem
                        group={group}
                        isSelected={group.id === selectedGroupId}
                        onClick={() => onSelectGroup(group.id)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No groups found" : "No groups yet"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4 overflow-auto">
            <SettingsPanel
              notificationSettings={notificationSettings}
              privacySettings={privacySettings}
              onUpdateNotificationSettings={onUpdateNotificationSettings}
              onUpdatePrivacySettings={onUpdatePrivacySettings}
              onSignOut={onSignOut}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information and profile picture.</DialogDescription>
          </DialogHeader>
          <ProfileEditForm
            user={user}
            onSave={(updatedUser) => {
              onUpdateProfile(updatedUser)
              setIsEditProfileOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        onCreateGroup={(name) => {
          onCreateGroup(name)
          setIsCreateGroupOpen(false)
        }}
      />
    </div>
  )
}

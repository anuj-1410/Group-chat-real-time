"use client"

import { useState } from "react"
import { Bell, Eye, Volume2, Vibrate, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import type { NotificationSettings, PrivacySettings } from "@/types/chat"

interface SettingsPanelProps {
  notificationSettings: NotificationSettings
  privacySettings: PrivacySettings
  onUpdateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  onUpdatePrivacySettings: (settings: Partial<PrivacySettings>) => void
  onSignOut: () => void
}

export default function SettingsPanel({
  notificationSettings,
  privacySettings,
  onUpdateNotificationSettings,
  onUpdatePrivacySettings,
  onSignOut,
}: SettingsPanelProps) {
  const [confirmSignOut, setConfirmSignOut] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Label htmlFor="group-notifications">Group Notifications</Label>
            </div>
            <Switch
              id="group-notifications"
              checked={notificationSettings.groupNotifications}
              onCheckedChange={(checked) => onUpdateNotificationSettings({ groupNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Label htmlFor="message-preview">Message Preview</Label>
            </div>
            <Switch
              id="message-preview"
              checked={notificationSettings.messagePreview}
              onCheckedChange={(checked) => onUpdateNotificationSettings({ messagePreview: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Label htmlFor="sound">Notification Sound</Label>
            </div>
            <Switch
              id="sound"
              checked={notificationSettings.sound}
              onCheckedChange={(checked) => onUpdateNotificationSettings({ sound: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Vibrate className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Label htmlFor="vibration">Vibration</Label>
            </div>
            <Switch
              id="vibration"
              checked={notificationSettings.vibration}
              onCheckedChange={(checked) => onUpdateNotificationSettings({ vibration: checked })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Privacy</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="last-seen">Last Seen</Label>
            <Select
              value={privacySettings.lastSeen}
              onValueChange={(value) => onUpdatePrivacySettings({ lastSeen: value as any })}
            >
              <SelectTrigger id="last-seen">
                <SelectValue placeholder="Who can see my last seen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">My Contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-photo">Profile Photo</Label>
            <Select
              value={privacySettings.profilePhoto}
              onValueChange={(value) => onUpdatePrivacySettings({ profilePhoto: value as any })}
            >
              <SelectTrigger id="profile-photo">
                <SelectValue placeholder="Who can see my profile photo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">My Contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={privacySettings.status}
              onValueChange={(value) => onUpdatePrivacySettings({ status: value as any })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Who can see my status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">My Contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="read-receipts">Read Receipts</Label>
            <Switch
              id="read-receipts"
              checked={privacySettings.readReceipts}
              onCheckedChange={(checked) => onUpdatePrivacySettings({ readReceipts: checked })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <Button variant="destructive" className="w-full" onClick={() => setConfirmSignOut(true)}>
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>

      <AlertDialog open={confirmSignOut} onOpenChange={setConfirmSignOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access your chats.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onSignOut} className="bg-red-600 hover:bg-red-700">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

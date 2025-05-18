"use client"

import type React from "react"

import { useState } from "react"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateGroup: (name: string) => void
}

export default function CreateGroupDialog({ open, onOpenChange, onCreateGroup }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (groupName.trim()) {
      onCreateGroup(groupName.trim())
      setGroupName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>Create a new group to chat with multiple people at once.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!groupName.trim()}
            >
              <Users className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

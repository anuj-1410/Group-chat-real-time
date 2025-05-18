"use client"

import type React from "react"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import type { User } from "@/types/chat"

interface ProfileEditFormProps {
  user: User
  onSave: (user: Partial<User>) => void
}

export default function ProfileEditForm({ user, onSave }: ProfileEditFormProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone || "")
  const [status, setStatus] = useState(user.status || "")
  const [avatar, setAvatar] = useState(user.avatar)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this file to a server
      // For this mockup, we'll just create a data URL
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setPreviewAvatar(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      email,
      phone: phone || undefined,
      status: status || undefined,
      avatar: previewAvatar || avatar,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center mb-4">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
            <AvatarImage src={previewAvatar || avatar} alt={name} />
            <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-6 w-6 text-white" />
            <span className="sr-only">Upload avatar</span>
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="space-y-2 mb-3">
        <Label htmlFor="status">Status (optional)</Label>
        <Textarea
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="What's on your mind?"
          className="resize-none"
          maxLength={100}
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  )
}

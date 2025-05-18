"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, UserMinus, Shield, Phone, Mail, Search, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
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
import type { User } from "@/types/chat"

interface MemberManagementModalProps {
  isOpen: boolean
  onClose: () => void
  members: User[]
  currentUser: User
  onAddMember: (email: string, phone?: string) => void
  onRemoveMember: (userId: string) => void
}

export default function MemberManagementModal({
  isOpen,
  onClose,
  members,
  currentUser,
  onAddMember,
  onRemoveMember,
}: MemberManagementModalProps) {
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberPhone, setNewMemberPhone] = useState("")
  const [addMethod, setAddMethod] = useState<"email" | "phone">("email")
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "add">("all")
  const isAdmin = currentUser.isAdmin

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewMemberEmail("")
      setNewMemberPhone("")
      setError("")
      setSearchQuery("")
      setActiveTab("all")
    }
  }, [isOpen])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    // Basic phone validation - can be enhanced for specific formats
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (addMethod === "email") {
      if (!newMemberEmail.trim()) {
        setError("Email is required")
        return
      }

      if (!validateEmail(newMemberEmail)) {
        setError("Please enter a valid email address")
        return
      }

      onAddMember(newMemberEmail.trim())
      setNewMemberEmail("")
      setActiveTab("all") // Switch back to members list after adding
    } else {
      if (!newMemberPhone.trim()) {
        setError("Phone number is required")
        return
      }

      if (!validatePhone(newMemberPhone)) {
        setError("Please enter a valid phone number")
        return
      }

      onAddMember("", newMemberPhone.trim())
      setNewMemberPhone("")
      setActiveTab("all") // Switch back to members list after adding
    }
  }

  const confirmRemoveMember = (member: User) => {
    setMemberToRemove(member)
  }

  const handleRemoveMember = () => {
    if (memberToRemove) {
      try {
        onRemoveMember(memberToRemove.id)
        setMemberToRemove(null)
      } catch (error) {
        console.error("Error removing member:", error)
      }
    }
  }

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery)),
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Group Members
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {members.length}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {isAdmin ? "Manage members of this group chat." : "View members of this group chat."}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "add")} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300"
              >
                <Users className="h-4 w-4 mr-2" />
                All Members
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="add"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <ScrollArea className="max-h-[300px] pr-4 -mr-4">
                <AnimatePresence>
                  {filteredMembers.length > 0 ? (
                    <div className="space-y-2">
                      {filteredMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3 border-2 border-white dark:border-gray-800 shadow-sm">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{member.name}</span>
                                {member.isAdmin && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400"
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                                {member.isCurrentUser && (
                                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(You)</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 flex flex-wrap gap-2 mt-0.5">
                                {member.email && (
                                  <div className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1 text-gray-400" />
                                    <span>{member.email}</span>
                                  </div>
                                )}
                                {member.phone && (
                                  <div className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                    <span>{member.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {isAdmin && !member.isCurrentUser && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmRemoveMember(member)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <UserMinus className="h-4 w-4" />
                              <span className="sr-only">Remove {member.name}</span>
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery ? "No members found" : "No members in this group"}
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="add" className="mt-0">
                <form onSubmit={handleAddMember} className="space-y-4">
                  <Tabs defaultValue="email" onValueChange={(value) => setAddMethod(value as "email" | "phone")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="email"
                        className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger
                        value="phone"
                        className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="space-y-3 mt-3">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="user@example.com"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="phone" className="space-y-3 mt-3">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={newMemberPhone}
                          onChange={(e) => setNewMemberPhone(e.target.value)}
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">{error}</div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("all")}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </form>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Remove Member</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to remove{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">{memberToRemove?.name}</span> from this
              group? They will no longer have access to this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-gray-300 dark:border-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Paperclip, X, File, ImageIcon, FileText, Film, Music, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Attachment } from "@/types/chat"

interface FileUploadProps {
  onFileSelect: (files: Attachment[]) => void
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])

      // Simulate upload progress for each file
      filesArray.forEach((file) => {
        simulateUploadProgress(file.name)
      })
    }
  }

  const simulateUploadProgress = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // When all files are uploaded, convert them to attachments
        setTimeout(() => {
          const allUploaded = Object.values(uploadProgress).every((p) => p === 100)
          if (allUploaded) {
            convertFilesToAttachments()
          }
        }, 500)
      }

      setUploadProgress((prev) => ({
        ...prev,
        [fileName]: Math.min(Math.round(progress), 100),
      }))
    }, 200)
  }

  const convertFilesToAttachments = () => {
    const attachments: Attachment[] = selectedFiles.map((file) => {
      // In a real app, you would upload these files to a server and get URLs back
      // For this mockup, we'll create fake URLs
      const isImage = file.type.startsWith("image/")

      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `#${file.name}`, // Placeholder URL
        thumbnailUrl: isImage ? `#thumbnail-${file.name}` : undefined,
      }
    })

    onFileSelect(attachments)
    setSelectedFiles([])
    setUploadProgress({})
    setIsOpen(false)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    // Also remove from progress tracking
    const fileName = selectedFiles[index].name
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (file.type.startsWith("video/")) return <Film className="h-5 w-5" />
    if (file.type.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (file.type.startsWith("text/")) return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <Paperclip className="h-5 w-5" />
        <span className="sr-only">Attach file</span>
      </Button>

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-3"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Attach Files</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                        <div className="mr-2 text-gray-500 dark:text-gray-400">{getFileIcon(file)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{uploadProgress[file.name] || 0}%</span>
                          </div>
                          <Progress value={uploadProgress[file.name] || 0} className="h-1 mt-1" />
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => removeFile(index)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useState } from "react"
import { File, FileText, ImageIcon, Film, Music, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Attachment } from "@/types/chat"

interface MessageAttachmentsProps {
  attachments: Attachment[]
}

export default function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null)

  const getFileIcon = (attachment: Attachment) => {
    if (attachment.type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (attachment.type.startsWith("video/")) return <Film className="h-5 w-5" />
    if (attachment.type.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (attachment.type.startsWith("text/")) return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const renderPreview = (attachment: Attachment) => {
    if (attachment.type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={attachment.url || "/placeholder.svg"}
            alt={attachment.name}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      )
    }

    if (attachment.type.startsWith("video/")) {
      return (
        <div className="flex items-center justify-center h-full">
          <video src={attachment.url} controls className="max-w-full max-h-[70vh]">
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    if (attachment.type.startsWith("audio/")) {
      return (
        <div className="flex items-center justify-center h-full">
          <audio src={attachment.url} controls>
            Your browser does not support the audio tag.
          </audio>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <File className="h-16 w-16 mb-4 text-gray-400" />
        <p className="text-lg font-medium">{attachment.name}</p>
        <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2 max-w-full">
            <div className="mr-2 text-gray-500 dark:text-gray-400">{getFileIcon(attachment)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate max-w-[150px]">{attachment.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(attachment.size)}</p>
            </div>
            <div className="flex ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setPreviewAttachment(attachment)}
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="sr-only">Preview</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => window.open(attachment.url, "_blank")}
              >
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!previewAttachment} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewAttachment?.name}</DialogTitle>
          </DialogHeader>
          {previewAttachment && renderPreview(previewAttachment)}
        </DialogContent>
      </Dialog>
    </>
  )
}

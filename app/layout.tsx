import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Group Chats',
  description: 'A simple real time group chat app',
  generator: 'Next.js',
  applicationName: 'Group Chats',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

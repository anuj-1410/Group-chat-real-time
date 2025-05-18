import ChatInterface from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="h-16 flex items-center justify-center border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Real-Time Group Chat
        </h1>
      </header>
      <div className="flex-2">
        <ChatInterface />
      </div>
    </main>
  )
}

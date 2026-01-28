'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: {
    id: string
    name: string
  }
}

interface ChatProps {
  conversationId: string
  otherUser: {
    id: string
    name: string
    company: string | null
  }
  currentUserId: string
}

export default function Chat({ conversationId, otherUser, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    // Rafraîchir toutes les 3 secondes
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim() }),
      })

      if (res.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {otherUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{otherUser.name}</h3>
          {otherUser.company && (
            <p className="text-xs text-gray-500">{otherUser.company}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">💬</div>
            <p>Aucun message pour le moment</p>
            <p className="text-sm mt-2">
              Commencez la conversation !
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isSent = message.senderId === currentUserId
              const showDate =
                index === 0 ||
                new Date(messages[index - 1].createdAt).toDateString() !==
                  new Date(message.createdAt).toDateString()

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <div className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isSent ? 'text-purple-200' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-gray-200 bg-white">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? '...' : '📤'}
          </button>
        </form>
      </div>
    </>
  )
}

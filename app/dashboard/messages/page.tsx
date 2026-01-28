'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import UserNav from '@/components/UserNav'
import Chat from '@/components/Chat'

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    company: string | null
  }
  lastMessage: {
    content: string
    createdAt: string
    senderId: string
  } | null
  unreadCount: number
  lastMessageAt: string
}

function MessagesContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchConversations()
      // Rafraîchir toutes les 10 secondes
      const interval = setInterval(fetchConversations, 10000)
      return () => clearInterval(interval)
    }
  }, [session])

  // Gérer le paramètre ?with=userId
  useEffect(() => {
    const withUserId = searchParams.get('with')
    if (withUserId && session?.user) {
      createOrOpenConversation(withUserId)
    }
  }, [searchParams, session])

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const createOrOpenConversation = async (otherUserId: string) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId }),
      })
      const conversation = await res.json()
      setSelectedConversationId(conversation.id)
      fetchConversations()
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <UserNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            <span className="text-gradient">Messagerie</span> 💬
          </h1>
          <p className="text-gray-500 text-lg">
            Communiquez avec les autres utilisateurs
          </p>
        </div>

        {/* Layout avec sidebar + chat */}
        <div className="glass rounded-3xl overflow-hidden shadow-2xl flex" style={{ height: '70vh' }}>
          {/* Liste des conversations */}
          <div className="w-full md:w-1/3 border-r-2 border-gray-200 flex flex-col">
            <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="font-bold text-lg">Conversations</h3>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-5xl mb-3">💬</div>
                  <p>Aucune conversation</p>
                  <p className="text-sm mt-2">
                    Commencez à discuter avec d'autres utilisateurs !
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const isSelected = conversation.id === selectedConversationId
                  const lastMessage = conversation.lastMessage

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`p-4 border-b border-gray-100 hover:bg-purple-50 cursor-pointer transition ${
                        isSelected ? 'bg-purple-100' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {conversation.otherUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {conversation.otherUser.name}
                            </h4>
                            {conversation.otherUser.company && (
                              <p className="text-xs text-gray-500">
                                {conversation.otherUser.company}
                              </p>
                            )}
                          </div>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.senderId === session?.user?.id ? 'Vous: ' : ''}
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <Chat
                conversationId={selectedConversation.id}
                otherUser={selectedConversation.otherUser}
                currentUserId={session?.user?.id || ''}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-lg">Sélectionnez une conversation</p>
                  <p className="text-sm mt-2">
                    pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}

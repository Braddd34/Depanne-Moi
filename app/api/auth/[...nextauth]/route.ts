import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// @ts-ignore - NextAuth handler
const handler = NextAuth(authOptions)

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export { handler as GET, handler as POST }

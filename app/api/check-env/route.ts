import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const resendKey = process.env.RESEND_API_KEY
  
  return NextResponse.json({
    resend_api_key_exists: !!resendKey,
    resend_api_key_prefix: resendKey ? resendKey.substring(0, 6) + '...' : 'NOT SET',
    resend_api_key_length: resendKey ? resendKey.length : 0,
    all_env_keys: Object.keys(process.env).filter(key => 
      key.includes('RESEND') || key.includes('DATABASE') || key.includes('NEXTAUTH')
    ),
  })
}

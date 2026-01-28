import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const resendKey = process.env.RESEND_API_KEY
    
    if (!resendKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY non définie',
      })
    }

    const resend = new Resend(resendKey)

    console.log('🔍 Test envoi email direct via Resend...')
    console.log('Clé API:', resendKey.substring(0, 10) + '...')

    const result = await resend.emails.send({
      from: 'Depanne Moi <noreply@depannemoi.vercel.app>',
      to: 'm.elfakir@outlook.fr',
      subject: 'Test Resend - Email de diagnostic',
      html: '<h1>Test réussi !</h1><p>Si vous recevez cet email, Resend fonctionne parfaitement.</p>',
    })

    console.log('✅ Résultat Resend:', result)

    return NextResponse.json({
      success: true,
      result: result,
      message: 'Email envoyé avec succès',
    })
  } catch (error: any) {
    console.error('❌ Erreur Resend complète:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      error_name: error.name,
      error_code: error.code,
      error_details: error.response?.data || error.stack,
    }, { status: 500 })
  }
}

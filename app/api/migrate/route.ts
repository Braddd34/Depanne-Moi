import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    if (secret !== 'migrate-db-now-123') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    console.log('🚀 Application des migrations Prisma...')

    // Appliquer les migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    })

    console.log('stdout:', stdout)
    if (stderr) console.error('stderr:', stderr)

    return NextResponse.json({
      success: true,
      message: 'Migrations appliquées avec succès',
      output: stdout,
    })

  } catch (error: any) {
    console.error('Erreur migration:', error)
    return NextResponse.json(
      { 
        error: error.message,
        stderr: error.stderr,
        stdout: error.stdout,
      },
      { status: 500 }
    )
  }
}

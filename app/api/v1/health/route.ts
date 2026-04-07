import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { getCorsHeaders } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    // Try to connect to database
    const { db } = await connectToDatabase()
    await db.admin().ping()

    return NextResponse.json(
      {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'connected',
      },
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    console.error('[Health Check] Error:', error)
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503, headers: getCorsHeaders() }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { createSuccessResponse } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error?.message },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    const apiResponse = NextResponse.json(
      createSuccessResponse({ message: 'Logout successful' }),
      { status: 200, headers: getCorsHeaders() }
    )

    // Clear cookies
    apiResponse.cookies.delete('accessToken')
    apiResponse.cookies.delete('refreshToken')

    return apiResponse
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

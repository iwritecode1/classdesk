import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { verifyToken, generateTokens } from '@/lib/auth'
import { validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { refreshTokenSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies or body
    let refreshToken = request.cookies.get('refreshToken')?.value
    
    if (!refreshToken) {
      const { data, error } = await validateBody(request, refreshTokenSchema)
      if (error) {
        return NextResponse.json(
          { success: false, error: error.message, code: error.code },
          { status: error.statusCode, headers: getCorsHeaders() }
        )
      }
      refreshToken = data!.refreshToken
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken)
    if (!payload) {
      throw ApiErrors.tokenExpired()
    }

    // Get user from database to refresh their data
    const { db } = await connectToDatabase()
    const usersCollection = db.collection('users')
    const user = await usersCollection.findOne({ _id: payload.userId })

    if (!user || user.status !== 'active') {
      throw ApiErrors.unauthorized()
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    })

    const response = {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    }

    const apiResponse = NextResponse.json(
      createSuccessResponse(response, 'Token refreshed successfully'),
      { status: 200, headers: getCorsHeaders() }
    )

    // Update cookies
    apiResponse.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    apiResponse.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return apiResponse
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

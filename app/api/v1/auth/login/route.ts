import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { comparePassword, generateTokens } from '@/lib/auth'
import { validateBody, handleApiError, getCorsHeaders, checkRateLimit } from '@/lib/middleware'
import { loginSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(`login-${ip}`, 10, 15 * 60 * 1000)) {
      throw ApiErrors.rateLimitExceeded()
    }

    // Validate request
    const { data, error } = await validateBody(request, loginSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { email, password } = data!

    // Connect to database
    const { db } = await connectToDatabase()
    const usersCollection = db.collection('users')

    // Find user
    const user = await usersCollection.findOne({ email })
    if (!user) {
      throw ApiErrors.invalidCredentials()
    }

    // Verify password
    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
      throw ApiErrors.invalidCredentials()
    }

    // Check user status
    if (user.status !== 'active') {
      throw new Error('User account is not active')
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    })

    const response = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    }

    const apiResponse = NextResponse.json(
      createSuccessResponse(response, 'Login successful'),
      { status: 200, headers: getCorsHeaders() }
    )

    // Set cookies for tokens
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

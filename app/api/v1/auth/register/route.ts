import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { hashPassword, generateTokens } from '@/lib/auth'
import { validateBody, handleApiError, getCorsHeaders, getSecurityHeaders, checkRateLimit } from '@/lib/middleware'
import { registerSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(`register-${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts' },
        { status: 429, headers: { ...getCorsHeaders(), ...getSecurityHeaders() } }
      )
    }

    // Validate request
    const { data, error } = await validateBody(request, registerSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { email, password, instituteName, adminName, phone } = data!

    // Connect to database
    const { db } = await connectToDatabase()
    const usersCollection = db.collection('users')
    const institutesCollection = db.collection('institutes')

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      throw ApiErrors.emailExists()
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create tenant/institute
    const instituteResult = await institutesCollection.insertOne({
      name: instituteName,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    const tenantId = instituteResult.insertedId.toString()

    // Create user
    const userResult = await usersCollection.insertOne({
      _id: new ObjectId(),
      tenantId,
      name: adminName,
      email,
      phone,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    const userId = userResult.insertedId.toString()

    // Generate tokens
    const tokens = generateTokens({
      userId,
      tenantId,
      email,
      role: 'admin',
    })

    const response = {
      user: {
        id: userId,
        email,
        name: adminName,
        role: 'admin',
        tenantId,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    }

    const apiResponse = NextResponse.json(createSuccessResponse(response, 'Registration successful'), {
      status: 201,
      headers: getCorsHeaders(),
    })

    // Set cookies for tokens
    apiResponse.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    apiResponse.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

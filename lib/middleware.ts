import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from './auth'
import { ApiError, ApiErrors, createErrorResponse } from './api-error'
import { ZodSchema } from 'zod'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    tenantId: string
    email: string
    role: 'admin' | 'staff'
  }
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return {
      error: ApiErrors.unauthorized(),
      authenticated: false,
      user: null,
    }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return {
      error: ApiErrors.tokenExpired(),
      authenticated: false,
      user: null,
    }
  }

  return {
    error: null,
    authenticated: true,
    user: payload,
  }
}

/**
 * Middleware to validate request body against a schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
      return {
        data: null,
        error: ApiErrors.validationError(errors),
      }
    }

    return { data: result.data as T, error: null }
  } catch (error) {
    return {
      data: null,
      error: ApiErrors.internalError(error),
    }
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema
): { data: T | null; error: ApiError | null } {
  try {
    const searchParams = request.nextUrl.searchParams
    const params: Record<string, unknown> = {}

    for (const [key, value] of searchParams.entries()) {
      params[key] = value
    }

    const result = schema.safeParse(params)

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
      return {
        data: null,
        error: ApiErrors.validationError(errors),
      }
    }

    return { data: result.data as T, error: null }
  } catch (error) {
    return {
      data: null,
      error: ApiErrors.internalError(error),
    }
  }
}

/**
 * Handle API errors and format response
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('[API Error]', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      createErrorResponse(error),
      { status: error.statusCode }
    )
  }

  const internalError = ApiErrors.internalError(
    error instanceof Error ? error.message : String(error)
  )
  return NextResponse.json(createErrorResponse(internalError), {
    status: internalError.statusCode,
  })
}

/**
 * CORS headers for API responses
 */
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

/**
 * Security headers for API responses
 */
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }
}

/**
 * Rate limit check (simple implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

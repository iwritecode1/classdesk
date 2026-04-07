import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h'
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d'

export interface JwtPayload {
  userId: string
  tenantId: string
  email: string
  role: 'admin' | 'staff'
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

/**
 * Generate access and refresh tokens
 */
export function generateTokens(payload: JwtPayload): TokenPair {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    algorithm: 'HS256',
  })

  const refreshToken = jwt.sign(
    { userId: payload.userId, tenantId: payload.tenantId },
    JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
      algorithm: 'HS256',
    }
  )

  return { accessToken, refreshToken }
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    console.error('[Auth] Token verification error:', error)
    return null
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1]
  }
  return null
}

export interface ApiErrorResponse {
  success: false
  error: string
  code: string
  details?: unknown
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Common error codes
export const ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  
  // Permission errors
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
}

export function createErrorResponse(error: ApiError): ApiErrorResponse {
  return {
    success: false,
    error: error.message,
    code: error.code,
    details: process.env.NODE_ENV === 'development' ? error.details : undefined,
  }
}

export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

// Common API errors
export const ApiErrors = {
  unauthorized: () =>
    new ApiError(401, ERROR_CODES.UNAUTHORIZED, 'Unauthorized'),
  
  tokenExpired: () =>
    new ApiError(401, ERROR_CODES.TOKEN_EXPIRED, 'Token has expired'),
  
  forbidden: () =>
    new ApiError(403, ERROR_CODES.FORBIDDEN, 'Forbidden'),
  
  validationError: (details: unknown) =>
    new ApiError(400, ERROR_CODES.VALIDATION_ERROR, 'Validation error', details),
  
  notFound: (resource: string) =>
    new ApiError(404, ERROR_CODES.NOT_FOUND, `${resource} not found`),
  
  emailExists: () =>
    new ApiError(
      409,
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
      'Email already registered'
    ),
  
  invalidCredentials: () =>
    new ApiError(
      401,
      ERROR_CODES.INVALID_CREDENTIALS,
      'Invalid email or password'
    ),
  
  databaseError: (details?: unknown) =>
    new ApiError(
      500,
      ERROR_CODES.DATABASE_ERROR,
      'Database error occurred',
      details
    ),
  
  internalError: (details?: unknown) =>
    new ApiError(
      500,
      ERROR_CODES.INTERNAL_ERROR,
      'An internal error occurred',
      details
    ),
  
  rateLimitExceeded: () =>
    new ApiError(
      429,
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      'Too many requests, please try again later'
    ),
}

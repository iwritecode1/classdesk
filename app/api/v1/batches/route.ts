import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { createBatchSchema, paginationSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/batches
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error?.message },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const status = request.nextUrl.searchParams.get('status')

    const { db } = await connectToDatabase()
    const batchesCollection = db.collection('batches')

    // Build filter
    const filter: Record<string, unknown> = { tenantId: authResult.user?.tenantId }
    if (status) filter.status = status

    // Get total count
    const total = await batchesCollection.countDocuments(filter)

    // Get paginated results
    const batches = await batchesCollection
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    const response = {
      data: batches,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }

    return NextResponse.json(createSuccessResponse(response), {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/v1/batches
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error?.message },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    // Validate request body
    const { data, error } = await validateBody(request, createBatchSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const batchesCollection = db.collection('batches')

    // Create batch
    const batchData = {
      ...data,
      tenantId: authResult.user?.tenantId,
      enrolledCount: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await batchesCollection.insertOne(batchData)

    const batch = {
      _id: result.insertedId.toString(),
      ...batchData,
    }

    return NextResponse.json(createSuccessResponse(batch, 'Batch created successfully'), {
      status: 201,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

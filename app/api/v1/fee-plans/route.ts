import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { createFeePlanSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/fee-plans
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
    const studentId = request.nextUrl.searchParams.get('studentId')

    const { db } = await connectToDatabase()
    const feePlansCollection = db.collection('fee-plans')

    // Build filter
    const filter: Record<string, unknown> = { tenantId: authResult.user?.tenantId }
    if (status) filter.status = status
    if (studentId) filter.studentId = studentId

    // Get total count
    const total = await feePlansCollection.countDocuments(filter)

    // Get paginated results
    const plans = await feePlansCollection
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    const response = {
      data: plans,
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

// POST /api/v1/fee-plans
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
    const { data, error } = await validateBody(request, createFeePlanSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const feePlansCollection = db.collection('fee-plans')

    // Create fee plan
    const feePlanData = {
      ...data,
      tenantId: authResult.user?.tenantId,
      paidAmount: 0,
      status: data!.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await feePlansCollection.insertOne(feePlanData)

    const feePlan = {
      _id: result.insertedId.toString(),
      ...feePlanData,
    }

    return NextResponse.json(
      createSuccessResponse(feePlan, 'Fee plan created successfully'),
      { status: 201, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

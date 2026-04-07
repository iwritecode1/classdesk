import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { createPaymentSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/payments
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
    const startDate = request.nextUrl.searchParams.get('startDate')
    const endDate = request.nextUrl.searchParams.get('endDate')

    const { db } = await connectToDatabase()
    const paymentsCollection = db.collection('payments')

    // Build filter
    const filter: Record<string, unknown> = { tenantId: authResult.user?.tenantId }
    if (status) filter.status = status
    if (studentId) filter.studentId = studentId
    
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) {
        (filter.createdAt as Record<string, unknown>).$gte = new Date(startDate)
      }
      if (endDate) {
        (filter.createdAt as Record<string, unknown>).$lte = new Date(endDate)
      }
    }

    // Get total count
    const total = await paymentsCollection.countDocuments(filter)

    // Get paginated results
    const payments = await paymentsCollection
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    const response = {
      data: payments,
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

// POST /api/v1/payments
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
    const { data, error } = await validateBody(request, createPaymentSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const paymentsCollection = db.collection('payments')
    const feePlansCollection = db.collection('fee-plans')

    // Verify fee plan exists
    if (!ObjectId.isValid(data!.feePlanId)) {
      throw ApiErrors.notFound('Fee Plan')
    }

    const feePlan = await feePlansCollection.findOne({
      _id: new ObjectId(data!.feePlanId),
      tenantId: authResult.user?.tenantId,
    })

    if (!feePlan) {
      throw ApiErrors.notFound('Fee Plan')
    }

    // Create payment
    const paymentData = {
      ...data,
      tenantId: authResult.user?.tenantId,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await paymentsCollection.insertOne(paymentData)

    // Update fee plan with payment amount
    const currentPaid = feePlan.paidAmount || 0
    await feePlansCollection.updateOne(
      { _id: new ObjectId(data!.feePlanId) },
      {
        $set: {
          paidAmount: currentPaid + data!.amount,
          updatedAt: new Date(),
        },
      }
    )

    const payment = {
      _id: result.insertedId.toString(),
      ...paymentData,
    }

    return NextResponse.json(
      createSuccessResponse(payment, 'Payment recorded successfully'),
      { status: 201, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

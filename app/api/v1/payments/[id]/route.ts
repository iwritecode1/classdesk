import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { updatePaymentStatusSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/payments/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error?.message },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      throw ApiErrors.notFound('Payment')
    }

    const { db } = await connectToDatabase()
    const paymentsCollection = db.collection('payments')

    const payment = await paymentsCollection.findOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (!payment) {
      throw ApiErrors.notFound('Payment')
    }

    return NextResponse.json(createSuccessResponse(payment), {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/v1/payments/[id] - Update payment status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error?.message },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      throw ApiErrors.notFound('Payment')
    }

    // Validate request body
    const { data, error } = await validateBody(request, updatePaymentStatusSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const paymentsCollection = db.collection('payments')

    const result = await paymentsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        tenantId: authResult.user?.tenantId,
      },
      {
        $set: {
          status: data!.status,
          notes: data!.notes,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      throw ApiErrors.notFound('Payment')
    }

    return NextResponse.json(
      createSuccessResponse(result.value, 'Payment status updated successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/v1/payments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error?.message },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      throw ApiErrors.notFound('Payment')
    }

    const { db } = await connectToDatabase()
    const paymentsCollection = db.collection('payments')

    const payment = await paymentsCollection.findOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (!payment) {
      throw ApiErrors.notFound('Payment')
    }

    // If payment was for a fee plan, deduct from the plan
    if (payment.feePlanId) {
      const feePlansCollection = db.collection('fee-plans')
      const currentPaid = payment.amount || 0
      await feePlansCollection.updateOne(
        { _id: new ObjectId(payment.feePlanId) },
        {
          $set: {
            paidAmount: Math.max(0, (payment.feePlan?.paidAmount || 0) - currentPaid),
            updatedAt: new Date(),
          },
        }
      )
    }

    await paymentsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json(
      createSuccessResponse({ deletedId: id }, 'Payment deleted successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

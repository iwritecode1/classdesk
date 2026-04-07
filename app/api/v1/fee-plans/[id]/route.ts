import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { updateFeePlanSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/fee-plans/[id]
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
      throw ApiErrors.notFound('Fee Plan')
    }

    const { db } = await connectToDatabase()
    const feePlansCollection = db.collection('fee-plans')

    const feePlan = await feePlansCollection.findOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (!feePlan) {
      throw ApiErrors.notFound('Fee Plan')
    }

    return NextResponse.json(createSuccessResponse(feePlan), {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/v1/fee-plans/[id]
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
      throw ApiErrors.notFound('Fee Plan')
    }

    // Validate request body
    const { data, error } = await validateBody(request, updateFeePlanSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const feePlansCollection = db.collection('fee-plans')

    const result = await feePlansCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        tenantId: authResult.user?.tenantId,
      },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      throw ApiErrors.notFound('Fee Plan')
    }

    return NextResponse.json(
      createSuccessResponse(result.value, 'Fee plan updated successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/v1/fee-plans/[id]
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
      throw ApiErrors.notFound('Fee Plan')
    }

    const { db } = await connectToDatabase()
    const feePlansCollection = db.collection('fee-plans')

    const result = await feePlansCollection.deleteOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (result.deletedCount === 0) {
      throw ApiErrors.notFound('Fee Plan')
    }

    return NextResponse.json(
      createSuccessResponse({ deletedId: id }, 'Fee plan deleted successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

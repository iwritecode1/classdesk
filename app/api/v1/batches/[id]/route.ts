import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { updateBatchSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/batches/[id]
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
      throw ApiErrors.notFound('Batch')
    }

    const { db } = await connectToDatabase()
    const batchesCollection = db.collection('batches')

    const batch = await batchesCollection.findOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (!batch) {
      throw ApiErrors.notFound('Batch')
    }

    return NextResponse.json(createSuccessResponse(batch), {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/v1/batches/[id]
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
      throw ApiErrors.notFound('Batch')
    }

    // Validate request body
    const { data, error } = await validateBody(request, updateBatchSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const batchesCollection = db.collection('batches')

    const result = await batchesCollection.findOneAndUpdate(
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
      throw ApiErrors.notFound('Batch')
    }

    return NextResponse.json(
      createSuccessResponse(result.value, 'Batch updated successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/v1/batches/[id]
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
      throw ApiErrors.notFound('Batch')
    }

    const { db } = await connectToDatabase()
    const batchesCollection = db.collection('batches')

    const result = await batchesCollection.deleteOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (result.deletedCount === 0) {
      throw ApiErrors.notFound('Batch')
    }

    return NextResponse.json(
      createSuccessResponse({ deletedId: id }, 'Batch deleted successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

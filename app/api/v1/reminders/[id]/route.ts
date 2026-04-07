import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { updateReminderSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/reminders/[id]
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
      throw ApiErrors.notFound('Reminder')
    }

    const { db } = await connectToDatabase()
    const remindersCollection = db.collection('reminders')

    const reminder = await remindersCollection.findOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (!reminder) {
      throw ApiErrors.notFound('Reminder')
    }

    return NextResponse.json(createSuccessResponse(reminder), {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/v1/reminders/[id]
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
      throw ApiErrors.notFound('Reminder')
    }

    // Validate request body
    const { data, error } = await validateBody(request, updateReminderSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const remindersCollection = db.collection('reminders')

    const result = await remindersCollection.findOneAndUpdate(
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
      throw ApiErrors.notFound('Reminder')
    }

    return NextResponse.json(
      createSuccessResponse(result.value, 'Reminder updated successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/v1/reminders/[id]
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
      throw ApiErrors.notFound('Reminder')
    }

    const { db } = await connectToDatabase()
    const remindersCollection = db.collection('reminders')

    const result = await remindersCollection.deleteOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (result.deletedCount === 0) {
      throw ApiErrors.notFound('Reminder')
    }

    return NextResponse.json(
      createSuccessResponse({ deletedId: id }, 'Reminder deleted successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

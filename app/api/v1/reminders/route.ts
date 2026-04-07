import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { createReminderSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/reminders
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
    const remindersCollection = db.collection('reminders')

    // Build filter
    const filter: Record<string, unknown> = { tenantId: authResult.user?.tenantId }
    if (status) filter.status = status
    if (studentId) filter.studentId = studentId

    // Get total count
    const total = await remindersCollection.countDocuments(filter)

    // Get paginated results
    const reminders = await remindersCollection
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ scheduledDate: -1 })
      .toArray()

    const response = {
      data: reminders,
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

// POST /api/v1/reminders
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
    const { data, error } = await validateBody(request, createReminderSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const remindersCollection = db.collection('reminders')

    // Create reminder
    const reminderData = {
      ...data,
      tenantId: authResult.user?.tenantId,
      status: data!.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await remindersCollection.insertOne(reminderData)

    const reminder = {
      _id: result.insertedId.toString(),
      ...reminderData,
    }

    return NextResponse.json(
      createSuccessResponse(reminder, 'Reminder created successfully'),
      { status: 201, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

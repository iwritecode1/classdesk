import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, validateQuery, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { createStudentSchema, studentFilterSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/students - List all students with filtering
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: authResult.error?.message },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    // Validate query parameters
    const { data: filters, error } = validateQuery(request, studentFilterSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { page = 1, limit = 20, status, batchId, search } = filters!

    const { db } = await connectToDatabase()
    const studentsCollection = db.collection('students')

    // Build filter
    const filter: Record<string, unknown> = { tenantId: authResult.user?.tenantId }
    if (status) filter.status = status
    if (batchId) filter['academicInfo.batchId'] = batchId
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    // Get total count
    const total = await studentsCollection.countDocuments(filter)

    // Get paginated results
    const students = await studentsCollection
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    const response = {
      data: students,
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

// POST /api/v1/students - Create new student
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
    const { data, error } = await validateBody(request, createStudentSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const studentsCollection = db.collection('students')

    // Check if email already exists
    const existing = await studentsCollection.findOne({
      email: data!.email,
      tenantId: authResult.user?.tenantId,
    })
    if (existing) {
      throw ApiErrors.emailExists()
    }

    // Create student
    const studentData = {
      ...data,
      tenantId: authResult.user?.tenantId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await studentsCollection.insertOne(studentData)

    const student = {
      _id: result.insertedId.toString(),
      ...studentData,
    }

    return NextResponse.json(createSuccessResponse(student, 'Student created successfully'), {
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

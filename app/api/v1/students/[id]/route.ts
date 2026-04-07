import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAuth, validateBody, handleApiError, getCorsHeaders } from '@/lib/middleware'
import { updateStudentSchema } from '@/lib/validators'
import { ApiErrors, createSuccessResponse } from '@/lib/api-error'
import { ObjectId } from 'mongodb'

// GET /api/v1/students/[id]
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
      throw ApiErrors.notFound('Student')
    }

    const { db } = await connectToDatabase()
    const studentsCollection = db.collection('students')

    const student = await studentsCollection.findOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (!student) {
      throw ApiErrors.notFound('Student')
    }

    return NextResponse.json(createSuccessResponse(student), {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/v1/students/[id]
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
      throw ApiErrors.notFound('Student')
    }

    // Validate request body
    const { data, error } = await validateBody(request, updateStudentSchema)
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode, headers: getCorsHeaders() }
      )
    }

    const { db } = await connectToDatabase()
    const studentsCollection = db.collection('students')

    // Check if email is being updated and if it already exists
    if (data!.email) {
      const existing = await studentsCollection.findOne({
        email: data!.email,
        _id: { $ne: new ObjectId(id) },
        tenantId: authResult.user?.tenantId,
      })
      if (existing) {
        throw ApiErrors.emailExists()
      }
    }

    const result = await studentsCollection.findOneAndUpdate(
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
      throw ApiErrors.notFound('Student')
    }

    return NextResponse.json(
      createSuccessResponse(result.value, 'Student updated successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/v1/students/[id]
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
      throw ApiErrors.notFound('Student')
    }

    const { db } = await connectToDatabase()
    const studentsCollection = db.collection('students')

    const result = await studentsCollection.deleteOne({
      _id: new ObjectId(id),
      tenantId: authResult.user?.tenantId,
    })

    if (result.deletedCount === 0) {
      throw ApiErrors.notFound('Student')
    }

    return NextResponse.json(
      createSuccessResponse({ deletedId: id }, 'Student deleted successfully'),
      { status: 200, headers: getCorsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}

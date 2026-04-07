'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ArrowLeft,
  Users,
  Clock,
  IndianRupee,
  Edit,
  Delete,
  Calendar,
  BookOpen,
} from 'lucide-react'
import { fetchBatch, fetchStudents, formatCurrency, formatDate } from '@/lib/api'
import type { Batch, Student } from '@/lib/types'

export default function BatchDetailPage() {
  const params = useParams()
  const batchId = params.id as string
  
  const [batch, setBatch] = useState<Batch | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [batchRes, studentsRes] = await Promise.all([
        fetchBatch(batchId),
        fetchStudents(),
      ])
      
      if (batchRes.success && batchRes.data) setBatch(batchRes.data)
      if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data)
      
      setLoading(false)
    }
    loadData()
  }, [batchId])

  const enrolledStudents = batch ? students.filter(s => s.academicInfo.batchId === batch._id) : []
  const capacityPercent = batch ? (enrolledStudents.length / batch.capacity) * 100 : 0

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-800">Planned</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Batch Details" description="" />
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="min-h-screen">
        <Header title="Batch Not Found" description="" />
        <div className="p-6 text-center">
          <p className="text-muted-foreground mb-4">The batch you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/dashboard/batches">
            <Button>Back to Batches</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header 
        title={batch.name} 
        description={batch.subject} 
      />

      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Link href="/dashboard/batches">
          <Button variant="ghost" size="sm" className="px-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
        </Link>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Batch Information */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{batch.name}</CardTitle>
                    <CardDescription className="mt-1">{batch.subject}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(batch.status)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                {batch.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm mt-2">{batch.description}</p>
                  </div>
                )}

                {/* Basic Details */}
                <div className="grid gap-4 md:grid-cols-2 border-t border-border pt-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Class Timing</span>
                    </div>
                    <p className="font-semibold mt-2">{batch.timing}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Fee Start Date</span>
                    </div>
                    <p className="font-semibold mt-2">{formatDate(batch.feeConfig.startDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Configuration */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  Fee Configuration
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-sm text-muted-foreground mb-2">Base Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(batch.feeConfig.baseAmount)}</p>
                  </div>

                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-sm text-muted-foreground mb-2">Discount</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(batch.feeConfig.discount)}</p>
                  </div>
                </div>

                <div className="rounded-lg gradient-bg p-4 text-primary-foreground">
                  <p className="text-sm opacity-90 mb-2">Final Amount</p>
                  <p className="text-3xl font-bold">{formatCurrency(batch.feeConfig.finalAmount)}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Payment Mode</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{batch.feeConfig.mode}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {batch.feeConfig.mode === 'monthly' && '(12 equal installments)'}
                      {batch.feeConfig.mode === 'quarterly' && '(4 equal installments)'}
                      {batch.feeConfig.mode === 'yearly' && '(Full amount at start)'}
                      {batch.feeConfig.mode === 'custom' && '(Custom schedule)'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Students */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Enrolled Students ({enrolledStudents.length})
                </CardTitle>
              </CardHeader>

              <CardContent>
                {enrolledStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No students enrolled in this batch yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrolledStudents.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell className="font-medium">
                              {student.personalInfo.firstName} {student.personalInfo.lastName}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {student.academicInfo.schoolName}
                            </TableCell>
                            <TableCell>{student.academicInfo.class}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={
                                  student.status === 'active' 
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                }
                              >
                                {student.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/dashboard/students/${student._id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Capacity Overview */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Capacity Overview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Enrollment Status</span>
                    <span className="text-lg font-bold">{enrolledStudents.length}/{batch.capacity}</span>
                  </div>
                  <Progress value={capacityPercent} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(capacityPercent)}% capacity</p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enrolled:</span>
                      <span className="font-semibold">{enrolledStudents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-semibold">{batch.capacity - enrolledStudents.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Link href={`/dashboard/batches/${batch._id}/edit`} className="w-full">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Batch
                  </Button>
                </Link>

                <Link href="/dashboard/students/new" className="w-full">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    Add Student
                  </Button>
                </Link>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                >
                  <Delete className="h-4 w-4" />
                  Delete Batch
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="rounded-2xl bg-secondary/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Created on {formatDate(batch.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated {formatDate(batch.updatedAt)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

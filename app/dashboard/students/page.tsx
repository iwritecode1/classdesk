'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail,
} from 'lucide-react'
import { fetchStudents, fetchFeePlans, formatCurrency } from '@/lib/api'
import { mockInstitute } from '@/lib/mock-data'
import type { Student, FeePlan } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [feePlans, setFeePlans] = useState<FeePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [batchFilter, setBatchFilter] = useState<string>('all')

  useEffect(() => {
    async function loadData() {
      const [studentsRes, feePlansRes] = await Promise.all([
        fetchStudents(),
        fetchFeePlans(),
      ])
      
      if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data)
      if (feePlansRes.success && feePlansRes.data) setFeePlans(feePlansRes.data)
      
      setLoading(false)
    }
    loadData()
  }, [])

  const getStudentFees = (studentId: string) => {
    const feePlan = feePlans.find(fp => fp.studentId === studentId)
    if (!feePlan) return { total: 0, paid: 0, due: 0, status: 'no-plan' as const }

    const paid = feePlan.installmentPlan
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0)
    
    const hasOverdue = feePlan.installmentPlan.some(i => i.status === 'overdue')
    
    return {
      total: feePlan.finalAmount,
      paid,
      due: feePlan.finalAmount - paid,
      status: hasOverdue ? 'overdue' as const : paid >= feePlan.finalAmount ? 'paid' as const : 'pending' as const,
    }
  }

  const getBatchName = (batchId: string) => {
    const batch = mockInstitute.academics.batches.find(b => b._id === batchId)
    return batch?.name || 'Unknown'
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.personalInfo.firstName} ${student.personalInfo.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.personalInfo.phone.includes(search) ||
      student.personalInfo.email.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    
    const matchesBatch = batchFilter === 'all' || 
      student.academicInfo.batchIds.includes(batchFilter)

    return matchesSearch && matchesStatus && matchesBatch
  })

  return (
    <div className="min-h-screen">
      <Header 
        title="Students" 
        description="Manage your student database" 
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="w-40 hidden sm:flex">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {mockInstitute.academics.batches.map(batch => (
                  <SelectItem key={batch._id} value={batch._id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Link href="/dashboard/students/new">
            <Button className="gradient-bg border-0 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>

        {/* Students Table */}
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full animate-pulse bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                      <TableHead className="font-semibold">Student</TableHead>
                      <TableHead className="font-semibold hidden md:table-cell">Contact</TableHead>
                      <TableHead className="font-semibold hidden lg:table-cell">Batch</TableHead>
                      <TableHead className="font-semibold text-right">Total Fees</TableHead>
                      <TableHead className="font-semibold text-right">Due</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const fees = getStudentFees(student._id)
                      return (
                        <TableRow 
                          key={student._id}
                          className="group hover:bg-secondary/30 cursor-pointer"
                        >
                          <TableCell>
                            <Link 
                              href={`/dashboard/students/${student._id}`}
                              className="flex items-center gap-3"
                            >
                              <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-medium">
                                {student.personalInfo.firstName[0]}
                                {student.personalInfo.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {student.personalInfo.firstName} {student.personalInfo.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Class {student.academicInfo.class}
                                </p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {student.personalInfo.phone}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {student.personalInfo.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="secondary" className="text-xs">
                              {getBatchName(student.academicInfo.batchIds[0])}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(fees.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              'font-medium',
                              fees.due > 0 ? 'text-destructive' : 'text-success'
                            )}>
                              {formatCurrency(fees.due)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                fees.status === 'paid' ? 'default' :
                                fees.status === 'overdue' ? 'destructive' :
                                'secondary'
                              }
                              className={cn(
                                'capitalize text-xs',
                                fees.status === 'paid' && 'bg-success text-success-foreground'
                              )}
                            >
                              {fees.status === 'no-plan' ? 'No Plan' : fees.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/students/${student._id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/students/${student._id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && filteredStudents.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No students found</p>
                <Link href="/dashboard/students/new">
                  <Button className="mt-4 gradient-bg border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Student
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination placeholder */}
        {!loading && filteredStudents.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Showing {filteredStudents.length} of {students.length} students</p>
          </div>
        )}
      </div>
    </div>
  )
}

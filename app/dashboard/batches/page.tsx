'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  Clock,
  BookOpen,
  IndianRupee,
} from 'lucide-react'
import { fetchBatches, fetchStudents, formatCurrency, formatDate } from '@/lib/api'
import type { Batch, Student } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function loadData() {
      const [batchesRes, studentsRes] = await Promise.all([
        fetchBatches(),
        fetchStudents(),
      ])
      
      if (batchesRes.success && batchesRes.data) setBatches(batchesRes.data)
      if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data)
      
      setLoading(false)
    }
    loadData()
  }, [])

  const getEnrolledStudentCount = (batchId: string) => {
    return students.filter(s => s.academicInfo.batchId === batchId).length
  }

  const getCapacityPercentage = (batch: Batch) => {
    const enrolled = getEnrolledStudentCount(batch._id)
    return (enrolled / batch.capacity) * 100
  }

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

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(search.toLowerCase()) ||
                         batch.subject.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen">
      <Header 
        title="Batches" 
        description="Manage your classes and fee configurations" 
      />

      <div className="space-y-6 p-6">
        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Link href="/dashboard/batches/new">
              <Button className="gradient-bg text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                New Batch
              </Button>
            </Link>
          </div>
        </div>

        {/* Batches Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading batches...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No batches found</p>
              <p className="text-sm text-muted-foreground">Create your first batch to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBatches.map((batch) => {
              const enrolledCount = getEnrolledStudentCount(batch._id)
              const capacityPercent = getCapacityPercentage(batch)

              return (
                <Card key={batch._id} className="flex flex-col rounded-2xl border border-border shadow-md transition-all hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{batch.name}</CardTitle>
                        <CardDescription className="mt-1">{batch.subject}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/batches/${batch._id}`}>
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/batches/${batch._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      {getStatusBadge(batch.status)}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      {/* Timing */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{batch.timing}</span>
                      </div>

                      {/* Capacity */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{enrolledCount} / {batch.capacity} enrolled</span>
                          </div>
                        </div>
                        <Progress value={capacityPercent} className="h-2" />
                      </div>

                      {/* Fee Info */}
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Fee Structure:</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-semibold">{formatCurrency(batch.feeConfig.baseAmount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount:</span>
                            <span className="font-semibold">{formatCurrency(batch.feeConfig.discount)}</span>
                          </div>
                          <div className="border-t border-border pt-1 mt-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Final:</span>
                              <span className="font-bold text-green-600">{formatCurrency(batch.feeConfig.finalAmount)}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {batch.feeConfig.mode === 'monthly' && 'Monthly installments'}
                            {batch.feeConfig.mode === 'quarterly' && 'Quarterly installments'}
                            {batch.feeConfig.mode === 'yearly' && 'Yearly payment'}
                            {batch.feeConfig.mode === 'custom' && 'Custom schedule'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="border-t border-border p-4">
                    <Link href={`/dashboard/batches/${batch._id}`}>
                      <Button variant="outline" className="w-full">
                        View Batch Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

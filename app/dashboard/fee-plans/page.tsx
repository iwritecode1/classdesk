'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Plus, 
  Search,
  Eye,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { fetchFeePlans, fetchStudents, formatCurrency, formatDate } from '@/lib/api'
import type { FeePlan, Student } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function FeePlansPage() {
  const [feePlans, setFeePlans] = useState<FeePlan[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function loadData() {
      const [feePlansRes, studentsRes] = await Promise.all([
        fetchFeePlans(),
        fetchStudents(),
      ])
      
      if (feePlansRes.success && feePlansRes.data) setFeePlans(feePlansRes.data)
      if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data)
      
      setLoading(false)
    }
    loadData()
  }, [])

  const getStudent = (studentId: string) => {
    return students.find(s => s._id === studentId)
  }

  const getFeePlanStats = (feePlan: FeePlan) => {
    const paidAmount = feePlan.installmentPlan
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0)
    
    const dueAmount = feePlan.finalAmount - paidAmount
    const overdueCount = feePlan.installmentPlan.filter(i => i.status === 'overdue').length
    const paidCount = feePlan.installmentPlan.filter(i => i.status === 'paid').length
    const pendingCount = feePlan.installmentPlan.filter(i => i.status === 'pending').length
    const progress = (paidAmount / feePlan.finalAmount) * 100
    
    return { paidAmount, dueAmount, overdueCount, paidCount, pendingCount, progress }
  }

  const getFeeStatus = (feePlan: FeePlan) => {
    const hasOverdue = feePlan.installmentPlan.some(i => i.status === 'overdue')
    const allPaid = feePlan.installmentPlan.every(i => i.status === 'paid')
    
    if (allPaid) return 'completed'
    if (hasOverdue) return 'overdue'
    return 'active'
  }

  const filteredFeePlans = feePlans.filter(feePlan => {
    const student = getStudent(feePlan.studentId)
    const studentName = student 
      ? `${student.personalInfo.firstName} ${student.personalInfo.lastName}`.toLowerCase()
      : ''
    
    const matchesSearch = studentName.includes(search.toLowerCase())
    
    const status = getFeeStatus(feePlan)
    const matchesStatus = statusFilter === 'all' || status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen">
      <Header 
        title="Fee Plans" 
        description="Manage student fee structures and installments" 
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by student name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href="/dashboard/fee-plans/new">
            <Button className="gradient-bg border-0 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Fee Plan
            </Button>
          </Link>
        </div>

        {/* Fee Plans Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-2 w-full animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFeePlans.map((feePlan) => {
              const student = getStudent(feePlan.studentId)
              const stats = getFeePlanStats(feePlan)
              const status = getFeeStatus(feePlan)
              
              return (
                <Card 
                  key={feePlan._id} 
                  className="rounded-2xl border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-medium">
                          {student?.personalInfo.firstName[0]}
                          {student?.personalInfo.lastName[0]}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {student?.personalInfo.firstName} {student?.personalInfo.lastName}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            Class {student?.academicInfo.class}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          status === 'completed' ? 'default' :
                          status === 'overdue' ? 'destructive' :
                          'secondary'
                        }
                        className={cn(
                          'capitalize text-xs',
                          status === 'completed' && 'bg-success text-success-foreground'
                        )}
                      >
                        {status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {status === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {status === 'active' && <Clock className="h-3 w-3 mr-1" />}
                        {status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(stats.paidAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of {formatCurrency(feePlan.finalAmount)}
                        </p>
                      </div>
                      {stats.dueAmount > 0 && (
                        <div className="text-right">
                          <p className={cn(
                            'text-lg font-semibold',
                            stats.overdueCount > 0 ? 'text-destructive' : 'text-warning'
                          )}>
                            {formatCurrency(stats.dueAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground">due</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Progress value={stats.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{Math.round(stats.progress)}% collected</span>
                        <span>{stats.paidCount}/{feePlan.installmentPlan.length} installments</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-2 w-2 rounded-full bg-success" />
                        <span>{stats.paidCount} paid</span>
                      </div>
                      {stats.pendingCount > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="h-2 w-2 rounded-full bg-warning" />
                          <span>{stats.pendingCount} pending</span>
                        </div>
                      )}
                      {stats.overdueCount > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                          <span>{stats.overdueCount} overdue</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/dashboard/students/${feePlan.studentId}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredFeePlans.length === 0 && (
          <Card className="rounded-2xl">
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No fee plans found</p>
              <Link href="/dashboard/fee-plans/new">
                <Button className="mt-4 gradient-bg border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Fee Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

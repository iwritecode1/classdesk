'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin,
  GraduationCap,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Check,
  Clock,
  Send,
} from 'lucide-react'
import { fetchStudentWithFees, formatCurrency, formatDate, sendReminder } from '@/lib/api'
import { mockInstitute } from '@/lib/mock-data'
import type { Student, FeePlan, Payment, Installment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface StudentDetailData {
  student: Student
  feePlan: FeePlan
  payments: Payment[]
  totalPaid: number
  dueAmount: number
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<StudentDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const res = await fetchStudentWithFees(id)
      if (res.success && res.data) {
        setData(res.data as StudentDetailData)
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  const getBatchName = (batchId: string) => {
    const batch = mockInstitute.academics.batches.find(b => b._id === batchId)
    return batch?.name || 'Unknown'
  }

  const handleSendReminder = async (installment: Installment) => {
    if (!data) return
    
    setSendingReminder(installment._id)
    
    const message = `Dear ${data.student.personalInfo.firstName}, your fee installment of ${formatCurrency(installment.amount)} was due on ${formatDate(installment.dueDate)}. Please pay at your earliest convenience.`
    
    const res = await sendReminder(data.student._id, installment._id, message)
    
    if (res.success) {
      toast.success('Reminder sent successfully via WhatsApp')
    } else {
      toast.error('Failed to send reminder')
    }
    
    setSendingReminder(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Student Details" />
        <div className="p-4 md:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 rounded-2xl bg-muted" />
              <div className="h-64 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <Header title="Student Not Found" />
        <div className="p-4 md:p-6">
          <Card className="rounded-2xl">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Student not found</p>
              <Link href="/dashboard/students">
                <Button className="mt-4">Back to Students</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { student, feePlan, payments, totalPaid, dueAmount } = data

  return (
    <div className="min-h-screen">
      <Header 
        title={`${student.personalInfo.firstName} ${student.personalInfo.lastName}`}
        description="Student profile and fee details"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/students">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
          <Link href={`/dashboard/students/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Student
            </Button>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="rounded-2xl border-border/50 md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xl font-semibold">
                  {student.personalInfo.firstName[0]}
                  {student.personalInfo.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {student.personalInfo.firstName} {student.personalInfo.lastName}
                  </h2>
                  <Badge 
                    variant={student.status === 'active' ? 'default' : 'secondary'}
                    className={student.status === 'active' ? 'bg-success text-success-foreground' : ''}
                  >
                    {student.status}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.personalInfo.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>
                    {student.address.line1}, {student.address.city}, {student.address.state} - {student.address.pincode}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>Class {student.academicInfo.class} - {student.academicInfo.schoolName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatDate(student.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {student.academicInfo.batchIds.map(batchId => (
                    <Badge key={batchId} variant="secondary" className="text-xs">
                      {getBatchName(batchId)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Summary Card */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fee Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Fees</span>
                <span className="font-semibold">{formatCurrency(feePlan?.finalAmount || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Paid</span>
                <span className="font-semibold text-success">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Due Amount</span>
                <span className={cn(
                  'text-lg font-bold',
                  dueAmount > 0 ? 'text-destructive' : 'text-success'
                )}>
                  {formatCurrency(dueAmount)}
                </span>
              </div>
              {feePlan && (
                <div className="pt-2">
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div 
                      className="h-2 rounded-full gradient-bg transition-all duration-300"
                      style={{ width: `${(totalPaid / feePlan.finalAmount) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground text-center">
                    {Math.round((totalPaid / feePlan.finalAmount) * 100)}% collected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Parents Info */}
        {student.parents.length > 0 && (
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Parents / Guardian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {student.parents.map((parent, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      {parent.name[0]}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{parent.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{parent.relation}</p>
                      <p className="text-sm text-muted-foreground">{parent.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installments */}
        {feePlan && (
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Installment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold text-right">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Paid On</TableHead>
                    <TableHead className="font-semibold w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feePlan.installmentPlan.map((installment, index) => (
                    <TableRow key={installment._id}>
                      <TableCell>{formatDate(installment.dueDate)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(installment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            installment.status === 'paid' ? 'default' :
                            installment.status === 'overdue' ? 'destructive' :
                            'secondary'
                          }
                          className={cn(
                            'capitalize',
                            installment.status === 'paid' && 'bg-success text-success-foreground'
                          )}
                        >
                          {installment.status === 'paid' && <Check className="h-3 w-3 mr-1" />}
                          {installment.status === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {installment.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {installment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {installment.paidAt ? formatDate(installment.paidAt) : '-'}
                      </TableCell>
                      <TableCell>
                        {(installment.status === 'pending' || installment.status === 'overdue') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs"
                            disabled={sendingReminder === installment._id}
                            onClick={() => handleSendReminder(installment)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            {sendingReminder === installment._id ? 'Sending...' : 'Remind'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold text-right">Amount</TableHead>
                    <TableHead className="font-semibold">Mode</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>{formatDate(payment.paidAt)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {payment.paymentMode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={payment.status === 'success' ? 'default' : 'secondary'}
                          className={payment.status === 'success' ? 'bg-success text-success-foreground' : ''}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {payment.transactionDetails?.transactionId || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

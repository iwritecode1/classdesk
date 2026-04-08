'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard/header'
import { PaymentCard } from '@/components/mobile/payment-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  IndianRupee,
  CreditCard,
  Building,
  Banknote,
  Smartphone,
  Download,
} from 'lucide-react'
import { 
  fetchPayments, 
  fetchStudents, 
  fetchFeePlans,
  createPayment, 
  formatCurrency, 
  formatDate 
} from '@/lib/api'
import type { Payment, Student, FeePlan, Installment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const paymentModes = [
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'bank', label: 'Bank Transfer', icon: Building },
  { value: 'card', label: 'Card', icon: CreditCard },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [feePlans, setFeePlans] = useState<FeePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modeFilter, setModeFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // New payment form
  const [newPayment, setNewPayment] = useState({
    studentId: '',
    installmentId: '',
    amount: 0,
    paymentMode: 'upi' as const,
    transactionId: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [paymentsRes, studentsRes, feePlansRes] = await Promise.all([
      fetchPayments(),
      fetchStudents(),
      fetchFeePlans(),
    ])
    
    if (paymentsRes.success && paymentsRes.data) setPayments(paymentsRes.data)
    if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data)
    if (feePlansRes.success && feePlansRes.data) setFeePlans(feePlansRes.data)
    
    setLoading(false)
  }

  const getStudent = (studentId: string) => {
    return students.find(s => s._id === studentId)
  }

  const getStudentFeePlan = (studentId: string) => {
    return feePlans.find(fp => fp.studentId === studentId)
  }

  const getPendingInstallments = (studentId: string): Installment[] => {
    const feePlan = getStudentFeePlan(studentId)
    if (!feePlan) return []
    return feePlan.installmentPlan.filter(i => i.status === 'pending' || i.status === 'overdue')
  }

  const filteredPayments = payments.filter(payment => {
    const student = getStudent(payment.studentId)
    const studentName = student 
      ? `${student.personalInfo.firstName} ${student.personalInfo.lastName}`.toLowerCase()
      : ''
    
    const matchesSearch = 
      studentName.includes(search.toLowerCase()) ||
      payment.transactionDetails?.transactionId?.toLowerCase().includes(search.toLowerCase())
    
    const matchesMode = modeFilter === 'all' || payment.paymentMode === modeFilter

    return matchesSearch && matchesMode
  })

  const handleSubmitPayment = async () => {
    if (!newPayment.studentId) {
      toast.error('Please select a student')
      return
    }

    if (newPayment.amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setSubmitting(true)

    const feePlan = getStudentFeePlan(newPayment.studentId)
    
    const paymentData: Omit<Payment, '_id' | 'tenantId' | 'createdAt'> = {
      studentId: newPayment.studentId,
      feePlanId: feePlan?._id || '',
      installmentId: newPayment.installmentId || undefined,
      amount: newPayment.amount,
      paymentMode: newPayment.paymentMode as Payment['paymentMode'],
      transactionDetails: newPayment.transactionId 
        ? { transactionId: newPayment.transactionId }
        : undefined,
      status: 'success',
      paidAt: new Date(),
    }

    const res = await createPayment(paymentData)

    if (res.success) {
      toast.success('Payment recorded successfully')
      setDialogOpen(false)
      setNewPayment({
        studentId: '',
        installmentId: '',
        amount: 0,
        paymentMode: 'upi',
        transactionId: '',
      })
      loadData()
    } else {
      toast.error(res.error || 'Failed to record payment')
    }

    setSubmitting(false)
  }

  const totalCollected = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen">
      <Header 
        title="Payments" 
        description="Record and track fee payments" 
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                  <p className="text-2xl font-bold gradient-text">
                    {formatCurrency(totalCollected)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(95000)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Banknote className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {payments.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by student or transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                {paymentModes.map(mode => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-bg border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Record New Payment</DialogTitle>
                  <DialogDescription>
                    Enter payment details to record a fee payment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Student *</Label>
                    <Select 
                      value={newPayment.studentId} 
                      onValueChange={(v) => setNewPayment({ ...newPayment, studentId: v, installmentId: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student._id} value={student._id}>
                            {student.personalInfo.firstName} {student.personalInfo.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {newPayment.studentId && getPendingInstallments(newPayment.studentId).length > 0 && (
                    <div className="space-y-2">
                      <Label>Installment (Optional)</Label>
                      <Select 
                        value={newPayment.installmentId} 
                        onValueChange={(v) => {
                          const installment = getPendingInstallments(newPayment.studentId).find(i => i._id === v)
                          setNewPayment({ 
                            ...newPayment, 
                            installmentId: v,
                            amount: installment?.amount || newPayment.amount
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select installment" />
                        </SelectTrigger>
                        <SelectContent>
                          {getPendingInstallments(newPayment.studentId).map((inst) => (
                            <SelectItem key={inst._id} value={inst._id}>
                              {formatDate(inst.dueDate)} - {formatCurrency(inst.amount)}
                              {inst.status === 'overdue' && ' (Overdue)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Amount *</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={newPayment.amount || ''}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                        placeholder="Enter amount"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentModes.map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => setNewPayment({ ...newPayment, paymentMode: mode.value as Payment['paymentMode'] })}
                          className={cn(
                            'flex items-center gap-2 p-3 rounded-xl border transition-all',
                            newPayment.paymentMode === mode.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-secondary/50'
                          )}
                        >
                          <mode.icon className="h-4 w-4" />
                          <span className="text-sm">{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction ID (Optional)</Label>
                    <Input
                      value={newPayment.transactionId}
                      onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
                      placeholder="UPI/Bank transaction ID"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="gradient-bg border-0" 
                    onClick={handleSubmitPayment}
                    disabled={submitting}
                  >
                    {submitting ? 'Recording...' : 'Record Payment'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mobile Card View */}
        {loading ? (
          <div className="space-y-3 md:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-5 w-32 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payments found</p>
          </div>
        ) : (
          <div className="space-y-3 md:hidden">
            {filteredPayments.map((payment) => {
              const student = getStudent(payment.studentId)
              return (
                <PaymentCard
                  key={payment._id}
                  payment={payment}
                  studentName={student ? `${student.personalInfo.firstName} ${student.personalInfo.lastName}` : 'Unknown'}
                />
              )
            })}
          </div>
        )}

        {/* Desktop Table View */}
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden hidden md:block">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                      <TableHead className="font-semibold">Student</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold text-right">Amount</TableHead>
                      <TableHead className="font-semibold">Mode</TableHead>
                      <TableHead className="font-semibold">Transaction ID</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const student = getStudent(payment.studentId)
                      const mode = paymentModes.find(m => m.value === payment.paymentMode)
                      
                      return (
                        <TableRow key={payment._id} className="hover:bg-secondary/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-sm font-medium">
                                {student?.personalInfo.firstName[0]}
                                {student?.personalInfo.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {student?.personalInfo.firstName} {student?.personalInfo.lastName}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(payment.paidAt)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize gap-1">
                              {mode && <mode.icon className="h-3 w-3" />}
                              {payment.paymentMode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm font-mono">
                            {payment.transactionDetails?.transactionId || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={payment.status === 'success' ? 'default' : 'secondary'}
                              className={payment.status === 'success' ? 'bg-success text-success-foreground' : ''}
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && filteredPayments.length === 0 && (
              <div className="p-12 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No payments found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

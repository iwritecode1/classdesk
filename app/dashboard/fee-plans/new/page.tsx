'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, IndianRupee, Calendar, Receipt } from 'lucide-react'
import { fetchStudents, createFeePlan, formatCurrency } from '@/lib/api'
import type { Student, Installment } from '@/lib/types'
import { toast } from 'sonner'

interface InstallmentInput {
  id: string
  dueDate: string
  amount: number
}

export default function NewFeePlanPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [installmentCount, setInstallmentCount] = useState(4)
  const [installments, setInstallments] = useState<InstallmentInput[]>([])

  useEffect(() => {
    async function loadStudents() {
      const res = await fetchStudents()
      if (res.success && res.data) {
        setStudents(res.data)
      }
    }
    loadStudents()
  }, [])

  const finalAmount = totalAmount - discount

  const generateInstallments = () => {
    if (finalAmount <= 0 || installmentCount <= 0) return

    const installmentAmount = Math.floor(finalAmount / installmentCount)
    const remainder = finalAmount - (installmentAmount * installmentCount)
    
    const today = new Date()
    const newInstallments: InstallmentInput[] = []
    
    for (let i = 0; i < installmentCount; i++) {
      const dueDate = new Date(today)
      dueDate.setMonth(dueDate.getMonth() + i)
      dueDate.setDate(15) // Default to 15th of each month
      
      newInstallments.push({
        id: `temp_${i}`,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: i === installmentCount - 1 ? installmentAmount + remainder : installmentAmount,
      })
    }
    
    setInstallments(newInstallments)
  }

  useEffect(() => {
    if (finalAmount > 0 && installmentCount > 0) {
      generateInstallments()
    }
  }, [finalAmount, installmentCount])

  const updateInstallment = (index: number, field: 'dueDate' | 'amount', value: string | number) => {
    const newInstallments = [...installments]
    newInstallments[index] = {
      ...newInstallments[index],
      [field]: field === 'amount' ? Number(value) : value,
    }
    setInstallments(newInstallments)
  }

  const addInstallment = () => {
    const lastInstallment = installments[installments.length - 1]
    const lastDate = lastInstallment ? new Date(lastInstallment.dueDate) : new Date()
    lastDate.setMonth(lastDate.getMonth() + 1)
    
    setInstallments([
      ...installments,
      {
        id: `temp_${Date.now()}`,
        dueDate: lastDate.toISOString().split('T')[0],
        amount: 0,
      },
    ])
  }

  const removeInstallment = (index: number) => {
    setInstallments(installments.filter((_, i) => i !== index))
  }

  const installmentsTotal = installments.reduce((sum, i) => sum + i.amount, 0)
  const amountDifference = finalAmount - installmentsTotal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!studentId) {
      toast.error('Please select a student')
      return
    }

    if (totalAmount <= 0) {
      toast.error('Please enter total amount')
      return
    }

    if (installments.length === 0) {
      toast.error('Please add at least one installment')
      return
    }

    if (Math.abs(amountDifference) > 0) {
      toast.error('Installments total must equal final amount')
      return
    }

    setLoading(true)

    const feePlanData = {
      studentId,
      totalAmount,
      discount,
      finalAmount,
      installmentPlan: installments.map((inst, index) => ({
        _id: `inst_${Date.now()}_${index}`,
        dueDate: new Date(inst.dueDate),
        amount: inst.amount,
        status: 'pending' as const,
      })),
      status: 'active' as const,
    }

    const res = await createFeePlan(feePlanData)

    if (res.success) {
      toast.success('Fee plan created successfully')
      router.push('/dashboard/fee-plans')
    } else {
      toast.error(res.error || 'Failed to create fee plan')
    }

    setLoading(false)
  }

  const selectedStudent = students.find(s => s._id === studentId)

  return (
    <div className="min-h-screen">
      <Header 
        title="Create Fee Plan" 
        description="Set up fee structure for a student" 
      />

      <div className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/dashboard/fee-plans">
            <Button variant="ghost" size="sm" type="button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fee Plans
            </Button>
          </Link>

          {/* Select Student */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Receipt className="h-5 w-5 text-primary" />
                Student Selection
              </CardTitle>
              <CardDescription>Choose the student for this fee plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Select Student *</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.personalInfo.firstName} {student.personalInfo.lastName} - Class {student.academicInfo.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStudent && (
                <div className="mt-4 p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-medium">
                    {selectedStudent.personalInfo.firstName[0]}
                    {selectedStudent.personalInfo.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedStudent.personalInfo.firstName} {selectedStudent.personalInfo.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.personalInfo.phone} | Class {selectedStudent.academicInfo.class}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fee Amount */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <IndianRupee className="h-5 w-5 text-primary" />
                Fee Structure
              </CardTitle>
              <CardDescription>Enter fee amount and discount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="totalAmount"
                      type="number"
                      value={totalAmount || ''}
                      onChange={(e) => setTotalAmount(Number(e.target.value))}
                      placeholder="120000"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="discount"
                      type="number"
                      value={discount || ''}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      placeholder="10000"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Final Amount</Label>
                  <div className="h-10 px-3 rounded-md bg-primary/10 flex items-center">
                    <span className="text-lg font-bold gradient-text">
                      {formatCurrency(finalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Number of Installments</Label>
                <Select 
                  value={installmentCount.toString()} 
                  onValueChange={(v) => setInstallmentCount(Number(v))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 6, 12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'installment' : 'installments'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Installments */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-5 w-5 text-primary" />
                    Installment Schedule
                  </CardTitle>
                  <CardDescription>Customize due dates and amounts</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addInstallment}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {installments.map((installment, index) => (
                <div 
                  key={installment.id} 
                  className="grid gap-4 sm:grid-cols-4 items-end p-4 rounded-xl bg-secondary/30"
                >
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Installment {index + 1}
                    </Label>
                    <p className="text-sm font-medium">Payment #{index + 1}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={installment.dueDate}
                      onChange={(e) => updateInstallment(index, 'dueDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={installment.amount || ''}
                        onChange={(e) => updateInstallment(index, 'amount', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    {installments.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeInstallment(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Installments Total</p>
                  <p className="text-lg font-semibold">{formatCurrency(installmentsTotal)}</p>
                </div>
                <div className="text-right">
                  {amountDifference !== 0 && (
                    <div className={amountDifference > 0 ? 'text-destructive' : 'text-warning'}>
                      <p className="text-sm">
                        {amountDifference > 0 ? 'Short by' : 'Excess of'}
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(Math.abs(amountDifference))}
                      </p>
                    </div>
                  )}
                  {amountDifference === 0 && (
                    <p className="text-sm text-success font-medium">Amounts match</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <Link href="/dashboard/fee-plans">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="gradient-bg border-0" 
              disabled={loading || Math.abs(amountDifference) > 0}
            >
              {loading ? 'Creating...' : 'Create Fee Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Bell,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Phone,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { 
  fetchOverdueStudents, 
  fetchReminders, 
  sendReminder,
  formatCurrency, 
  formatDate 
} from '@/lib/api'
import type { ReminderLog, Student, FeePlan, Installment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface OverdueStudent {
  student: Student | undefined
  feePlan: FeePlan
  overdueInstallments: Installment[]
  overdueAmount: number
}

export default function RemindersPage() {
  const [overdueStudents, setOverdueStudents] = useState<OverdueStudent[]>([])
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)
  const [sendingBulk, setSendingBulk] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [overdueRes, remindersRes] = await Promise.all([
      fetchOverdueStudents(),
      fetchReminders(),
    ])
    
    if (overdueRes.success && overdueRes.data) {
      setOverdueStudents(overdueRes.data as OverdueStudent[])
    }
    if (remindersRes.success && remindersRes.data) {
      setReminderLogs(remindersRes.data)
    }
    
    setLoading(false)
  }

  const handleSendReminder = async (student: Student, installment: Installment) => {
    setSendingReminder(`${student._id}-${installment._id}`)
    
    const message = `Dear ${student.personalInfo.firstName}, your fee installment of ${formatCurrency(installment.amount)} was due on ${formatDate(installment.dueDate)}. Please pay at your earliest convenience. - Excel Coaching Institute`
    
    const res = await sendReminder(student._id, installment._id, message)
    
    if (res.success) {
      toast.success(`Reminder sent to ${student.personalInfo.firstName} via WhatsApp`)
      loadData()
    } else {
      toast.error('Failed to send reminder')
    }
    
    setSendingReminder(null)
  }

  const handleBulkReminder = async () => {
    setSendingBulk(true)
    
    let successCount = 0
    for (const item of overdueStudents) {
      if (!item.student) continue
      
      for (const installment of item.overdueInstallments) {
        const message = `Dear ${item.student.personalInfo.firstName}, your fee installment of ${formatCurrency(installment.amount)} was due on ${formatDate(installment.dueDate)}. Please pay at your earliest convenience. - Excel Coaching Institute`
        
        const res = await sendReminder(item.student._id, installment._id, message)
        if (res.success) successCount++
      }
    }
    
    toast.success(`Sent ${successCount} reminders successfully`)
    loadData()
    setSendingBulk(false)
  }

  const totalOverdue = overdueStudents.reduce((sum, item) => sum + item.overdueAmount, 0)

  return (
    <div className="min-h-screen">
      <Header 
        title="Reminders" 
        description="Send payment reminders via WhatsApp" 
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Students</p>
                  <p className="text-2xl font-bold text-destructive">
                    {overdueStudents.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Overdue</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalOverdue)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reminders Sent</p>
                  <p className="text-2xl font-bold text-foreground">
                    {reminderLogs.filter(r => r.status === 'sent').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overdue" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overdue" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Overdue
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
            {overdueStudents.length > 0 && (
              <Button 
                className="gradient-bg border-0"
                onClick={handleBulkReminder}
                disabled={sendingBulk}
              >
                {sendingBulk ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send All Reminders
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Overdue Tab */}
          <TabsContent value="overdue">
            <Card className="rounded-2xl border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Students with Overdue Payments
                </CardTitle>
                <CardDescription>
                  Send WhatsApp reminders to students with pending dues
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 w-full animate-pulse rounded bg-muted" />
                    ))}
                  </div>
                ) : overdueStudents.length === 0 ? (
                  <div className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
                    <p className="text-lg font-medium text-foreground">All caught up!</p>
                    <p className="text-muted-foreground">No overdue payments at the moment.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                          <TableHead className="font-semibold">Student</TableHead>
                          <TableHead className="font-semibold">Contact</TableHead>
                          <TableHead className="font-semibold">Due Date</TableHead>
                          <TableHead className="font-semibold text-right">Amount</TableHead>
                          <TableHead className="font-semibold">Days Overdue</TableHead>
                          <TableHead className="font-semibold w-32">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overdueStudents.map((item) => {
                          if (!item.student) return null
                          
                          return item.overdueInstallments.map((installment) => {
                            const daysOverdue = Math.floor(
                              (new Date().getTime() - new Date(installment.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                            )
                            const isLoading = sendingReminder === `${item.student!._id}-${installment._id}`
                            
                            return (
                              <TableRow key={`${item.student!._id}-${installment._id}`} className="hover:bg-secondary/30">
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-sm font-medium">
                                      {item.student!.personalInfo.firstName[0]}
                                      {item.student!.personalInfo.lastName[0]}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {item.student!.personalInfo.firstName} {item.student!.personalInfo.lastName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Class {item.student!.academicInfo.class}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {item.student!.personalInfo.phone}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    {formatDate(installment.dueDate)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold text-destructive">
                                  {formatCurrency(installment.amount)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="destructive" className="text-xs">
                                    {daysOverdue} days
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    disabled={isLoading}
                                    onClick={() => handleSendReminder(item.student!, installment)}
                                  >
                                    {isLoading ? (
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Send className="h-3 w-3" />
                                    )}
                                    {isLoading ? 'Sending' : 'Send'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="rounded-2xl border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Reminder History
                </CardTitle>
                <CardDescription>
                  Log of all sent reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 w-full animate-pulse rounded bg-muted" />
                    ))}
                  </div>
                ) : reminderLogs.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No reminders sent yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                          <TableHead className="font-semibold">Sent At</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Channel</TableHead>
                          <TableHead className="font-semibold">Message</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reminderLogs.map((reminder) => (
                          <TableRow key={reminder._id} className="hover:bg-secondary/30">
                            <TableCell className="text-muted-foreground">
                              {reminder.sentAt ? formatDate(reminder.sentAt) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={reminder.type === 'overdue' ? 'destructive' : 'secondary'}
                                className="capitalize text-xs"
                              >
                                {reminder.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize text-xs gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {reminder.channel}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-md">
                              <p className="text-sm text-muted-foreground truncate">
                                {reminder.message}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={reminder.status === 'sent' ? 'default' : 'secondary'}
                                className={cn(
                                  'capitalize text-xs',
                                  reminder.status === 'sent' && 'bg-success text-success-foreground'
                                )}
                              >
                                {reminder.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* WhatsApp Info Card */}
        <Card className="rounded-2xl border-border/50 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
                <MessageSquare className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">WhatsApp Business Integration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Reminders are sent via WhatsApp Business API. Messages are personalized with student 
                  name and due amount. Parents receive notifications on their registered phone numbers.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: This is a simulated integration for demonstration purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

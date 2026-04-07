// Mock API functions for ClassDesk
// These simulate API calls and can be replaced with real backend integration

import type { Student, FeePlan, Payment, ReminderLog, DashboardMetrics, ApiResponse } from './types'
import { 
  mockStudents, 
  mockFeePlans, 
  mockPayments, 
  mockReminderLogs,
  calculateDashboardMetrics,
  getStudentWithFees,
  getOverdueStudents,
  getMonthlyCollectionData,
  TENANT_ID
} from './mock-data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Students API
export async function fetchStudents(): Promise<ApiResponse<Student[]>> {
  await delay(300)
  return { success: true, data: mockStudents }
}

export async function fetchStudent(id: string): Promise<ApiResponse<Student | null>> {
  await delay(200)
  const student = mockStudents.find(s => s._id === id)
  return { success: true, data: student || null }
}

export async function createStudent(student: Omit<Student, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Student>> {
  await delay(400)
  const newStudent: Student = {
    ...student,
    _id: `stu_${Date.now()}`,
    tenantId: TENANT_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockStudents.push(newStudent)
  return { success: true, data: newStudent, message: 'Student created successfully' }
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<ApiResponse<Student | null>> {
  await delay(300)
  const index = mockStudents.findIndex(s => s._id === id)
  if (index === -1) return { success: false, error: 'Student not found' }
  
  mockStudents[index] = { ...mockStudents[index], ...updates, updatedAt: new Date() }
  return { success: true, data: mockStudents[index], message: 'Student updated successfully' }
}

// Fee Plans API
export async function fetchFeePlans(): Promise<ApiResponse<FeePlan[]>> {
  await delay(300)
  return { success: true, data: mockFeePlans }
}

export async function fetchFeePlan(id: string): Promise<ApiResponse<FeePlan | null>> {
  await delay(200)
  const feePlan = mockFeePlans.find(fp => fp._id === id)
  return { success: true, data: feePlan || null }
}

export async function fetchStudentFeePlan(studentId: string): Promise<ApiResponse<FeePlan | null>> {
  await delay(200)
  const feePlan = mockFeePlans.find(fp => fp.studentId === studentId)
  return { success: true, data: feePlan || null }
}

export async function createFeePlan(feePlan: Omit<FeePlan, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FeePlan>> {
  await delay(400)
  const newFeePlan: FeePlan = {
    ...feePlan,
    _id: `fee_${Date.now()}`,
    tenantId: TENANT_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockFeePlans.push(newFeePlan)
  return { success: true, data: newFeePlan, message: 'Fee plan created successfully' }
}

// Payments API
export async function fetchPayments(): Promise<ApiResponse<Payment[]>> {
  await delay(300)
  return { success: true, data: mockPayments }
}

export async function fetchStudentPayments(studentId: string): Promise<ApiResponse<Payment[]>> {
  await delay(200)
  const payments = mockPayments.filter(p => p.studentId === studentId)
  return { success: true, data: payments }
}

export async function createPayment(payment: Omit<Payment, '_id' | 'tenantId' | 'createdAt'>): Promise<ApiResponse<Payment>> {
  await delay(400)
  const newPayment: Payment = {
    ...payment,
    _id: `pay_${Date.now()}`,
    tenantId: TENANT_ID,
    createdAt: new Date(),
  }
  mockPayments.push(newPayment)
  
  // Update installment status if applicable
  if (payment.installmentId) {
    const feePlan = mockFeePlans.find(fp => fp._id === payment.feePlanId)
    if (feePlan) {
      const installment = feePlan.installmentPlan.find(i => i._id === payment.installmentId)
      if (installment) {
        installment.status = 'paid'
        installment.paidAt = payment.paidAt
      }
    }
  }
  
  return { success: true, data: newPayment, message: 'Payment recorded successfully' }
}

// Reminders API
export async function fetchReminders(): Promise<ApiResponse<ReminderLog[]>> {
  await delay(300)
  return { success: true, data: mockReminderLogs }
}

export async function sendReminder(studentId: string, installmentId: string, message: string): Promise<ApiResponse<ReminderLog>> {
  await delay(500)
  const newReminder: ReminderLog = {
    _id: `rem_${Date.now()}`,
    tenantId: TENANT_ID,
    studentId,
    installmentId,
    type: 'overdue',
    channel: 'whatsapp',
    message,
    status: 'sent',
    sentAt: new Date(),
    createdAt: new Date(),
  }
  mockReminderLogs.push(newReminder)
  return { success: true, data: newReminder, message: 'Reminder sent successfully' }
}

// Dashboard API
export async function fetchDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
  await delay(300)
  return { success: true, data: calculateDashboardMetrics() }
}

export async function fetchStudentWithFees(studentId: string) {
  await delay(300)
  return { success: true, data: getStudentWithFees(studentId) }
}

export async function fetchOverdueStudents() {
  await delay(300)
  return { success: true, data: getOverdueStudents() }
}

export async function fetchMonthlyCollectionData() {
  await delay(200)
  return { success: true, data: getMonthlyCollectionData() }
}

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\+91)\s?(\d{5})\s?(\d{5})/, '$1 $2 $3')
}

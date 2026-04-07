import { z } from 'zod'

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  instituteName: z.string().min(3, 'Institute name is required'),
  adminName: z.string().min(2, 'Admin name is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

// Student schemas
export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  parentName: z.string().min(2, 'Parent name is required'),
  parentPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  schoolName: z.string().min(2, 'School name is required'),
  class: z.string().min(1, 'Class is required'),
  subjectsOpted: z.array(z.string()).min(1, 'At least one subject is required'),
  batchId: z.string().min(1, 'Batch is required'),
})

export const updateStudentSchema = createStudentSchema.partial()

// Batch schemas
export const batchFeeConfigSchema = z.object({
  mode: z.enum(['monthly', 'quarterly', 'yearly', 'custom']),
  frequency: z.number().optional(),
  baseAmount: z.number().positive('Base amount must be positive'),
  discount: z.number().min(0, 'Discount cannot be negative'),
  finalAmount: z.number().positive('Final amount must be positive'),
  startDate: z.coerce.date(),
})

export const createBatchSchema = z.object({
  name: z.string().min(2, 'Batch name is required'),
  subject: z.string().min(1, 'Subject is required'),
  timing: z.string().min(1, 'Timing is required'),
  description: z.string().optional(),
  capacity: z.number().positive('Capacity must be positive'),
  feeConfig: batchFeeConfigSchema,
})

export const updateBatchSchema = createBatchSchema.partial()

// Fee Plan schemas
export const createFeePlanSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  batchId: z.string().min(1, 'Batch ID is required'),
  totalAmount: z.number().positive('Total amount must be positive'),
  installments: z.number().positive('Installments must be positive'),
  dueDate: z.coerce.date(),
  status: z.enum(['pending', 'active', 'completed', 'cancelled']).optional(),
})

export const updateFeePlanSchema = createFeePlanSchema.partial()

// Payment schemas
export const createPaymentSchema = z.object({
  feePlanId: z.string().min(1, 'Fee plan ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['cash', 'online', 'cheque', 'bank_transfer']),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
})

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['completed', 'pending', 'failed', 'refunded']),
  notes: z.string().optional(),
})

// Reminder schemas
export const createReminderSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  feePlanId: z.string().optional(),
  type: z.enum(['email', 'sms', 'whatsapp']),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  scheduledDate: z.coerce.date(),
  status: z.enum(['pending', 'sent', 'failed']).optional(),
})

export const updateReminderSchema = createReminderSchema.partial()

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
})

export const studentFilterSchema = paginationSchema.extend({
  status: z.enum(['active', 'inactive']).optional(),
  batchId: z.string().optional(),
  search: z.string().optional(),
})

export const paymentFilterSchema = paginationSchema.extend({
  status: z.enum(['completed', 'pending', 'failed']).optional(),
  studentId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateStudentInput = z.infer<typeof createStudentSchema>
export type CreateBatchInput = z.infer<typeof createBatchSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type CreateReminderInput = z.infer<typeof createReminderSchema>

// Core data models for ClassDesk

export interface Institute {
  _id: string
  name: string
  owner: {
    name: string
    phone: string
    email: string
  }
  contact: {
    phone: string
    email: string
    address: {
      line1: string
      city: string
      state: string
      pincode: string
    }
  }
  academics: {
    subjects: string[]
    batches: Batch[]
  }
  paymentConfig: {
    upi: string
    paymentGateway?: string
  }
  communicationConfig: {
    whatsapp: boolean
  }
  metadata: {
    size: 'small' | 'medium' | 'large'
    establishedYear: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Batch {
  _id: string
  name: string
  subject: string
  timing: string
}

export interface Student {
  _id: string
  tenantId: string
  personalInfo: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  address: {
    line1: string
    city: string
    state: string
    pincode: string
  }
  academicInfo: {
    schoolName: string
    class: string
    subjectsOpted: string[]
    batchIds: string[]
  }
  parents: Parent[]
  status: 'active' | 'inactive' | 'graduated'
  createdAt: Date
  updatedAt: Date
}

export interface Parent {
  name: string
  relation: 'father' | 'mother' | 'guardian'
  phone: string
  email?: string
}

export interface FeePlan {
  _id: string
  tenantId: string
  studentId: string
  totalAmount: number
  discount: number
  finalAmount: number
  installmentPlan: Installment[]
  status: 'active' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface Installment {
  _id: string
  dueDate: Date
  amount: number
  status: 'pending' | 'paid' | 'overdue'
  paidAt?: Date
}

export interface Payment {
  _id: string
  tenantId: string
  studentId: string
  feePlanId: string
  installmentId?: string
  amount: number
  paymentMode: 'cash' | 'upi' | 'bank' | 'card'
  transactionDetails?: {
    transactionId?: string
    upiId?: string
    bankName?: string
  }
  status: 'success' | 'pending' | 'failed'
  paidAt: Date
  createdAt: Date
}

export interface ReminderLog {
  _id: string
  tenantId: string
  studentId: string
  installmentId: string
  type: 'due' | 'overdue' | 'upcoming'
  channel: 'whatsapp' | 'sms' | 'email'
  message: string
  status: 'sent' | 'failed' | 'pending'
  sentAt?: Date
  createdAt: Date
}

// Dashboard metrics
export interface DashboardMetrics {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  totalStudents: number
  activeStudents: number
  collectionRate: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

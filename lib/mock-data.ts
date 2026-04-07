import type { Student, FeePlan, Payment, ReminderLog, Institute, DashboardMetrics, Batch } from './types'

// Mock tenant ID
export const TENANT_ID = 'inst_001'

// Mock Institute
export const mockInstitute: Institute = {
  _id: TENANT_ID,
  name: 'Excel Coaching Institute',
  owner: {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@excelcoaching.in',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'info@excelcoaching.in',
    address: {
      line1: '123, MG Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
  },
  academics: {
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    batches: [],
  },
  paymentConfig: {
    upi: 'excelcoaching@upi',
  },
  communicationConfig: {
    whatsapp: true,
  },
  metadata: {
    size: 'medium',
    establishedYear: 2015,
  },
  createdAt: new Date('2015-06-15'),
  updatedAt: new Date(),
}

// Mock Batches
export const mockBatches: Batch[] = [
  {
    _id: 'batch_001',
    tenantId: TENANT_ID,
    name: 'JEE 2026 Morning',
    subject: 'JEE Main',
    timing: '6:00 AM - 9:00 AM',
    description: 'Comprehensive JEE Main preparation course for 2026 aspirants',
    capacity: 50,
    enrolledCount: 2,
    feeConfig: {
      mode: 'quarterly',
      frequency: 3,
      baseAmount: 120000,
      discount: 10000,
      finalAmount: 110000,
      startDate: new Date('2024-04-01'),
    },
    status: 'active',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
  },
  {
    _id: 'batch_002',
    tenantId: TENANT_ID,
    name: 'NEET 2026 Evening',
    subject: 'NEET',
    timing: '4:00 PM - 7:00 PM',
    description: 'NEET medical entrance exam preparation program',
    capacity: 40,
    enrolledCount: 2,
    feeConfig: {
      mode: 'monthly',
      frequency: 1,
      baseAmount: 150000,
      discount: 15000,
      finalAmount: 135000,
      startDate: new Date('2024-03-15'),
    },
    status: 'active',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
  },
  {
    _id: 'batch_003',
    tenantId: TENANT_ID,
    name: 'Foundation Class 10',
    subject: 'Foundation',
    timing: '2:00 PM - 4:00 PM',
    description: 'Foundation course for Class 10 students',
    capacity: 60,
    enrolledCount: 1,
    feeConfig: {
      mode: 'quarterly',
      frequency: 3,
      baseAmount: 60000,
      discount: 5000,
      finalAmount: 55000,
      startDate: new Date('2024-05-01'),
    },
    status: 'active',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date(),
  },
]

// Mock Students
export const mockStudents: Student[] = [
  {
    _id: 'stu_001',
    tenantId: TENANT_ID,
    personalInfo: {
      firstName: 'Aarav',
      lastName: 'Sharma',
      phone: '+91 99887 76655',
      email: 'aarav.sharma@email.com',
    },
    address: {
      line1: '45, Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    academicInfo: {
      schoolName: 'Delhi Public School',
      class: '12th',
      subjectsOpted: ['Mathematics', 'Physics', 'Chemistry'],
      batchId: 'batch_001',
    },
    parents: [
      { name: 'Vikram Sharma', relation: 'father', phone: '+91 98765 11111' },
      { name: 'Priya Sharma', relation: 'mother', phone: '+91 98765 22222' },
    ],
    status: 'active',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date(),
  },
  {
    _id: 'stu_002',
    tenantId: TENANT_ID,
    personalInfo: {
      firstName: 'Ananya',
      lastName: 'Patel',
      phone: '+91 88776 65544',
      email: 'ananya.patel@email.com',
    },
    address: {
      line1: '78, Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
    },
    academicInfo: {
      schoolName: 'Symbiosis School',
      class: '12th',
      subjectsOpted: ['Biology', 'Physics', 'Chemistry'],
      batchId: 'batch_002',
    },
    parents: [
      { name: 'Amit Patel', relation: 'father', phone: '+91 98765 33333' },
    ],
    status: 'active',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date(),
  },
  {
    _id: 'stu_003',
    tenantId: TENANT_ID,
    personalInfo: {
      firstName: 'Rohan',
      lastName: 'Gupta',
      phone: '+91 77665 54433',
      email: 'rohan.gupta@email.com',
    },
    address: {
      line1: '12, Baner Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
    },
    academicInfo: {
      schoolName: 'Kendriya Vidyalaya',
      class: '10th',
      subjectsOpted: ['Mathematics', 'Science'],
      batchId: 'batch_003',
    },
    parents: [
      { name: 'Suresh Gupta', relation: 'father', phone: '+91 98765 44444' },
      { name: 'Meena Gupta', relation: 'mother', phone: '+91 98765 55555' },
    ],
    status: 'active',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date(),
  },
  {
    _id: 'stu_004',
    tenantId: TENANT_ID,
    personalInfo: {
      firstName: 'Ishita',
      lastName: 'Verma',
      phone: '+91 66554 43322',
      email: 'ishita.verma@email.com',
    },
    address: {
      line1: '34, Aundh',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411007',
    },
    academicInfo: {
      schoolName: 'Modern High School',
      class: '12th',
      subjectsOpted: ['Mathematics', 'Physics', 'Chemistry'],
      batchId: 'batch_001',
    },
    parents: [
      { name: 'Rakesh Verma', relation: 'father', phone: '+91 98765 66666' },
    ],
    status: 'active',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date(),
  },
  {
    _id: 'stu_005',
    tenantId: TENANT_ID,
    personalInfo: {
      firstName: 'Kabir',
      lastName: 'Singh',
      phone: '+91 55443 32211',
      email: 'kabir.singh@email.com',
    },
    address: {
      line1: '56, Wakad',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
    },
    academicInfo: {
      schoolName: 'St. Marys School',
      class: '12th',
      subjectsOpted: ['Biology', 'Physics', 'Chemistry'],
      batchId: 'batch_002',
    },
    parents: [
      { name: 'Harpreet Singh', relation: 'father', phone: '+91 98765 77777' },
      { name: 'Gurpreet Singh', relation: 'mother', phone: '+91 98765 88888' },
    ],
    status: 'active',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date(),
  },
]

// Helper to generate dates
const getDate = (monthsAgo: number, day: number = 1) => {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsAgo)
  date.setDate(day)
  return date
}

// Mock Fee Plans
export const mockFeePlans: FeePlan[] = [
  {
    _id: 'fee_001',
    tenantId: TENANT_ID,
    studentId: 'stu_001',
    totalAmount: 120000,
    discount: 10000,
    finalAmount: 110000,
    installmentPlan: [
      { _id: 'inst_001_1', dueDate: getDate(3, 15), amount: 27500, status: 'paid', paidAt: getDate(3, 14) },
      { _id: 'inst_001_2', dueDate: getDate(2, 15), amount: 27500, status: 'paid', paidAt: getDate(2, 16) },
      { _id: 'inst_001_3', dueDate: getDate(1, 15), amount: 27500, status: 'paid', paidAt: getDate(1, 15) },
      { _id: 'inst_001_4', dueDate: getDate(0, 15), amount: 27500, status: 'pending' },
    ],
    status: 'active',
    createdAt: getDate(3, 1),
    updatedAt: new Date(),
  },
  {
    _id: 'fee_002',
    tenantId: TENANT_ID,
    studentId: 'stu_002',
    totalAmount: 150000,
    discount: 15000,
    finalAmount: 135000,
    installmentPlan: [
      { _id: 'inst_002_1', dueDate: getDate(3, 10), amount: 33750, status: 'paid', paidAt: getDate(3, 10) },
      { _id: 'inst_002_2', dueDate: getDate(2, 10), amount: 33750, status: 'paid', paidAt: getDate(2, 12) },
      { _id: 'inst_002_3', dueDate: getDate(1, 10), amount: 33750, status: 'overdue' },
      { _id: 'inst_002_4', dueDate: getDate(0, 10), amount: 33750, status: 'pending' },
    ],
    status: 'active',
    createdAt: getDate(3, 1),
    updatedAt: new Date(),
  },
  {
    _id: 'fee_003',
    tenantId: TENANT_ID,
    studentId: 'stu_003',
    totalAmount: 60000,
    discount: 5000,
    finalAmount: 55000,
    installmentPlan: [
      { _id: 'inst_003_1', dueDate: getDate(2, 5), amount: 18333, status: 'paid', paidAt: getDate(2, 5) },
      { _id: 'inst_003_2', dueDate: getDate(1, 5), amount: 18333, status: 'paid', paidAt: getDate(1, 6) },
      { _id: 'inst_003_3', dueDate: getDate(0, 5), amount: 18334, status: 'pending' },
    ],
    status: 'active',
    createdAt: getDate(2, 1),
    updatedAt: new Date(),
  },
  {
    _id: 'fee_004',
    tenantId: TENANT_ID,
    studentId: 'stu_004',
    totalAmount: 120000,
    discount: 0,
    finalAmount: 120000,
    installmentPlan: [
      { _id: 'inst_004_1', dueDate: getDate(2, 20), amount: 30000, status: 'paid', paidAt: getDate(2, 20) },
      { _id: 'inst_004_2', dueDate: getDate(1, 20), amount: 30000, status: 'overdue' },
      { _id: 'inst_004_3', dueDate: getDate(0, 20), amount: 30000, status: 'pending' },
      { _id: 'inst_004_4', dueDate: getDate(-1, 20), amount: 30000, status: 'pending' },
    ],
    status: 'active',
    createdAt: getDate(2, 15),
    updatedAt: new Date(),
  },
  {
    _id: 'fee_005',
    tenantId: TENANT_ID,
    studentId: 'stu_005',
    totalAmount: 150000,
    discount: 20000,
    finalAmount: 130000,
    installmentPlan: [
      { _id: 'inst_005_1', dueDate: getDate(2, 25), amount: 32500, status: 'paid', paidAt: getDate(2, 24) },
      { _id: 'inst_005_2', dueDate: getDate(1, 25), amount: 32500, status: 'paid', paidAt: getDate(1, 25) },
      { _id: 'inst_005_3', dueDate: getDate(0, 25), amount: 32500, status: 'pending' },
      { _id: 'inst_005_4', dueDate: getDate(-1, 25), amount: 32500, status: 'pending' },
    ],
    status: 'active',
    createdAt: getDate(2, 20),
    updatedAt: new Date(),
  },
]

// Mock Payments
export const mockPayments: Payment[] = [
  {
    _id: 'pay_001',
    tenantId: TENANT_ID,
    studentId: 'stu_001',
    feePlanId: 'fee_001',
    installmentId: 'inst_001_3',
    amount: 27500,
    paymentMode: 'upi',
    transactionDetails: { transactionId: 'UPI123456789', upiId: 'aarav@paytm' },
    status: 'success',
    paidAt: getDate(1, 15),
    createdAt: getDate(1, 15),
  },
  {
    _id: 'pay_002',
    tenantId: TENANT_ID,
    studentId: 'stu_002',
    feePlanId: 'fee_002',
    installmentId: 'inst_002_2',
    amount: 33750,
    paymentMode: 'cash',
    status: 'success',
    paidAt: getDate(2, 12),
    createdAt: getDate(2, 12),
  },
  {
    _id: 'pay_003',
    tenantId: TENANT_ID,
    studentId: 'stu_003',
    feePlanId: 'fee_003',
    installmentId: 'inst_003_2',
    amount: 18333,
    paymentMode: 'bank',
    transactionDetails: { bankName: 'HDFC Bank', transactionId: 'NEFT987654321' },
    status: 'success',
    paidAt: getDate(1, 6),
    createdAt: getDate(1, 6),
  },
  {
    _id: 'pay_004',
    tenantId: TENANT_ID,
    studentId: 'stu_004',
    feePlanId: 'fee_004',
    installmentId: 'inst_004_1',
    amount: 30000,
    paymentMode: 'upi',
    transactionDetails: { transactionId: 'UPI456789012', upiId: 'ishita@gpay' },
    status: 'success',
    paidAt: getDate(2, 20),
    createdAt: getDate(2, 20),
  },
  {
    _id: 'pay_005',
    tenantId: TENANT_ID,
    studentId: 'stu_005',
    feePlanId: 'fee_005',
    installmentId: 'inst_005_2',
    amount: 32500,
    paymentMode: 'card',
    transactionDetails: { transactionId: 'CARD789012345' },
    status: 'success',
    paidAt: getDate(1, 25),
    createdAt: getDate(1, 25),
  },
]

// Mock Reminder Logs
export const mockReminderLogs: ReminderLog[] = [
  {
    _id: 'rem_001',
    tenantId: TENANT_ID,
    studentId: 'stu_002',
    installmentId: 'inst_002_3',
    type: 'overdue',
    channel: 'whatsapp',
    message: 'Dear Ananya, your fee installment of Rs. 33,750 was due on 10th. Please pay at your earliest.',
    status: 'sent',
    sentAt: getDate(0, 12),
    createdAt: getDate(0, 12),
  },
  {
    _id: 'rem_002',
    tenantId: TENANT_ID,
    studentId: 'stu_004',
    installmentId: 'inst_004_2',
    type: 'overdue',
    channel: 'whatsapp',
    message: 'Dear Ishita, your fee installment of Rs. 30,000 was due on 20th. Please pay at your earliest.',
    status: 'sent',
    sentAt: getDate(0, 22),
    createdAt: getDate(0, 22),
  },
]

// Calculate dashboard metrics
export const calculateDashboardMetrics = (): DashboardMetrics => {
  const totalCollected = mockPayments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalFeesExpected = mockFeePlans.reduce((sum, fp) => sum + fp.finalAmount, 0)
  const totalPending = totalFeesExpected - totalCollected

  const overdueInstallments = mockFeePlans.flatMap(fp => 
    fp.installmentPlan.filter(i => i.status === 'overdue')
  )
  const totalOverdue = overdueInstallments.reduce((sum, i) => sum + i.amount, 0)

  return {
    totalCollected,
    totalPending,
    totalOverdue,
    totalStudents: mockStudents.length,
    activeStudents: mockStudents.filter(s => s.status === 'active').length,
    collectionRate: Math.round((totalCollected / totalFeesExpected) * 100),
  }
}

// Get student with fee details
export const getStudentWithFees = (studentId: string) => {
  const student = mockStudents.find(s => s._id === studentId)
  const feePlan = mockFeePlans.find(fp => fp.studentId === studentId)
  const payments = mockPayments.filter(p => p.studentId === studentId)
  
  if (!student || !feePlan) return null

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const dueAmount = feePlan.finalAmount - totalPaid

  return {
    student,
    feePlan,
    payments,
    totalPaid,
    dueAmount,
  }
}

// Get overdue students for reminders
export const getOverdueStudents = () => {
  return mockFeePlans
    .filter(fp => fp.installmentPlan.some(i => i.status === 'overdue'))
    .map(fp => {
      const student = mockStudents.find(s => s._id === fp.studentId)
      const overdueInstallments = fp.installmentPlan.filter(i => i.status === 'overdue')
      const overdueAmount = overdueInstallments.reduce((sum, i) => sum + i.amount, 0)
      return {
        student,
        feePlan: fp,
        overdueInstallments,
        overdueAmount,
      }
    })
    .filter(item => item.student !== undefined)
}

// Monthly collection data for charts
export const getMonthlyCollectionData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((month, index) => ({
    month,
    collected: [85000, 92000, 78000, 105000, 88000, 95000][index],
    pending: [25000, 18000, 32000, 15000, 22000, 20000][index],
  }))
}

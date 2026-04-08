import { Student, FeePlan } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/api'

interface StudentCardProps {
  student: Student
  feePlan?: FeePlan
  batchName: string
}

export function StudentCard({ student, feePlan, batchName }: StudentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFeeStatus = () => {
    if (!feePlan) return { label: 'No Plan', color: 'secondary' }
    
    const paid = feePlan.installmentPlan
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0)
    
    const hasOverdue = feePlan.installmentPlan.some(i => i.status === 'overdue')
    
    if (hasOverdue) return { label: 'Overdue', color: 'destructive' }
    if (paid >= feePlan.finalAmount) return { label: 'Paid', color: 'default' }
    return { label: 'Pending', color: 'secondary' }
  }

  const feeStatus = getFeeStatus()

  return (
    <Link href={`/dashboard/students/${student._id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold truncate">
                {student.personalInfo.firstName} {student.personalInfo.lastName}
              </h3>
              <Badge variant={getStatusColor(student.status) as any} className="text-[10px]">
                {student.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{batchName}</p>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{student.personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="truncate">{student.personalInfo.email}</span>
              </div>
            </div>

            {feePlan && (
              <div className="mt-3 p-2 bg-secondary rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Fee Status</span>
                  <Badge variant={feeStatus.color as any} className="text-[10px]">
                    {feeStatus.label}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>Total: {formatCurrency(feePlan.finalAmount)}</div>
                  <div>
                    Due: {formatCurrency(feePlan.finalAmount - (feePlan.installmentPlan
                      .filter(i => i.status === 'paid')
                      .reduce((sum, i) => sum + i.amount, 0)))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>
      </Card>
    </Link>
  )
}

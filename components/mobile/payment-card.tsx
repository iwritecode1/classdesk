import { Payment } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Calendar, Banknote } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/api'

interface PaymentCardProps {
  payment: Payment
  studentName: string
}

export function PaymentCard({ payment, studentName }: PaymentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      'cash': 'Cash',
      'check': 'Check',
      'online': 'Online',
      'bank_transfer': 'Bank Transfer',
    }
    return methods[method] || method
  }

  return (
    <Link href={`/dashboard/payments/${payment._id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{formatCurrency(payment.amount)}</h3>
              <Badge variant={getStatusColor(payment.status) as any} className="text-[10px]">
                {payment.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{studentName}</p>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{new Date(payment.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote className="h-3 w-3" />
                <span>{getMethodLabel(payment.method)}</span>
              </div>
            </div>

            {payment.referenceNumber && (
              <div className="mt-2 p-2 bg-secondary rounded-md">
                <span className="text-xs font-medium">Ref:</span> {payment.referenceNumber}
              </div>
            )}
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>
      </Card>
    </Link>
  )
}

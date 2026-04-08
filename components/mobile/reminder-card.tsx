import { ReminderLog } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, MessageSquare, Phone, Clock } from 'lucide-react'
import Link from 'next/link'

interface ReminderCardProps {
  reminder: ReminderLog
  studentName: string
  onResend?: (id: string) => void
}

export function ReminderCard({ reminder, studentName, onResend }: ReminderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />
      case 'sms':
        return <Phone className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getChannelLabel = (channel: string) => {
    const channels: Record<string, string> = {
      'whatsapp': 'WhatsApp',
      'sms': 'SMS',
      'email': 'Email',
    }
    return channels[channel] || channel
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold">{studentName}</h3>
          <p className="text-sm text-muted-foreground">{reminder.message}</p>
        </div>
        <Badge variant={getStatusColor(reminder.status) as any} className="text-[10px]">
          {reminder.status}
        </Badge>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-2">
          {getChannelIcon(reminder.channel)}
          <span>{getChannelLabel(reminder.channel)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>{new Date(reminder.sentAt).toLocaleString()}</span>
        </div>
      </div>

      {reminder.response && (
        <div className="p-2 bg-secondary rounded-md mb-3">
          <p className="text-xs font-medium mb-1">Response:</p>
          <p className="text-xs text-muted-foreground">{reminder.response}</p>
        </div>
      )}

      {onResend && reminder.status === 'failed' && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs h-8"
          onClick={() => onResend(reminder._id)}
        >
          Resend
        </Button>
      )}
    </Card>
  )
}

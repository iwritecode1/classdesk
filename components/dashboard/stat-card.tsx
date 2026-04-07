'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  loading?: boolean
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  loading = false,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {value}
              </p>
              {change && (
                <p
                  className={cn(
                    'text-xs font-medium',
                    changeType === 'positive' && 'text-success',
                    changeType === 'negative' && 'text-destructive',
                    changeType === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change}
                </p>
              )}
            </div>
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl',
                iconColor === 'text-primary' && 'bg-primary/10',
                iconColor === 'text-success' && 'bg-success/10',
                iconColor === 'text-destructive' && 'bg-destructive/10',
                iconColor === 'text-warning' && 'bg-warning/10'
              )}
            >
              <Icon className={cn('h-6 w-6', iconColor)} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

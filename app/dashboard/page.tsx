'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  IndianRupee, 
  Clock, 
  AlertTriangle, 
  Users,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { fetchDashboardMetrics, fetchPayments, fetchMonthlyCollectionData, formatCurrency, formatDate } from '@/lib/api'
import { mockStudents } from '@/lib/mock-data'
import type { DashboardMetrics, Payment } from '@/lib/types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [chartData, setChartData] = useState<{ month: string; collected: number; pending: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [metricsRes, paymentsRes, chartRes] = await Promise.all([
        fetchDashboardMetrics(),
        fetchPayments(),
        fetchMonthlyCollectionData(),
      ])
      
      if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data)
      if (paymentsRes.success && paymentsRes.data) setPayments(paymentsRes.data.slice(-5).reverse())
      if (chartRes.success && chartRes.data) setChartData(chartRes.data)
      
      setLoading(false)
    }
    loadData()
  }, [])

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s._id === studentId)
    return student ? `${student.personalInfo.firstName} ${student.personalInfo.lastName}` : 'Unknown'
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        description="Overview of your coaching institute" 
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Collected"
            value={metrics ? formatCurrency(metrics.totalCollected) : '...'}
            change="+12% from last month"
            changeType="positive"
            icon={IndianRupee}
            iconColor="text-primary"
            loading={loading}
          />
          <StatCard
            title="Pending Fees"
            value={metrics ? formatCurrency(metrics.totalPending) : '...'}
            change="Due this month"
            changeType="neutral"
            icon={Clock}
            iconColor="text-warning"
            loading={loading}
          />
          <StatCard
            title="Overdue Amount"
            value={metrics ? formatCurrency(metrics.totalOverdue) : '...'}
            change="Requires attention"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-destructive"
            loading={loading}
          />
          <StatCard
            title="Active Students"
            value={metrics ? `${metrics.activeStudents}` : '...'}
            change={`${metrics?.collectionRate || 0}% collection rate`}
            changeType="positive"
            icon={Users}
            iconColor="text-success"
            loading={loading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Collection Trend */}
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="h-5 w-5 text-primary" />
                Collection Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Collected']}
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCollected)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown */}
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <IndianRupee className="h-5 w-5 text-primary" />
                Monthly Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number, name: string) => [
                        formatCurrency(value), 
                        name === 'collected' ? 'Collected' : 'Pending'
                      ]}
                    />
                    <Bar dataKey="collected" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Payments</CardTitle>
            <a 
              href="/dashboard/payments" 
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                  </div>
                ))
              ) : (
                payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {getStudentName(payment.studentId)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatDate(payment.paidAt)}</span>
                        <span className="text-border">•</span>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {payment.paymentMode}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </p>
                      <Badge 
                        variant={payment.status === 'success' ? 'default' : 'secondary'}
                        className={payment.status === 'success' ? 'bg-success text-success-foreground' : ''}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

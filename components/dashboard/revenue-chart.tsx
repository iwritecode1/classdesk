'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', fees: 12000, expenses: 8000 },
  { month: 'Feb', fees: 15000, expenses: 9000 },
  { month: 'Mar', fees: 18000, expenses: 11000 },
  { month: 'Apr', fees: 22000, expenses: 12000 },
  { month: 'May', fees: 25000, expenses: 13000 },
  { month: 'Jun', fees: 28000, expenses: 14000 },
];

export function RevenueChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="fees" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expenses" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

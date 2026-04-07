'use client';

import { format } from 'date-fns';
import { Bell, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Reminder {
  id: string;
  studentName: string;
  type: 'fee' | 'exam' | 'event';
  dueDate: Date;
  description: string;
}

const reminders: Reminder[] = [
  {
    id: '1',
    studentName: 'Arjun Kumar',
    type: 'fee',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    description: 'Monthly fee payment due',
  },
  {
    id: '2',
    studentName: 'Priya Singh',
    type: 'exam',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    description: 'Physics midterm exam',
  },
  {
    id: '3',
    studentName: 'Rohan Patel',
    type: 'event',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    description: 'Parent-teacher meeting',
  },
];

export function UpcomingReminders() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Upcoming Reminders</h3>
      </div>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="mt-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-foreground">{reminder.studentName}</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{reminder.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {format(reminder.dueDate, 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

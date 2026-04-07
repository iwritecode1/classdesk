'use client';

import React from 'react';
import { Badge } from '@/components/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'info'> = {
    active: 'success',
    paid: 'success',
    pending: 'warning',
    overdue: 'destructive',
    inactive: 'destructive',
    draft: 'info',
  };

  const labels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    draft: 'Draft',
  };

  return (
    <Badge variant={variants[status.toLowerCase()] || 'default'}>
      {labels[status.toLowerCase()] || status}
    </Badge>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'default' | 'destructive' | 'ghost';
}

export function ActionButton({ onClick, label, variant = 'default' }: ActionButtonProps) {
  const baseClass =
    'px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer';

  const variantClass =
    variant === 'destructive'
      ? 'bg-red-100 text-red-700 hover:bg-red-200'
      : variant === 'ghost'
        ? 'text-gray-600 hover:bg-gray-100'
        : 'bg-blue-100 text-blue-700 hover:bg-blue-200';

  return (
    <button onClick={onClick} className={`${baseClass} ${variantClass}`}>
      {label}
    </button>
  );
}

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'ghost';
  }[];
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions = [],
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <div className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          <div className="min-h-[4rem]">{children}</div>

          {actions.length > 0 && (
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              {actions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

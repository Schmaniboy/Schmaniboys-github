'use client';

import type { ReactNode } from 'react';

import { DialogProvider } from '@/components/ui/Dialog';
import { ToastProvider } from '@/components/ui/Toast';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <DialogProvider>
      <ToastProvider>{children}</ToastProvider>
    </DialogProvider>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button } from '@/components/ui/Button';

export function AlleGelesenKnopf() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function alleGelesen() {
    fetch('/api/benachrichtigungen', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: null }),
    })
      .then(() => startTransition(() => router.refresh()))
      .catch(() => {});
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={alleGelesen}
      disabled={isPending}
    >
      {isPending ? 'Wird aktualisiert…' : 'Alle als gelesen markieren'}
    </Button>
  );
}

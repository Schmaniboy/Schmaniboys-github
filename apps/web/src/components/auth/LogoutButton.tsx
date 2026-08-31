'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      /*
       * Vollstaendiger Seitenwechsel wie beim Anmelden -- er verwirft jeden
       * im Browser verbliebenen Zustand. Auch bei einem Fehler: das Cookie
       * ist dann vielleicht noch da, aber der Zustand ist eindeutig.
       */
      window.location.assign('/');
    }
  }

  return (
    <Button variant="secondary" busy={busy} onClick={handleLogout}>
      Abmelden
    </Button>
  );
}

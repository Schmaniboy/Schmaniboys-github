'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Notification {
  id: string;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
}

interface ApiResponse {
  notifications: Notification[];
  unread: number;
}

const KIND_ICONS: Record<string, string> = {
  'message.received': 'M',
  'listing.expiring': 'A',
  'payment.confirmed': 'Z',
};

function zeitAbstand(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minuten = Math.floor(diff / 60_000);
  if (minuten < 1) return 'gerade eben';
  if (minuten < 60) return `vor ${minuten} Min.`;
  const stunden = Math.floor(minuten / 60);
  if (stunden < 24) return `vor ${stunden} Std.`;
  const tage = Math.floor(stunden / 24);
  if (tage === 1) return 'gestern';
  if (tage < 7) return `vor ${tage} Tagen`;
  return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
}

export function NotificationBell() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [offen, setOffen] = useState(false);
  const [angemeldet, setAngemeldet] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const laden = useCallback(() => {
    fetch('/api/benachrichtigungen')
      .then((r) => (r.ok ? (r.json() as Promise<ApiResponse>) : null))
      .then((payload) => {
        if (payload) {
          setData(payload);
          setAngemeldet(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    laden();
    const intervall = setInterval(laden, 60_000);
    return () => clearInterval(intervall);
  }, [laden]);

  useEffect(() => {
    if (!offen) return;
    function klickAussen(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOffen(false);
    }
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOffen(false);
    }
    document.addEventListener('mousedown', klickAussen);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', klickAussen);
      document.removeEventListener('keydown', escape);
    };
  }, [offen]);

  if (!angemeldet) return null;

  const ungelesen = data?.unread ?? 0;
  const liste = data?.notifications ?? [];

  function alleGelesen() {
    fetch('/api/benachrichtigungen', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: null }),
    })
      .then(() => laden())
      .catch(() => {});
  }

  function einzelnGelesen(id: string) {
    fetch('/api/benachrichtigungen', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    })
      .then(() => laden())
      .catch(() => {});
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={ungelesen > 0 ? `${ungelesen} ungelesene Benachrichtigungen` : 'Benachrichtigungen'}
        aria-expanded={offen}
        aria-haspopup="true"
        onClick={() => setOffen((v) => !v)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {ungelesen > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-accent-ink"
          >
            {ungelesen > 99 ? '99+' : ungelesen}
          </span>
        ) : null}
      </button>

      {offen ? (
        <div
          role="dialog"
          aria-label="Benachrichtigungen"
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-line bg-surface-1 shadow-xl sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">Benachrichtigungen</h2>
            {ungelesen > 0 ? (
              <button
                type="button"
                onClick={alleGelesen}
                className="text-xs text-accent hover:text-accent-strong"
              >
                Alle gelesen
              </button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {liste.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-subtle">
                Keine Benachrichtigungen.
              </p>
            ) : (
              <ul>
                {liste.map((n) => {
                  const ungelesen = n.readAt === null;
                  const inhalt = (
                    <div
                      className={`flex gap-3 px-4 py-3 transition-colors ${ungelesen ? 'bg-accent/[0.04]' : ''} hover:bg-surface-2`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-bold text-ink-muted"
                      >
                        {KIND_ICONS[n.kind] ?? '●'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm ${ungelesen ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                          {n.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-subtle">{n.body}</p>
                        <p className="mt-1 text-[11px] text-ink-subtle">{zeitAbstand(n.createdAt)}</p>
                      </div>
                      {ungelesen ? (
                        <span aria-label="Ungelesen" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      ) : null}
                    </div>
                  );

                  return (
                    <li key={n.id} className="border-b border-line/40 last:border-0">
                      {n.href ? (
                        <Link
                          href={n.href}
                          onClick={() => {
                            if (ungelesen) einzelnGelesen(n.id);
                            setOffen(false);
                          }}
                          className="block"
                        >
                          {inhalt}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { if (ungelesen) einzelnGelesen(n.id); }}
                          className="block w-full text-left"
                        >
                          {inhalt}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

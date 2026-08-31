'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global]', error);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#08090a',
          color: '#e5e5e5',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div style={{ maxWidth: '28rem', padding: '2rem', textAlign: 'left' }}>
          <div
            style={{
              width: '2rem',
              height: '3px',
              backgroundColor: '#ff3355',
              borderRadius: '2px',
              marginBottom: '1.5rem',
            }}
          />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
            Ein schwerwiegender Fehler ist aufgetreten
          </h1>
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: '#a3a3a3',
            }}
          >
            Die Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut
            oder laden Sie die Seite neu.
          </p>
          {error.digest ? (
            <p
              style={{
                marginTop: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#737373',
              }}
            >
              Kennung: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            type="button"
            style={{
              marginTop: '1.5rem',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#fff',
              backgroundColor: '#ff3355',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Erneut versuchen
          </button>
        </div>
      </body>
    </html>
  );
}

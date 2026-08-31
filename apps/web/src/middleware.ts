import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { buildPolicy, usesNonce } from '@/lib/csp';

/**
 * Setzt die Content-Security-Policy pro Anfrage.
 *
 * Warum hier und nicht in `next.config.ts`: Der Nonce muss pro Anfrage neu
 * entstehen. Eine feste Kopfzeile in der Konfiguration kann das nicht.
 *
 * Next.js liest die Richtlinie aus der Anfrage-Kopfzeile und versieht seine
 * eigenen Skripte mit demselben Nonce -- deshalb wird sie sowohl an die
 * Anfrage als auch an die Antwort gehaengt.
 *
 * Welche Pfade einen Nonce bekommen, entscheidet `usesNonce`. Die Begruendung
 * fuer die Aufteilung steht in `lib/csp.ts`.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/*
 * Nicht aus NODE_ENV abgeleitet, sondern aus der Adresse, unter der die
 * Anwendung laeuft: Ein gebauter Stand im eigenen Netz laeuft ueber http.
 * Begruendung steht bei `buildPolicy`.
 */
const ueberHttps = (process.env.APP_URL ?? '').startsWith('https://');

export function middleware(request: NextRequest): NextResponse {
  const nonce = usesNonce(request.nextUrl.pathname)
    ? Buffer.from(crypto.randomUUID()).toString('base64')
    : null;

  const policy = buildPolicy({ nonce, isDevelopment, ueberHttps });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('content-security-policy', policy);
  if (nonce) requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('content-security-policy', policy);
  return response;
}

export const config = {
  matcher: [
    /*
     * Alles ausser statischen Dateien und Bildoptimierung -- fuer die bringt
     * eine Richtlinie nichts und der Nonce waere zwischengespeichert.
     */
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)',
  ],
};

/**
 * Sicherheitskopfzeilen.
 *
 * Die Content-Security-Policy steht bewusst NICHT hier, sondern in
 * `middleware.ts`: sie braucht pro Anfrage einen frischen Nonce, und
 * `next.config.ts` kann keine anfragebezogenen Werte erzeugen.
 */

export interface HeaderEntry {
  key: string;
  value: string;
}

export function securityHeaders(): HeaderEntry[] {
  return [
    // Kein Erraten von Inhaltstypen -- verhindert, dass ein hochgeladenes
    // Bild als Skript ausgefuehrt wird.
    { key: 'X-Content-Type-Options', value: 'nosniff' },

    // Kein Einbetten in fremde Seiten (Clickjacking). frame-ancestors in der
    // CSP ist der modernere Weg; dies ist die Absicherung fuer alte Browser.
    { key: 'X-Frame-Options', value: 'DENY' },

    // Beim Wechsel auf fremde Seiten nur die Herkunft mitgeben, nie den Pfad.
    // Sonst leckt eine Fahrzeug-URL in fremde Zugriffsprotokolle.
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

    // Nichts davon braucht die Plattform.
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=()',
    },

    // Zwingt kuenftige Aufrufe auf HTTPS. Wirkt nur ueber HTTPS und wird von
    // Browsern bei einfachem HTTP ignoriert -- lokal also unschaedlich.
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains',
    },

    // Fremde Fenster bekommen keine Referenz auf dieses hier.
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'off' },
  ];
}

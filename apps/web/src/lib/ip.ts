import { hashWithSecret } from './hash';

/**
 * IP-Adressen werden nie im Klartext gespeichert.
 * Begruendung und Verfahren stehen in `hash.ts`.
 */
export function hashIp(ip: string | null | undefined): string | null {
  return hashWithSecret('ip', ip);
}

/**
 * Ermittelt die Client-Adresse aus den Proxy-Kopfzeilen.
 *
 * ACHTUNG: `x-forwarded-for` ist faelschbar, solange kein vertrauenswuerdiger
 * Proxy davorsteht, der die Kopfzeile ueberschreibt. Der Wert taugt fuer
 * Statistik und grobe Ratenbegrenzung, nicht als Sicherheitsmerkmal.
 */
export function clientIpFrom(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip');
}

/** Kurzform des User-Agent fuer die Sitzungsanzeige. Keine Vollspeicherung. */
export function userAgentDigest(headers: Headers): string | null {
  const agent = headers.get('user-agent');
  if (!agent) return null;
  return agent.slice(0, 120);
}

/**
 * Content-Security-Policy.
 *
 * Hier steckt ein echter Zielkonflikt, der bewusst aufgeloest wird:
 *
 * Ein Nonce ist der wirksamste Schutz gegen eingeschleuste Skripte -- aber er
 * muss pro Anfrage neu erzeugt werden. Eine statisch vorgerenderte Seite
 * enthaelt jedoch fest eingebackenes HTML; der Nonce in der Kopfzeile passt
 * dann zu keinem einzigen Skript-Tag im Dokument, und der Browser blockiert
 * ausnahmslos alles. Die Seite bleibt sichtbar, aber tot -- kein JavaScript,
 * keine Formulare, keine Navigation.
 *
 * Das ist nicht theoretisch: genau dieser Fehler wurde beim Aufbau gefunden
 * (0 von 20 Skripten hatten einen passenden Nonce) und ist der Grund fuer die
 * Aufteilung unten.
 *
 * Aufloesung: Zwei Richtlinien nach Seitenart.
 *
 *   1. Anmeldung, Konto, Haendlerbereich, Administration und API werden
 *      dynamisch gerendert und bekommen Nonce mit `'strict-dynamic'`. Dort,
 *      wo Sitzungen und Geld im Spiel sind, gilt die strenge Richtlinie.
 *
 *   2. Alles andere -- die oeffentlichen, statisch ausgelieferten Seiten --
 *      bekommt eine Richtlinie OHNE Nonce. Diese Seiten tragen keine Sitzung
 *      und keine schreibenden Handlungen; `'unsafe-inline'` ist dort ein
 *      vertretbarer Preis fuer statische Auslieferung.
 *
 * OFFENER PUNKT fuer Phase 9: Sobald oeffentliche Seiten von Nutzern oder der
 * KI erzeugten Text anzeigen, faellt der schwaechere Schutz dort ins Gewicht.
 * Gegenmassnahme ist dann nicht die Richtlinie, sondern die Darstellung:
 * solcher Text wird ausschliesslich als Text gerendert, nie als HTML.
 * Siehe docs/gehirn/04-Sicherheit.md.
 */

/**
 * Bereiche, die dynamisch gerendert werden und deshalb einen Nonce tragen
 * koennen: Anmeldung, Konto, Haendlerbereich, Administration und die API.
 *
 * Die Liste nennt die dynamischen Bereiche und nicht die statischen. Das ist
 * Absicht: Eine neue oeffentliche Seite funktioniert dann von allein, und eine
 * neue geschuetzte Seite faellt im Test auf (`tests/csp-routes.test.ts` gleicht
 * diese Liste gegen das Build-Manifest ab). Andersherum -- strenge Richtlinie
 * als Vorgabe -- wuerde jede vergessene oeffentliche Seite still ihr
 * JavaScript verlieren.
 *
 * Auch der Fall "unbekannter Pfad" faellt hierunter: Die 404-Seite wird
 * statisch ausgeliefert, der Pfad ist aber beliebig. Mit dieser Reihenfolge
 * bekommt sie die lockere Richtlinie und bleibt bedienbar.
 */
export const NONCE_PREFIXES = [
  '/anmelden',
  '/registrieren',
  '/passwort-vergessen',
  '/passwort-neu',
  '/email-bestaetigen',
  '/konto',
  '/verkaufen',
  '/haendler',
  '/admin',
  '/api',
] as const;

export function usesNonce(pathname: string): boolean {
  return NONCE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const SHARED_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Kein Einbetten in fremde Seiten (Clickjacking).
  "frame-ancestors 'none'",
  // Formulare duerfen nur an die eigene Herkunft senden.
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Next erzeugt eingebettete Stile; ohne 'unsafe-inline' bricht das Rendering.
  // Fuer Stile ist das Risiko deutlich geringer als fuer Skripte.
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
];

export function buildPolicy(options: {
  nonce: string | null;
  isDevelopment: boolean;
  /**
   * Wird die Anwendung tatsaechlich ueber https ausgeliefert?
   *
   * Davon haengt `upgrade-insecure-requests` ab -- und zwar nicht von
   * NODE_ENV. Wer den gebauten Stand im eigenen Netz startet
   * (`npm run start:netz`, Aufruf ueber http://192.168.x.x:3000), bekam
   * sonst eine Richtlinie, die den Browser anweist, JEDE Unteranfrage auf
   * https hochzustufen. Der Server spricht dort aber kein https: Die Seite
   * kam ohne Stile und ohne Skripte an -- auf dem Telefon, waehrend sie auf
   * demselben Rechner unter localhost einwandfrei aussah.
   *
   * Auf Vercel bleibt es unveraendert, weil APP_URL dort mit https beginnt.
   */
  ueberHttps: boolean;
}): string {
  const directives = [...SHARED_DIRECTIVES];

  if (options.nonce) {
    // 'strict-dynamic' laesst nur Skripte zu, die von einem freigegebenen
    // Skript geladen wurden. Ein eingeschleustes <script> nuetzt damit nichts.
    directives.push(
      options.isDevelopment
        ? `script-src 'self' 'nonce-${options.nonce}' 'strict-dynamic' 'unsafe-eval'`
        : `script-src 'self' 'nonce-${options.nonce}' 'strict-dynamic'`,
    );
  } else {
    directives.push(
      options.isDevelopment
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'",
    );
  }

  if (options.ueberHttps) directives.push('upgrade-insecure-requests');

  return directives.join('; ');
}

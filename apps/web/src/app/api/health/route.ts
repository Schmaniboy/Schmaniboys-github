import { prisma } from '@ap/db';

import { ok, route } from '@/lib/api';

/**
 * Betriebsbereitschaft. Prueft die Datenbankverbindung mit, weil eine
 * Anwendung ohne Datenbank fuer den Betrieb nicht bereit ist.
 *
 * Bewusst ohne Versionsangaben und ohne Fehlerdetails -- eine offene
 * Statusseite soll keine Angriffsflaeche beschreiben.
 */
export const GET = route(
  async () => {
    let database: 'ok' | 'unavailable' = 'ok';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'unavailable';
    }
    /*
     * Der Statuscode muss die Lage mitsagen, nicht nur der Rumpf.
     * Lastverteiler, Ueberwachungsdienste und die Gesundheitspruefung des
     * Hosters lesen den Code -- eine Antwort mit 200 und
     * "database: unavailable" im Rumpf bedeutet fuer sie: alles in Ordnung.
     * Eine Instanz ohne Datenbank bliebe damit im Verkehr und beantwortete
     * jede Anfrage mit einem Fehler.
     */
    return ok(
      { status: database === 'ok' ? 'ok' : 'degraded', database },
      database === 'ok' ? undefined : { status: 503 },
    );
  },
  { auth: 'none', rateLimit: { limit: 60, windowSeconds: 60, scope: 'health' } },
);

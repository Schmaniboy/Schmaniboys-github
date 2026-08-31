import { z } from 'zod';

/**
 * Umgebungsvariablen werden beim Start geprueft, nicht beim ersten Zugriff.
 * Ein fehlendes Geheimnis soll das Hochfahren verhindern und nicht erst
 * mitten im Betrieb auffallen.
 *
 * Regel: Nichts hier bekommt einen NEXT_PUBLIC_-Praefix. Alle Werte sind
 * serverseitig; ein Praefix wuerde sie in das Client-Bundle schreiben.
 */

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL fehlt.'),
  APP_URL: z.string().url().default('http://localhost:3000'),

  /**
   * Duerfen Suchmaschinen die Seite aufnehmen?
   *
   * Ausdrueckliche Freigabe, kein Nebeneffekt von NODE_ENV. Eine
   * Vorschau-Umgebung und ein selbst gehosteter Stand laufen ebenfalls mit
   * NODE_ENV=production -- daran die Indexierung zu haengen hiesse, dass
   * jede Vorschau in den Index geraet. Und was einmal drin ist, steht dort
   * noch, wenn die Adresse laengst nicht mehr stimmt.
   *
   * Zum Start auf "true" setzen, an genau einer Stelle.
   */
  SUCHMASCHINEN_INDEXIEREN: z
    .enum(['true', 'false'])
    .default('false')
    .transform((wert) => wert === 'true'),
  /**
   * Schluessel zum Hashen von IP-Adressen im Audit-Log. In Produktion Pflicht:
   * ohne Geheimnis waere der Hash einer IP-Adresse trivial zurueckzurechnen --
   * der Adressraum ist klein genug zum Durchprobieren.
   */
  IP_HASH_SECRET: z.string().default(''),
  ANTHROPIC_API_KEY: z.string().optional(),
  /**
   * Verzeichnis fuer Anzeigenbilder. In Produktion tritt hier ein
   * Objektspeicher an die Stelle des Dateisystems -- ausgetauscht wird dann
   * der Adapter, nicht dieser Wert.
   */
  IMAGE_STORAGE_DIR: z.string().default('.data/bilder'),

  /*
   * Objektspeicher fuer Bilder, S3-kompatibel.
   *
   * Der mitgelieferte Adapter schreibt ins Dateisystem und taugt fuer eine
   * Instanz auf einem eigenen Server. Sobald zwei Instanzen laufen, sieht
   * jede nur ihre eigenen Bilder -- und auf serverlosen Umgebungen ist das
   * Dateisystem ohnehin fluechtig.
   *
   * Sind alle fuenf Werte gesetzt, gilt der Objektspeicher. Fehlt einer,
   * bleibt es beim bisherigen Verhalten. Kein Halbzustand: Ein Speicher, der
   * "irgendwie halb eingerichtet" ist, verliert Bilder still.
   *
   * Funktioniert mit AWS S3, Cloudflare R2, MinIO, Hetzner, Backblaze --
   * ueberall dort, wo die S3-Schnittstelle spricht.
   */
  S3_ENDPOINT: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().url().optional(),
  ),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  /**
   * Steuersatz in Basispunkten: 1900 = 19,00 %.
   *
   * Ausdruecklich Konfiguration, keine Konstante des Codes. Der Wert wird mit
   * jeder Rechnung gespeichert; eine spaetere Aenderung darf alte Rechnungen
   * nicht umschreiben. Welche Besteuerung im Einzelfall richtig ist,
   * entscheidet nicht diese Anwendung.
   */
  TAX_RATE_BASIS_POINTS: z.coerce.number().int().min(0).max(10_000).default(1900),

  /**
   * Zugangsschluessel fuer Mollie.
   *
   * `test_...` fuer den Testbetrieb, `live_...` fuer echtes Geld. Fehlt er,
   * meldet sich der Zahlungsweg als nicht eingerichtet -- und es wird nichts
   * abgebucht fuer eine Funktion, die nicht laufen kann.
   *
   * Steht bewusst NICHT in der Versionsverwaltung und traegt keinen
   * NEXT_PUBLIC_-Praefix: Der Schluessel gehoert auf den Server, nicht in das
   * Bundle des Browsers.
   */
  MOLLIE_API_KEY: z.string().optional(),
  /**
   * Adresse, an die Mollie die Zahlungsbenachrichtigung schickt.
   *
   * Muss oeffentlich erreichbar sein -- auf einem Entwicklungsrechner
   * funktioniert der Rueckweg deshalb nicht ohne Tunnel. Ohne Angabe wird
   * sie aus APP_URL gebildet.
   */
  MOLLIE_WEBHOOK_URL: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().url().optional(),
  ),

  /*
   * E-Mail-Versand ueber SMTP.
   *
   * Bewusst ein Standard und kein Anbieter: Dieselben vier Werte
   * funktionieren mit Postmark, Brevo, Mailgun, SES oder einem eigenen
   * Server. Fehlen Host oder Absender, meldet sich der Versand als nicht
   * eingerichtet -- Registrierungen laufen dann ohne Bestaetigungsmail
   * durch, und das steht auch so auf der Seite.
   */
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  /** Absenderadresse, etwa "CARONEX <noreply@example.de>". */
  SMTP_FROM: z.string().optional(),
  /**
   * E-Mails in die Konsole schreiben statt zu versenden.
   *
   * Nur fuer die Entwicklung. In Produktion wird der Wert ignoriert: Eine
   * Anwendung, die Zuruecksetzlinks in ein Serverprotokoll schreibt und sich
   * dabei als versandfaehig meldet, gibt Zugaenge preis.
   */
  MAIL_TO_CONSOLE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((wert) => wert === 'true'),
});

export type Env = z.infer<typeof schema>;

function load(): Env {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Ungueltige Umgebungskonfiguration:\n${details}`);
  }

  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
  if (
    parsed.data.NODE_ENV === 'production' &&
    !isBuild &&
    parsed.data.IP_HASH_SECRET.length < 16
  ) {
    throw new Error(
      'IP_HASH_SECRET muss in Produktion gesetzt sein (mindestens 16 Zeichen).',
    );
  }

  /*
   * Ein Mollie-Schluessel muss die Form haben, die Mollie vergibt. Die
   * Pruefung faengt den haeufigsten Fehler: einen Platzhalter, der in der
   * Umgebung stehen geblieben ist. Ohne sie liefe der Zahlungsweg als
   * "eingerichtet" und schluege erst beim ersten Kauf fehl.
   */
  const schluessel = parsed.data.MOLLIE_API_KEY?.trim();
  if (schluessel && !/^(test|live)_[A-Za-z0-9]{20,}$/.test(schluessel)) {
    throw new Error(
      'MOLLIE_API_KEY hat nicht die Form eines Mollie-Schlüssels (test_… oder live_…). ' +
        'Lieber leer lassen als falsch setzen — dann meldet sich der Zahlungsweg ehrlich ' +
        'als nicht eingerichtet.',
    );
  }

  /*
   * Ein Echtschluessel gegen eine Adresse, die nicht oeffentlich erreichbar
   * ist, bedeutet: Zahlungen gehen ein, die Benachrichtigung kommt nie an,
   * und niemandem wird etwas gutgeschrieben.
   */
  if (schluessel?.startsWith('live_') && parsed.data.APP_URL.startsWith('http://localhost')) {
    throw new Error(
      'Ein Mollie-Echtschlüssel (live_…) mit APP_URL auf localhost: Die Zahlungs' +
        'benachrichtigung könnte nicht zugestellt werden, und bezahltes Guthaben käme nie an.',
    );
  }

  return parsed.data;
}

export const env: Env = load();

/**
 * Ist der Objektspeicher vollstaendig eingerichtet?
 *
 * Alle fuenf oder keiner. Drei von fuenf Werten sind kein "fast fertig",
 * sondern ein Speicher, der beim ersten Upload scheitert -- und zwar erst
 * dann, wenn jemand ein Bild hochlaedt.
 */
export const s3Eingerichtet = Boolean(
  env.S3_ENDPOINT &&
    env.S3_REGION &&
    env.S3_BUCKET &&
    env.S3_ACCESS_KEY_ID &&
    env.S3_SECRET_ACCESS_KEY,
);

/** Welche der fuenf Angaben fehlen. Fuer die Fehlermeldung beim Start. */
export function fehlendeS3Angaben(): string[] {
  const paare: Array<[string, string | undefined]> = [
    ['S3_ENDPOINT', env.S3_ENDPOINT],
    ['S3_REGION', env.S3_REGION],
    ['S3_BUCKET', env.S3_BUCKET],
    ['S3_ACCESS_KEY_ID', env.S3_ACCESS_KEY_ID],
    ['S3_SECRET_ACCESS_KEY', env.S3_SECRET_ACCESS_KEY],
  ];
  return paare.filter(([, wert]) => !wert).map(([name]) => name);
}

export const isProduction = env.NODE_ENV === 'production';

/**
 * Nur wenn ausdruecklich freigegeben UND die Adresse oeffentlich erreichbar
 * ist. Ein Index-Eintrag, der auf http://localhost zeigt, ist fuer niemanden
 * aufrufbar -- und waere trotzdem monatelang in den Ergebnissen.
 */
export const darfIndexiertWerden =
  env.SUCHMASCHINEN_INDEXIEREN &&
  !env.APP_URL.startsWith('http://localhost') &&
  !env.APP_URL.startsWith('http://127.0.0.1');
export const isDevelopment = env.NODE_ENV === 'development';

/** Cookies nur ueber HTTPS ausliefern -- ausser lokal, wo es kein HTTPS gibt. */
export const useSecureCookies = env.APP_URL.startsWith('https://');

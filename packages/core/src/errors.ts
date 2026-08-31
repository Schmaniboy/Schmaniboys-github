/**
 * Zentrale Fehlertaxonomie der Plattform.
 *
 * Regel: Jeder Fehler, der eine HTTP-Antwort erzeugt, ist ein AppError.
 * Alles andere ist ein Programmierfehler und wird als 500 ohne Details
 * beantwortet. `expose` entscheidet, ob die Nachricht den Client erreicht --
 * niemals interne Details, Stacktraces oder Datenbankmeldungen nach aussen.
 */

export const ErrorCode = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  RATE_LIMITED: 'RATE_LIMITED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL: 'INTERNAL',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Welche Meldungen den Client erreichen duerfen.
 *
 * Alle 4xx: Sie beschreiben, was die anfragende Seite falsch gemacht hat --
 * das ist der Sinn der Antwort.
 *
 * Zusaetzlich NOT_IMPLEMENTED und SERVICE_UNAVAILABLE: Beides sind
 * Betriebszustaende, keine Programmierfehler. Ihre Meldungen sind
 * ausdruecklich fuer Nutzer geschrieben ("Es wurde kein Guthaben
 * verbraucht") und muessen ankommen.
 *
 * NICHT ausgeliefert wird INTERNAL. Diese Meldungen koennen
 * Implementierungsdetails verraten und sind fuer den Client ohnehin
 * nutzlos -- Ursache und Stacktrace gehen ins Log.
 *
 * Anfangs galt schlicht `status < 500`. Das war zu grob: Es verschluckte
 * genau die Meldungen, die einer wartenden Person erklaeren, warum eine
 * Funktion nicht laeuft und dass sie nichts bezahlt hat.
 */
const AUSLIEFERBAR: ReadonlySet<string> = new Set([
  'VALIDATION_FAILED',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'PRECONDITION_FAILED',
  'PAYLOAD_TOO_LARGE',
  'UNSUPPORTED_MEDIA_TYPE',
  'RATE_LIMITED',
  'INSUFFICIENT_FUNDS',
  'NOT_IMPLEMENTED',
  'SERVICE_UNAVAILABLE',
]);

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RATE_LIMITED: 429,
  INSUFFICIENT_FUNDS: 402,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL: 500,
};

/** Strukturierte Feldfehler, wie sie aus der Validierung entstehen. */
export type FieldIssues = Record<string, string[]>;

export interface AppErrorOptions {
  /** Kurze, fuer den Client unbedenkliche Nachricht. */
  message?: string;
  /** Feldbezogene Details, nur bei Validierungsfehlern sinnvoll. */
  issues?: FieldIssues;
  /** Ursprungsfehler. Wird geloggt, aber nie ausgeliefert. */
  cause?: unknown;
  /** Interne Notiz fuer das Log. Erreicht den Client nie. */
  internal?: string;
  /** Sekunden bis zum naechsten erlaubten Versuch (nur bei RATE_LIMITED). */
  retryAfterSeconds?: number;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly expose: boolean;
  readonly issues: FieldIssues | undefined;
  readonly internal: string | undefined;
  readonly retryAfterSeconds: number | undefined;

  constructor(code: ErrorCode, options: AppErrorOptions = {}) {
    super(options.message ?? DEFAULT_MESSAGES[code], { cause: options.cause });
    this.name = 'AppError';
    this.code = code;
    this.status = STATUS_BY_CODE[code];
    this.expose = AUSLIEFERBAR.has(code);
    this.issues = options.issues;
    this.internal = options.internal;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }

  /** Die Form, die tatsaechlich ueber die API geht. */
  toPublicJSON(): { error: { code: ErrorCode; message: string; issues?: FieldIssues } } {
    return {
      error: {
        code: this.code,
        message: this.expose ? this.message : DEFAULT_MESSAGES[ErrorCode.INTERNAL],
        ...(this.issues ? { issues: this.issues } : {}),
      },
    };
  }
}

const DEFAULT_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_FAILED: 'Die Eingaben sind unvollstaendig oder ungueltig.',
  UNAUTHENTICATED: 'Anmeldung erforderlich.',
  FORBIDDEN: 'Keine Berechtigung fuer diese Aktion.',
  NOT_FOUND: 'Nicht gefunden.',
  CONFLICT: 'Der Vorgang steht im Konflikt mit dem aktuellen Stand.',
  PRECONDITION_FAILED: 'Voraussetzung nicht erfuellt.',
  PAYLOAD_TOO_LARGE: 'Die Daten sind zu gross.',
  UNSUPPORTED_MEDIA_TYPE: 'Dieser Inhaltstyp wird nicht unterstuetzt.',
  RATE_LIMITED: 'Zu viele Anfragen. Bitte spaeter erneut versuchen.',
  INSUFFICIENT_FUNDS: 'Das Guthaben reicht fuer diese Aktion nicht aus.',
  NOT_IMPLEMENTED: 'Diese Funktion ist noch nicht verfuegbar.',
  SERVICE_UNAVAILABLE: 'Der Dienst ist voruebergehend nicht verfuegbar.',
  INTERNAL: 'Unerwarteter Fehler. Der Vorgang wurde nicht ausgefuehrt.',
};

export const errors = {
  validation: (issues: FieldIssues, message?: string) =>
    new AppError(ErrorCode.VALIDATION_FAILED, { issues, ...(message ? { message } : {}) }),
  unauthenticated: (internal?: string) =>
    new AppError(ErrorCode.UNAUTHENTICATED, { ...(internal ? { internal } : {}) }),
  forbidden: (internal?: string) =>
    new AppError(ErrorCode.FORBIDDEN, { ...(internal ? { internal } : {}) }),
  notFound: (message?: string) =>
    new AppError(ErrorCode.NOT_FOUND, { ...(message ? { message } : {}) }),
  conflict: (message?: string) =>
    new AppError(ErrorCode.CONFLICT, { ...(message ? { message } : {}) }),
  rateLimited: (retryAfterSeconds: number) =>
    new AppError(ErrorCode.RATE_LIMITED, { retryAfterSeconds }),
  insufficientFunds: (message?: string) =>
    new AppError(ErrorCode.INSUFFICIENT_FUNDS, { ...(message ? { message } : {}) }),
  notImplemented: (message?: string) =>
    new AppError(ErrorCode.NOT_IMPLEMENTED, { ...(message ? { message } : {}) }),
  payloadTooLarge: (message?: string) =>
    new AppError(ErrorCode.PAYLOAD_TOO_LARGE, { ...(message ? { message } : {}) }),
  unsupportedMediaType: (message?: string) =>
    new AppError(ErrorCode.UNSUPPORTED_MEDIA_TYPE, { ...(message ? { message } : {}) }),
  preconditionFailed: (message?: string) =>
    new AppError(ErrorCode.PRECONDITION_FAILED, { ...(message ? { message } : {}) }),
  internal: (cause?: unknown, internal?: string) =>
    new AppError(ErrorCode.INTERNAL, { cause, ...(internal ? { internal } : {}) }),
};

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

/**
 * Wandelt beliebige Fehler in einen AppError. Unbekanntes wird bewusst zu
 * INTERNAL -- lieber eine nichtssagende 500 als ein durchgereichtes Detail.
 */
export function toAppError(value: unknown): AppError {
  if (isAppError(value)) return value;
  return errors.internal(value, value instanceof Error ? value.message : String(value));
}

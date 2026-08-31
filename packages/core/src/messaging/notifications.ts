/**
 * Benachrichtigungen.
 *
 * Eigene Tabelle statt "ungelesene Nachrichten zaehlen": Spaeter kommen
 * Ereignisse dazu, die keine Nachricht sind -- eine ablaufende Anzeige, ein
 * bestaetigter Kauf. Die Art steht als Zeichenkette in der Datenbank; der
 * gueltige Wertebereich steht hier.
 */

export const NotificationKind = {
  MESSAGE_RECEIVED: 'message.received',
  LISTING_EXPIRING: 'listing.expiring',
  PAYMENT_CONFIRMED: 'payment.confirmed',
} as const;

export type NotificationKind = (typeof NotificationKind)[keyof typeof NotificationKind];

export const NOTIFICATION_LABELS: Record<string, string> = {
  'message.received': 'Neue Nachricht',
  'listing.expiring': 'Anzeige läuft bald ab',
  'payment.confirmed': 'Zahlung bestätigt',
};

/**
 * Text einer Benachrichtigung ueber eine neue Nachricht.
 *
 * Der Nachrichtentext selbst geht NICHT hinein -- eine Benachrichtigung
 * erscheint an Stellen, an denen sie jemand mitliest (Bildschirm im Buero,
 * spaeter eine E-Mail). Sie sagt, dass etwas da ist, nicht was.
 */
export function nachrichtenBenachrichtigung(input: {
  absender: string;
  fahrzeug: string | null;
  conversationId: string;
}): { kind: NotificationKind; title: string; body: string; href: string } {
  return {
    kind: NotificationKind.MESSAGE_RECEIVED,
    title: `Neue Nachricht von ${input.absender}`,
    body: input.fahrzeug
      ? `Es geht um: ${input.fahrzeug}`
      : 'Öffnen Sie das Gespräch, um sie zu lesen.',
    href: `/konto/nachrichten/${input.conversationId}`,
  };
}

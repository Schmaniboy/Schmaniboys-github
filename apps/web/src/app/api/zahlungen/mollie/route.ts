import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { confirmTokenPurchase } from '@ap/core';
import { auditLogger, findPaymentIntent } from '@ap/db';

import { confirmDeps, paymentProvider } from '@/lib/billing-deps';

/**
 * Zahlungsbenachrichtigung von Mollie.
 *
 * Der heikelste Endpunkt der ganzen Anwendung. Er ist oeffentlich, er wird
 * von aussen aufgerufen, und was er tut, ist Geld gutschreiben. Vier Dinge
 * halten ihn zusammen:
 *
 * 1. **Der Benachrichtigung wird nichts geglaubt.** Mollie signiert sie
 *    nicht -- sie enthaelt nur eine Zahlungskennung. Der Adapter fragt
 *    deshalb beim Anbieter nach, was zu dieser Kennung gilt. Wer hier dem
 *    Aufruf glaubte, haette einen Endpunkt gebaut, an dem sich jeder
 *    Guthaben schenken kann.
 * 2. **Er laeuft ohne Sitzung.** Mollie hat kein Konto bei uns. Deshalb
 *    ausdruecklich NICHT ueber `route()` mit `auth`, sondern eigenstaendig --
 *    und ohne jede Berechtigung ausser der, einen Vorgang zu bestaetigen,
 *    den es schon gibt.
 * 3. **Er antwortet immer mit 200, wenn er verstanden hat.** Mollie
 *    wiederholt bei Fehlerantworten. Eine 500 auf einen Vorgang, den es bei
 *    uns nicht gibt, erzeugte eine endlose Wiederholung.
 * 4. **Er verraet nichts.** Die Antwort ist leer. Ein Unterschied zwischen
 *    "Vorgang bekannt" und "unbekannt" waere ein Weg, Vorgangskennungen zu
 *    erraten.
 */

/** Mollie schickt ein Formular, keine JSON-Nutzlast. */
const MAX_KOERPER = 4096;

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!paymentProvider.isAvailable()) {
    // Kein Zahlungsweg eingerichtet: Es kann keine echte Benachrichtigung
    // geben. Stillschweigend beenden, statt einen Fehler zu erzeugen.
    return new NextResponse(null, { status: 204 });
  }

  let koerper: string;
  try {
    koerper = await request.text();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (koerper.length > MAX_KOERPER) {
    return new NextResponse(null, { status: 413 });
  }

  let vorgangskennung: string;
  try {
    const ergebnis = await paymentProvider.handleWebhook(koerper, {});
    vorgangskennung = ergebnis.reference;
  } catch (fehler) {
    /*
     * Die Nachfrage beim Anbieter schlug fehl oder die Kennung war unsinnig.
     * Protokollieren und mit 200 antworten: Eine Wiederholung wuerde am
     * selben Punkt scheitern.
     */
    await auditLogger.record({
      action: 'payment.webhook.rejected',
      actorId: null,
      subjectType: 'PaymentIntent',
      subjectId: 'unbekannt',
      metadata: { grund: fehler instanceof Error ? fehler.message : 'unbekannt' },
    });
    return new NextResponse(null, { status: 200 });
  }

  const vorgang = await findPaymentIntent(vorgangskennung);
  if (!vorgang) {
    await auditLogger.record({
      action: 'payment.webhook.unknown',
      actorId: null,
      subjectType: 'PaymentIntent',
      subjectId: vorgangskennung,
      metadata: {},
    });
    return new NextResponse(null, { status: 200 });
  }

  try {
    /*
     * Derselbe Anwendungsfall wie bei der Rueckkehr von der Bezahlseite.
     * Er fragt selbst beim Anbieter nach, prueft den Betrag und schreibt
     * genau einmal gut -- eine doppelte Benachrichtigung aendert nichts.
     */
    const ergebnis = await confirmTokenPurchase(confirmDeps, vorgangskennung);

    await auditLogger.record({
      action: ergebnis.credited ? 'payment.webhook.credited' : 'payment.webhook.noop',
      actorId: null,
      subjectType: 'PaymentIntent',
      subjectId: vorgang.id,
      metadata: { tokens: ergebnis.tokens, invoice: ergebnis.invoiceNumber },
    });
  } catch (fehler) {
    await auditLogger.record({
      action: 'payment.webhook.failed',
      actorId: null,
      subjectType: 'PaymentIntent',
      subjectId: vorgang.id,
      metadata: { grund: fehler instanceof Error ? fehler.message : 'unbekannt' },
    });
    /*
     * Hier ausnahmsweise 500: Ein Betragsunterschied oder ein Fehler beim
     * Gutschreiben ist ein Zustand, den eine Wiederholung tatsaechlich
     * beheben kann -- und der nicht untergehen darf.
     */
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}

/**
 * Mollie prueft die Erreichbarkeit teils mit GET.
 *
 * Eine leere 200 genuegt und verraet nichts.
 */
export async function GET(): Promise<NextResponse> {
  return new NextResponse(null, { status: 200 });
}

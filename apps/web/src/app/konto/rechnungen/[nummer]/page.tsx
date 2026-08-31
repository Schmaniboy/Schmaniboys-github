import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { formatiereCent, formatiereSteuersatz } from '@ap/core';
import { findOwnInvoice } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Rechnung' };
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ nummer: string }>;
}

const STATUS_TEXT: Record<string, string> = {
  OPEN: 'Offen',
  PAID: 'Bezahlt',
  CANCELLED: 'Storniert',
};

/**
 * Eine einzelne Rechnung.
 *
 * Eine fremde Rechnung ist "nicht gefunden", nicht "verboten" -- sonst
 * liesse sich ueber die Fehlerantwort aufzaehlen, welche Rechnungsnummern
 * vergeben sind. Bei fortlaufenden Nummern waere das besonders bequem.
 */
export default async function RechnungPage({ params }: Props) {
  const { nummer } = await params;
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const rechnung = await findOwnInvoice(decodeURIComponent(nummer), session.principal.userId);
  if (!rechnung) notFound();

  const anschrift = [
    rechnung.billingName,
    rechnung.billingStreet,
    [rechnung.billingPostalCode, rechnung.billingCity].filter(Boolean).join(' '),
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[{ href: '/konto/rechnungen', label: 'Rechnungen' }, { label: rechnung.number }]}
      />

      <div className="accent-rule mb-5 mt-4" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="tabular text-2xl font-semibold tracking-tight text-ink">
          {rechnung.number}
        </h1>
        <Badge tone={rechnung.status === 'PAID' ? 'positive' : 'neutral'}>
          {STATUS_TEXT[rechnung.status] ?? rechnung.status}
        </Badge>
      </div>

      {rechnung.status === 'CANCELLED' ? (
        <p className="mt-4 rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution">
          Diese Rechnung wurde storniert{rechnung.cancellationReason ? `: ${rechnung.cancellationReason}` : '.'}{' '}
          Sie bleibt erhalten — gelöscht wird nie, sonst bekäme die Nummernfolge Lücken.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader title="Rechnungsempfänger" />
          <CardBody>
            <address className="not-italic text-sm leading-relaxed text-ink">
              {anschrift.map((zeile) => (
                <span key={zeile} className="block">
                  {zeile}
                </span>
              ))}
            </address>
            <p className="mt-2 text-sm text-ink-muted">{rechnung.billingEmail}</p>
            {rechnung.billingVatId ? (
              <p className="mt-1 text-sm text-ink-muted">USt-IdNr.: {rechnung.billingVatId}</p>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Angaben" />
          <CardBody>
            <dl className="text-sm">
              {[
                { bezeichnung: 'Rechnungsdatum', wert: rechnung.issuedAt.toLocaleDateString('de-DE') },
                {
                  bezeichnung: 'Zahlungsdatum',
                  wert: rechnung.paidAt?.toLocaleDateString('de-DE') ?? null,
                },
                { bezeichnung: 'Zahlungsstand', wert: rechnung.paymentState },
                { bezeichnung: 'Zahlungsreferenz', wert: rechnung.paymentReference },
              ]
                .filter((eintrag) => eintrag.wert)
                .map((eintrag) => (
                  <div
                    key={eintrag.bezeichnung}
                    className="flex justify-between gap-4 border-b border-line/40 py-1.5 last:border-0"
                  >
                    <dt className="text-ink-subtle">{eintrag.bezeichnung}</dt>
                    <dd className="break-all text-right text-ink">{eintrag.wert}</dd>
                  </div>
                ))}
            </dl>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Positionen" />
        <CardBody>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-subtle">
                <th className="py-2 pr-4">Bezeichnung</th>
                <th className="py-2 pr-4 text-right">Menge</th>
                <th className="py-2 pr-4 text-right">Einzelpreis</th>
                <th className="py-2 text-right">Netto</th>
              </tr>
            </thead>
            <tbody>
              {rechnung.items.map((position) => (
                <tr key={position.position} className="border-b border-line/40">
                  <td className="py-2 pr-4 text-ink">{position.description}</td>
                  <td className="tabular py-2 pr-4 text-right text-ink-muted">
                    {position.quantity}
                  </td>
                  <td className="tabular py-2 pr-4 text-right text-ink-muted">
                    {formatiereCent(position.unitNetCents)}
                  </td>
                  <td className="tabular py-2 text-right text-ink">
                    {formatiereCent(position.lineNetCents)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-2 pr-4 text-right text-ink-subtle">
                  Netto
                </td>
                <td className="tabular py-2 text-right text-ink">
                  {formatiereCent(rechnung.netCents)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="py-1 pr-4 text-right text-ink-subtle">
                  Umsatzsteuer {formatiereSteuersatz(rechnung.taxRateBasisPoints)}
                </td>
                <td className="tabular py-1 text-right text-ink">
                  {formatiereCent(rechnung.taxCents)}
                </td>
              </tr>
              <tr className="border-t border-line">
                <td colSpan={3} className="py-2 pr-4 text-right font-medium text-ink">
                  Gesamtbetrag
                </td>
                <td className="tabular py-2 text-right text-lg font-semibold text-ink">
                  {formatiereCent(rechnung.grossCents)}
                </td>
              </tr>
            </tfoot>
          </table>

          {rechnung.taxNote ? (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{rechnung.taxNote}</p>
          ) : null}
        </CardBody>
      </Card>

      <p className="mt-6 text-sm text-ink-muted">
        <Link href="/konto/rechnungen" className="underline-offset-4 hover:underline">
          Zurück zur Übersicht
        </Link>
      </p>
    </div>
  );
}

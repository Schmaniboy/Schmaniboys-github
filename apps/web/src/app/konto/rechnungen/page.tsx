import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { formatiereCent, formatiereSteuersatz } from '@ap/core';
import { listOwnInvoices } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Table, Th, Td } from '@/components/ui/Table';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Rechnungen' };
export const dynamic = 'force-dynamic';

const STATUS_TEXT: Record<string, string> = {
  OPEN: 'Offen',
  PAID: 'Bezahlt',
  CANCELLED: 'Storniert',
};

const STATUS_TON: Record<string, 'positive' | 'neutral' | 'caution'> = {
  OPEN: 'neutral',
  PAID: 'positive',
  CANCELLED: 'caution',
};

export default async function RechnungenPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const rechnungen = await listOwnInvoices(session.principal.userId);

  return (
    <DashboardShell
      title="Rechnungen"
      description="Ihre Rechnungen zu gekauftem Guthaben."
      navigation={KONTO_NAVIGATION}
    >
      {rechnungen.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Es liegt noch keine Rechnung vor. Rechnungen entstehen beim Kauf von
              Guthaben — und ein Zahlungsweg ist derzeit nicht eingerichtet.
            </p>
          </CardBody>
        </Card>
      ) : (
        <Table caption="Rechnungsübersicht">
          <thead>
            <tr>
              <Th>Nummer</Th>
              <Th>Datum</Th>
              <Th numeric>Netto</Th>
              <Th numeric>Steuer</Th>
              <Th numeric>Brutto</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rechnungen.map((rechnung) => (
              <tr key={rechnung.number}>
                <Td>
                  <Link
                    href={`/konto/rechnungen/${rechnung.number}`}
                    className="tabular text-ink underline-offset-4 hover:underline"
                  >
                    {rechnung.number}
                  </Link>
                </Td>
                <Td>{rechnung.issuedAt.toLocaleDateString('de-DE')}</Td>
                <Td numeric>{formatiereCent(rechnung.netCents)}</Td>
                <Td numeric>
                  {formatiereCent(rechnung.taxCents)}{' '}
                  <span className="text-xs text-ink-subtle">
                    ({formatiereSteuersatz(rechnung.taxRateBasisPoints)})
                  </span>
                </Td>
                <Td numeric className="font-medium text-ink">
                  {formatiereCent(rechnung.grossCents)}
                </Td>
                <Td>
                  <Badge tone={STATUS_TON[rechnung.status] ?? 'neutral'}>
                    {STATUS_TEXT[rechnung.status] ?? rechnung.status}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Card className="mt-6">
        <CardHeader title="Wozu diese Anwendung nichts sagt" eyebrow="Einordnung" />
        <CardBody>
          <p className="text-sm leading-relaxed text-ink-muted">
            Die Rechnungen enthalten Nummer, Datum, Empfänger, Positionen, Netto, Steuer,
            Brutto, Zahlungsstand und Zahlungsreferenz. Ob eine Rechnung damit allen
            steuerlichen und rechtlichen Anforderungen genügt, entscheidet diese Anwendung
            nicht und behauptet sie auch nicht. Der Steuersatz ist eine Einstellung, keine
            Zusicherung; er wird mit jeder Rechnung gespeichert, damit eine spätere
            Änderung ausgestellte Rechnungen nicht verändert.
          </p>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

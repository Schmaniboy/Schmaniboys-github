import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { ALL_TOKEN_COSTS, COST_LABELS, TOKEN_PACKAGES, priceOf } from '@ap/core';
import { walletRepository } from '@ap/db';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { Pagination } from '@/components/ui/Pagination';
import { Table, Td, Th } from '@/components/ui/Table';
import { TokenPurchase } from '@/components/billing/TokenPurchase';
import { paymentProvider, TAX_RATE_BASIS_POINTS } from '@/lib/billing-deps';
import { getCurrentSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Guthaben' };

const TYP_BEZEICHNUNG: Record<string, string> = {
  PURCHASE: 'Aufladung',
  USAGE: 'Verbrauch',
  REFUND: 'Erstattung',
  ADMIN_CREDIT: 'Gutschrift',
  ADMIN_DEBIT: 'Abbuchung',
  ADJUSTMENT: 'Korrektur',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const BUCHUNGEN_PRO_SEITE = 25;

export default async function GuthabenPage({ searchParams }: Props) {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const roh = await searchParams;
  const seite = Number(typeof roh.seite === 'string' ? roh.seite : 0) || 0;

  const konto = await walletRepository.ensureWallet(session.principal.userId);
  const historie = await walletRepository.listTransactions(session.principal.userId, {
    limit: BUCHUNGEN_PRO_SEITE,
    offset: seite * BUCHUNGEN_PRO_SEITE,
  });

  const steuersatz = TAX_RATE_BASIS_POINTS;
  const zahlungswegVorhanden = paymentProvider.isAvailable();

  return (
    <DashboardShell
      title="Guthaben"
      description="Ihr Tokenstand und alle Buchungen."
      navigation={KONTO_NAVIGATION}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardBody>
            <p className="eyebrow">Verfügbar</p>
            <p className="tabular mt-1 text-3xl font-semibold text-ink">
              {konto.availableTokens.toLocaleString('de-DE')}
            </p>
            <p className="mt-1 text-xs text-ink-subtle">Tokens</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="eyebrow">Guthaben gesamt</p>
            <p className="tabular mt-1 text-3xl font-semibold text-ink">
              {konto.balanceTokens.toLocaleString('de-DE')}
            </p>
            <p className="mt-1 text-xs text-ink-subtle">Tokens</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="eyebrow">Reserviert</p>
            <p className="tabular mt-1 text-3xl font-semibold text-ink">
              {konto.reservedTokens.toLocaleString('de-DE')}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
              Für laufende Vorgänge blockiert. Scheitert ein Vorgang, wird der
              Betrag wieder frei.
            </p>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Was kostet was" eyebrow="Preise" />
        <CardBody>
          <ul className="space-y-2">
            {ALL_TOKEN_COSTS.map((kind) => (
              <li
                key={kind}
                className="flex items-baseline justify-between gap-4 border-t border-line py-2 first:border-t-0 first:pt-0"
              >
                <span className="text-sm text-ink-muted">{COST_LABELS[kind]}</span>
                <span className="tabular text-sm text-ink">{priceOf(kind)} Tokens</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Guthaben aufladen" eyebrow="Kauf" />
        <CardBody>
          <TokenPurchase
            pakete={TOKEN_PACKAGES.map((paket) => ({
              id: paket.id,
              label: paket.label,
              tokens: paket.tokens,
              netCents: paket.netCents,
              grossCents: paket.netCents + Math.round((paket.netCents * steuersatz) / 10_000),
            }))}
            steuersatz={steuersatz}
            verfuegbar={zahlungswegVorhanden}
          />
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Buchungen" eyebrow="Historie" />
        <CardBody>
          {historie.items.length === 0 ? (
            <DataGap reason="noch keine Buchungen" />
          ) : (
            <Table caption="Buchungen auf Ihrem Guthabenkonto">
              <thead>
                <tr>
                  <Th>Datum</Th>
                  <Th>Vorgang</Th>
                  <Th>Art</Th>
                  <Th numeric>Betrag</Th>
                  <Th numeric>Stand danach</Th>
                </tr>
              </thead>
              <tbody>
                {historie.items.map((buchung) => (
                  <tr key={buchung.id}>
                    <Td>{buchung.createdAt.toLocaleDateString('de-DE')}</Td>
                    <Td>{buchung.purpose}</Td>
                    <Td>{TYP_BEZEICHNUNG[buchung.type] ?? buchung.type}</Td>
                    <Td numeric className={buchung.amountTokens < 0 ? 'text-ink' : 'text-positive'}>
                      {buchung.amountTokens > 0 ? '+' : ''}
                      {buchung.amountTokens.toLocaleString('de-DE')}
                    </Td>
                    <Td numeric>{buchung.balanceAfter.toLocaleString('de-DE')}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <Pagination
            pfad="/konto/guthaben"
            seite={seite}
            gesamt={historie.total}
            seitengroesse={BUCHUNGEN_PRO_SEITE}
          />
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

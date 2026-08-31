import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { DATA_QUALITY_LABELS, type DataQuality, Permission, can } from '@ap/core';
import { ladeRedaktionsliste, zaehleRedaktionsstatus } from '@ap/db';

import { ADMIN_NAVIGATION } from '@/components/admin/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusWechsel } from '@/components/admin/StatusWechsel';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Katalog verwalten' };
export const dynamic = 'force-dynamic';

const STATUS = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;

const STATUS_LABELS: Record<(typeof STATUS)[number], string> = {
  DRAFT: 'Entwurf',
  IN_REVIEW: 'Zur Prüfung',
  PUBLISHED: 'Veröffentlicht',
  ARCHIVED: 'Zurückgezogen',
};

const STATUS_TON: Record<(typeof STATUS)[number], 'neutral' | 'accent' | 'positive' | 'caution'> = {
  DRAFT: 'neutral',
  IN_REVIEW: 'accent',
  PUBLISHED: 'positive',
  ARCHIVED: 'caution',
};

/**
 * Der Redaktionsarbeitsplatz.
 *
 * Hier wird der Katalog tatsaechlich verwaltet: Was ist Entwurf, was wartet
 * auf Freigabe, was ist draussen. Der Ablauf ist derselbe wie in der
 * Domaenenschicht -- DRAFT, IN_REVIEW, PUBLISHED, ARCHIVED -- und
 * Zurueckziehen loescht nichts, sondern nimmt die Sichtbarkeit.
 *
 * Die Quellenzahl steht bei jedem Eintrag, weil sie darueber entscheidet, ob
 * er sich veroeffentlichen laesst. Sie erst beim Fehlversuch zu erfahren
 * waere unnoetig.
 */
export default async function KatalogVerwaltungPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getCurrentSession();
  if (!session || !can(session.principal.role, Permission.CATALOG_WRITE)) notFound();

  const params = await searchParams;
  const roh = params.status;
  const gewaehlt = (Array.isArray(roh) ? roh[0] : roh) ?? 'IN_REVIEW';
  const status = (STATUS as readonly string[]).includes(gewaehlt)
    ? (gewaehlt as (typeof STATUS)[number])
    : 'IN_REVIEW';

  const [eintraege, zahlen] = await Promise.all([
    ladeRedaktionsliste(status),
    zaehleRedaktionsstatus(),
  ]);

  const darfFreigeben = can(session.principal.role, Permission.CATALOG_PUBLISH);

  return (
    <DashboardShell
      title="Katalog verwalten"
      description="Entwürfe prüfen, freigeben und zurückziehen. Zurückziehen löscht nichts — es nimmt die Sichtbarkeit."
      navigation={ADMIN_NAVIGATION}
    >
      <nav aria-label="Status" className="mb-6 flex flex-wrap gap-1.5">
        {STATUS.map((eintrag) => (
          <Link
            key={eintrag}
            href={`/admin/katalog?status=${eintrag}`}
            aria-current={eintrag === status ? 'page' : undefined}
            className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
              eintrag === status
                ? 'border-accent bg-accent/10 text-accent-strong'
                : 'border-line text-ink-muted hover:border-line-interactive hover:text-ink'
            }`}
          >
            {STATUS_LABELS[eintrag]}
            <span className="font-mono text-xs tabular-nums text-ink-subtle">
              {zahlen[eintrag]}
            </span>
          </Link>
        ))}
      </nav>

      {!darfFreigeben ? (
        <Card className="mb-6">
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Sie können Einträge erfassen und zur Prüfung einreichen. Das Freigeben und
              Zurückziehen bleibt der Freigabeberechtigung vorbehalten — die Schaltflächen
              dafür lässt der Server nicht zu.
            </p>
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader
          title={`${STATUS_LABELS[status]} (${eintraege.length})`}
          description={
            status === 'IN_REVIEW'
              ? 'Ohne mindestens eine Quelle lässt sich nichts veröffentlichen. Die Zahl steht bei jedem Eintrag.'
              : undefined
          }
        />
        <CardBody className="p-0">
          {eintraege.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">
              Hier steht nichts. {status === 'DRAFT' ? 'Neue Einträge entstehen über die Import-Pipeline oder die Katalog-API.' : ''}
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {eintraege.map((eintrag) => {
                const guete = eintrag.dataQuality
                  ? DATA_QUALITY_LABELS[eintrag.dataQuality as DataQuality]
                  : null;
                return (
                  <li
                    key={`${eintrag.subject}-${eintrag.id}`}
                    className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs uppercase tracking-wide text-ink-subtle">
                          {eintrag.subjectLabel}
                        </span>
                        <Badge tone={STATUS_TON[status]}>{STATUS_LABELS[status]}</Badge>
                        {guete ? (
                          <Badge tone={guete.tone} title={guete.explanation}>
                            {guete.mark} {guete.label}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {eintrag.kontext ? (
                          <Link
                            href={eintrag.kontext}
                            className="hover:text-accent hover:underline"
                          >
                            {eintrag.bezeichnung}
                          </Link>
                        ) : (
                          eintrag.bezeichnung
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-subtle">
                        {eintrag.quellen === 0 ? (
                          <span className="text-caution">Keine Quelle erfasst</span>
                        ) : (
                          `${eintrag.quellen} ${eintrag.quellen === 1 ? 'Quelle' : 'Quellen'}`
                        )}
                        {' · zuletzt geändert '}
                        {eintrag.updatedAt.toLocaleDateString('de-DE')}
                      </p>
                    </div>

                    <StatusWechsel
                      subject={eintrag.subject}
                      id={eintrag.id}
                      status={status}
                      quellen={eintrag.quellen}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

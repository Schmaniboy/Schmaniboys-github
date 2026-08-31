import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Permission, can, systemClock } from '@ap/core';
import { platformOverview, securityEvents } from '@ap/db';

import { ADMIN_NAVIGATION } from '@/components/admin/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Verwaltung' };
export const dynamic = 'force-dynamic';

/**
 * Uebersicht der Verwaltung.
 *
 * Wer kein Recht hat, bekommt 404 -- nicht 403 und keine Anmeldeaufforderung.
 * Dass es einen Adminbereich gibt, muss niemand erfahren, der ihn nicht
 * betreten darf.
 */
export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session || !can(session.principal.role, Permission.ADMIN_USERS)) notFound();

  const jetzt = systemClock.now();
  const [zahlen, ereignisse] = await Promise.all([
    platformOverview(jetzt),
    securityEvents(new Date(jetzt.getTime() - 7 * 24 * 60 * 60 * 1000)),
  ]);

  const kacheln: { label: string; wert: number }[] = [
    { label: 'Personen', wert: zahlen.personen },
    { label: 'Gesperrte Konten', wert: zahlen.gesperrte },
    { label: 'Freigeschaltete Betriebe', wert: zahlen.haendler },
    { label: 'Anzeigen online', wert: zahlen.anzeigenAktiv },
    { label: 'Anzeigen insgesamt', wert: zahlen.anzeigenGesamt },
    { label: 'Gespräche', wert: zahlen.gespraeche },
    { label: 'Nachrichten (24 h)', wert: zahlen.nachrichten24h },
    { label: 'Rechnungen', wert: zahlen.rechnungen },
    { label: 'KI-Aufrufe', wert: zahlen.kiAufrufe },
  ];

  return (
    <DashboardShell
      title="Verwaltung"
      description="Zahlen der Plattform und sicherheitsrelevante Ereignisse."
      navigation={ADMIN_NAVIGATION}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kacheln.map((kachel) => (
          <div key={kachel.label} className="rounded-md border border-line/60 bg-surface-2 p-4">
            <p className="text-xs uppercase tracking-wide text-ink-subtle">{kachel.label}</p>
            <p className="tabular mt-1 text-2xl font-semibold text-ink">
              {kachel.wert.toLocaleString('de-DE')}
            </p>
          </div>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Sicherheitsrelevante Ereignisse"
          eyebrow="Letzte sieben Tage"
          action={
            <Link href="/admin/protokoll" className="text-sm text-ink-muted underline-offset-4 hover:underline">
              Ganzes Protokoll
            </Link>
          }
        />
        <CardBody>
          {ereignisse.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Keine Einträge in den letzten sieben Tagen. Ausgewählt werden fehlgeschlagene
              Anmeldungen, Rollenvergaben, Sperrungen, gescheiterte Zahlungen,
              Guthabenkorrekturen und Moderationsmaßnahmen — nicht alles, sonst fiele das
              Wesentliche nicht mehr auf.
            </p>
          ) : (
            <ul className="divide-y divide-line/40 text-sm">
              {ereignisse.slice(0, 30).map((ereignis) => (
                <li key={ereignis.id} className="flex flex-wrap items-baseline gap-x-4 py-2">
                  <span className="tabular text-xs text-ink-subtle">
                    {ereignis.createdAt.toLocaleString('de-DE')}
                  </span>
                  <span className="font-mono text-xs text-accent">{ereignis.action}</span>
                  <span className="text-ink-muted">
                    {ereignis.actor?.displayName ?? 'System'}
                    {ereignis.subjectType ? ` · ${ereignis.subjectType}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

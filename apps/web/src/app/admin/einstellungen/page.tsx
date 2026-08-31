import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Permission, can } from '@ap/core';

import { ADMIN_NAVIGATION } from '@/components/admin/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentSession } from '@/lib/session';
import { env, s3Eingerichtet, fehlendeS3Angaben } from '@/lib/env';

export const metadata: Metadata = { title: 'Einstellungen' };
export const dynamic = 'force-dynamic';

function StatusPunkt({ aktiv }: { aktiv: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        aktiv ? 'bg-positive' : 'bg-ink-subtle/40'
      }`}
      aria-label={aktiv ? 'eingerichtet' : 'nicht eingerichtet'}
    />
  );
}

interface DienstAnzeige {
  name: string;
  aktiv: boolean;
  hinweis: string;
}

export default async function EinstellungenPage() {
  const session = await getCurrentSession();
  if (!session || !can(session.principal.role, Permission.ADMIN_USERS)) notFound();

  const dienste: DienstAnzeige[] = [
    {
      name: 'Zahlungen (Mollie)',
      aktiv: Boolean(env.MOLLIE_API_KEY),
      hinweis: env.MOLLIE_API_KEY
        ? env.MOLLIE_API_KEY.startsWith('test_')
          ? 'Testmodus — kein echtes Geld.'
          : 'Echtbetrieb.'
        : 'MOLLIE_API_KEY nicht gesetzt. Zahlungen sind deaktiviert.',
    },
    {
      name: 'E-Mail-Versand (SMTP)',
      aktiv: Boolean(env.SMTP_HOST && env.SMTP_FROM),
      hinweis:
        env.SMTP_HOST && env.SMTP_FROM
          ? `Über ${env.SMTP_HOST}:${env.SMTP_PORT}.`
          : env.MAIL_TO_CONSOLE
            ? 'Konsolenausgabe statt Versand (Entwicklung).'
            : 'SMTP nicht eingerichtet. Keine E-Mails.',
    },
    {
      name: 'Bildspeicher (S3)',
      aktiv: s3Eingerichtet,
      hinweis: s3Eingerichtet
        ? `Bucket: ${env.S3_BUCKET}, Region: ${env.S3_REGION}.`
        : fehlendeS3Angaben().length > 0
          ? `Fehlend: ${fehlendeS3Angaben().join(', ')}. Bilder landen im Dateisystem.`
          : 'Bilder landen im lokalen Dateisystem.',
    },
    {
      name: 'KI-Funktionen',
      aktiv: Boolean(env.ANTHROPIC_API_KEY),
      hinweis: env.ANTHROPIC_API_KEY
        ? 'Anthropic-Schlüssel hinterlegt.'
        : 'ANTHROPIC_API_KEY nicht gesetzt. KI-Funktionen sind deaktiviert.',
    },
    {
      name: 'IP-Hashing (Datenschutz)',
      aktiv: env.IP_HASH_SECRET.length >= 16,
      hinweis:
        env.IP_HASH_SECRET.length >= 16
          ? 'Geheimnis gesetzt.'
          : 'IP_HASH_SECRET zu kurz oder leer. In Produktion Pflicht.',
    },
    {
      name: 'Suchmaschinen-Indexierung',
      aktiv: env.SUCHMASCHINEN_INDEXIEREN,
      hinweis: env.SUCHMASCHINEN_INDEXIEREN
        ? 'Indexierung erlaubt.'
        : 'robots.txt sperrt Suchmaschinen.',
    },
  ];

  const steuersatz = env.TAX_RATE_BASIS_POINTS / 100;

  return (
    <DashboardShell
      title="Einstellungen"
      description="Übersicht der Plattform-Konfiguration. Werte stammen aus Umgebungsvariablen und lassen sich nur dort ändern."
      navigation={ADMIN_NAVIGATION}
    >
      <Card>
        <CardHeader title="Umgebung" />
        <CardBody className="space-y-1 text-sm">
          <p>
            <span className="text-ink-subtle">Modus:</span>{' '}
            <span className="font-semibold text-ink">{env.NODE_ENV}</span>
          </p>
          <p>
            <span className="text-ink-subtle">App-URL:</span>{' '}
            <span className="font-mono text-ink">{env.APP_URL}</span>
          </p>
          <p>
            <span className="text-ink-subtle">Steuersatz:</span>{' '}
            <span className="font-semibold text-ink">
              {steuersatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} %
            </span>
          </p>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Dienste"
          description="Grüner Punkt = eingerichtet. Konfiguration erfolgt über Umgebungsvariablen."
        />
        <CardBody className="p-0">
          <ul className="divide-y divide-line">
            {dienste.map((dienst) => (
              <li key={dienst.name} className="flex items-start gap-3 px-5 py-4">
                <StatusPunkt aktiv={dienst.aktiv} />
                <div>
                  <p className="text-sm font-semibold text-ink">{dienst.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{dienst.hinweis}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

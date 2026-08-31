import Image from 'next/image';
import Link from 'next/link';

import { LinkButton } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { env } from '@/lib/env';

const BEREICHE = [
  {
    titel: 'Fahrzeugwissen',
    text: 'Marken, Modelle, Generationen und Facelifts bis hinunter zum einzelnen Motorcode — jede Angabe mit Quelle und Gütekennzeichen.',
    href: '/katalog',
    aktion: 'Katalog öffnen',
  },
  {
    titel: 'Suchen und vergleichen',
    text: '„BMW 320d G20", „DBKA" oder „Golf 7 Panorama" — die Suche liest Motorcodes, Baureihen und Bestellnummern. Bis zu vier Varianten nebeneinander.',
    href: '/suche',
    aktion: 'Zur Suche',
  },
  {
    titel: 'Ausstattung prüfen',
    text: 'Was war Serie, was kostete Aufpreis, was gab es nur im Paket? Abhaken, was am Fahrzeug verbaut ist, und den Ausstattungsgrad sehen.',
    href: '/katalog',
    aktion: 'Baureihe wählen',
  },
  {
    titel: 'Verkaufen ohne Ratespiel',
    text: 'Fahrzeugdaten strukturiert erfassen, Anzeige daraus erzeugen, Wert einordnen — ohne erfundene Beträge.',
    href: '/verkaufen',
    aktion: 'Anzeige erstellen',
  },
  {
    titel: 'Marktplatz',
    text: 'Fahrzeuganzeigen durchsuchen, vergleichen und direkt über die Plattform Kontakt aufnehmen — ohne externe Portale.',
    href: '/marktplatz',
    aktion: 'Zum Marktplatz',
  },
  {
    titel: 'Schlüsselnummern',
    text: 'HSN und TSN aus der Zulassungsbescheinigung nachschlagen. Was nicht erfasst ist, wird auch nicht geraten.',
    href: '/katalog/hsn-tsn',
    aktion: 'HSN/TSN öffnen',
  },
];

export default function HomePage() {
  const basis = env.APP_URL.replace(/\/$/, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CARONEX',
    url: basis,
    description:
      'Belegtes Fahrzeugwissen zu Modellen, Generationen, Motoren und Ausstattung — und ein Weg, ein Fahrzeug ohne Ratespiel zu verkaufen.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${basis}/suche?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-1">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,51,85,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_80%_60%,rgba(255,51,85,0.04),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-36">
          <div className="max-w-2xl">
            <Image
              src="/logo-shield.svg"
              alt=""
              width={80}
              height={86}
              className="fade-in-up mb-8 h-20 w-auto drop-shadow-[0_0_24px_rgba(255,51,85,0.25)]"
              priority
            />
            <p className="eyebrow fade-in-up fade-in-up-delay-1 mb-4">Fahrzeugwissen · Bewertung · Marktplatz</p>
            <h1 className="fade-in-up fade-in-up-delay-1 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Autokauf und Autoverkauf,
              <br />
              <span className="text-accent drop-shadow-[0_0_20px_rgba(255,51,85,0.3)]">ohne geratene Zahlen.</span>
            </h1>
            <p className="fade-in-up fade-in-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Technische Daten, Schwachstellen und Marktwerte sind nur dann etwas
              wert, wenn sie belegt sind. Was nicht belegt ist, steht hier als
              Lücke — nicht als Schätzung, die wie eine Tatsache aussieht.
            </p>
            <div className="fade-in-up fade-in-up-delay-3 mt-10 flex flex-wrap gap-4">
              <LinkButton href="/katalog" variant="primary" size="lg">Fahrzeugwissen ansehen</LinkButton>
              <LinkButton href="/verkaufen" variant="secondary" size="lg">Fahrzeug verkaufen</LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10">
          <p className="eyebrow mb-2">Was Sie hier tun können</p>
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Sechs Wege in die Daten</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BEREICHE.map((bereich, i) => (
            <Card key={bereich.titel} as="article" className="group hover:border-line-interactive hover:shadow-raised hover:-translate-y-0.5">
              <CardBody className="flex h-full flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent transition-colors group-hover:bg-accent/20">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-ink">{bereich.titel}</h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-ink-muted">{bereich.text}</p>
                <Link
                  href={bereich.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 transition-all hover:gap-2.5 hover:underline"
                >
                  {bereich.aktion} <span aria-hidden="true">→</span>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative border-t border-line bg-surface-1">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(ellipse_at_100%_0%,rgba(255,51,85,0.04),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <div className="accent-rule mb-6" />
            <p className="eyebrow mb-2">Der Unterschied</p>
            <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Lieber leer als falsch</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Es wäre einfach, diesen Katalog mit zehntausend Motorvarianten zu füllen. Die
              Bezeichnungen sind bekannt, die Muster auch — man müsste sie nur fortschreiben.
              Das Ergebnis sähe vollständig aus und wäre wertlos: Wer einen Motorcode
              nachschlägt, tut das, weil er eine verlässliche Antwort braucht.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Deshalb trägt hier jede Angabe ihr Gütekennzeichen, und jede Lücke bleibt eine
              sichtbare Lücke.{' '}
              <Link
                href="/katalog/datenbestand"
                className="text-accent underline-offset-4 transition-colors hover:text-accent-strong hover:underline"
              >
                Was erfasst ist, steht im Datenbestand
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { zahl: '25', label: 'Hersteller' },
              { zahl: '114', label: 'Modelle' },
              { zahl: '123', label: 'Generationen' },
              { zahl: '100%', label: 'Quellenbelegt' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="tabular text-3xl font-bold text-accent sm:text-4xl">{stat.zahl}</p>
                <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

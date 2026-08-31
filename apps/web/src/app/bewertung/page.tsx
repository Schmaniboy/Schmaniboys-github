import Link from 'next/link';
import type { Metadata } from 'next';

import { DEFAULT_ASSUMPTIONS, TokenCost, describeAssumptions, priceOf } from '@ap/core';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Fahrzeugbewertung',
  description:
    'Wertschätzung aus Ihren Angaben — mit ausgewiesenen Annahmen und ohne erfundene Marktwerte.',
};

/**
 * Einstieg in die Bewertung.
 *
 * Die Seite sagt vor dem ersten Klick, was herauskommt und was nicht. Das
 * ist keine Bescheidenheit, sondern die Sache selbst: Eine Wertschaetzung
 * ohne Vergleichsangebote kann keinen Marktwert nennen, und wer das erst
 * hinterher erfaehrt, fuehlt sich zu Recht getaeuscht.
 */
export default function BewertungPage() {
  const preis = priceOf(TokenCost.VALUATION);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Fahrzeugbewertung</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Was Ihr Fahrzeug wert ist, hängt an zwei Dingen: an vergleichbaren Angeboten und an
        den Merkmalen genau dieses Fahrzeugs. Das Zweite werten wir aus Ihren Angaben aus.
        Das Erste braucht eine Datenquelle — und solange keine feststeht, nennen wir keinen
        Betrag in Euro.
      </p>

      <Card className="mt-8">
        <CardHeader title="Was Sie bekommen" eyebrow="Ergebnis" />
        <CardBody>
          <ul className="space-y-3 text-sm leading-relaxed text-ink-muted">
            <li>
              <span className="font-medium text-ink">Werttreiber und wertmindernde Faktoren</span>{' '}
              — einzeln benannt, jeder mit Begründung und Gewicht. Kilometerstand gegen Alter,
              Zustand, Servicehistorie, Vorbesitzer, HU, Schäden, Unfallschaden.
            </li>
            <li>
              <span className="font-medium text-ink">Fehlende Angaben</span> — ausdrücklich
              genannt, statt stillschweigend geschätzt zu werden.
            </li>
            <li>
              <span className="font-medium text-ink">Marktwert, Inseratspreis und Spanne</span> —
              sobald Vergleichsangebote vorliegen. Der empfohlene Inseratspreis liegt über dem
              geschätzten Marktwert, weil verhandelt wird.
            </li>
          </ul>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Was Sie nicht bekommen" eyebrow="Grenzen" />
        <CardBody className="space-y-3 text-sm leading-relaxed text-ink-muted">
          <p>
            <span className="font-medium text-ink">Keinen erfundenen Marktwert.</span> Liegen zu
            einer Baureihe keine oder zu wenige Vergleichsangebote vor, bleibt das Feld leer und
            der Grund steht daneben. Eine Zahl mit einem kleinen Sternchen wäre die schlechtere
            Lösung — gelesen wird die Zahl, nicht das Sternchen.
          </p>
          <p>
            <span className="font-medium text-ink">Kein Gutachten.</span> Die Bewertung ist eine
            Schätzung auf Grundlage Ihrer Angaben. Für den Zustand haftet, wer ihn angibt.
          </p>
          <p>
            Kosten: {preis} Tokens — aber nur, wenn tatsächlich Marktdaten abgefragt werden.
            Kommt die Bewertung ohne Vergleichsangebote zurück, wird nichts abgebucht.
          </p>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Womit gerechnet wird" eyebrow="Annahmen" />
        <CardBody>
          <ul className="space-y-2 text-sm leading-relaxed text-ink-muted">
            {describeAssumptions(DEFAULT_ASSUMPTIONS).map((satz) => (
              <li key={satz}>{satz}</li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <LinkButton href="/verkaufen">Fahrzeug anlegen und bewerten</LinkButton>
        <Link href="/katalog" className="text-sm text-ink-muted underline-offset-4 hover:underline">
          Erst im Katalog nachsehen
        </Link>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink-subtle">
        Die Bewertung setzt ein bestätigtes Fahrzeug voraus. Aus der
        Fahrzeug-Identifizierungsnummer allein lassen sich Modell, Generation und Motor nicht
        ableiten — deshalb wählen Sie sie im Entwurf aus dem Katalog aus.
      </p>
    </div>
  );
}

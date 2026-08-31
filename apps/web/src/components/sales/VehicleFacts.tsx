import { formatDisplacement, formatPower } from '@ap/core';
import type { CatalogForContext } from '@ap/core/sales/field-guard';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

/**
 * Technische Daten und Ausstattung des bestaetigten Fahrzeugs.
 *
 * Diese beiden Bloecke werden NICHT von der KI geschrieben, obwohl der Plan
 * sie in einem Atemzug mit den Verkaufstexten nennt. Der Grund ist derselbe,
 * aus dem die Wissensdatenbank Belege verlangt: Ein Sprachmodell, das
 * technische Daten formuliert, kann sie auch erfinden -- und eine erfundene
 * Anhaengelast steht danach in einer Verkaufsanzeige.
 *
 * Hier steht deshalb, was im Katalog bestaetigt ist, und sonst nichts. Die
 * KI schreibt den Fliesstext drumherum.
 */

function Zeile({ bezeichnung, wert }: { bezeichnung: string; wert: string | null }) {
  if (!wert) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-line/40 py-2 last:border-0">
      <dt className="text-ink-subtle">{bezeichnung}</dt>
      <dd className="text-right text-ink">{wert}</dd>
    </div>
  );
}

export function VehicleFacts({ katalog }: { katalog: CatalogForContext }) {
  const bezeichnung = [katalog.manufacturerName, katalog.modelName, katalog.generationName]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <Card className="mt-6">
        <CardHeader
          title="Technische Daten"
          eyebrow="Aus dem Katalog"
          action={<Badge tone="neutral">bestätigt</Badge>}
        />
        <CardBody>
          <p className="mb-3 text-sm text-ink-muted">
            Diese Angaben stammen aus dem bestätigten Katalogeintrag, nicht aus der
            Texterzeugung. Was der Katalog nicht führt, steht hier nicht — und taucht
            auch in der Anzeige nicht auf.
          </p>
          <dl className="text-sm">
            <Zeile bezeichnung="Fahrzeug" wert={bezeichnung || null} />
            <Zeile bezeichnung="Generation (Code)" wert={katalog.generationCode} />
            <Zeile bezeichnung="Bauzeit" wert={katalog.buildPeriod} />
            <Zeile bezeichnung="Karosserie" wert={katalog.bodyTypeName} />
            <Zeile bezeichnung="Ausstattungslinie" wert={katalog.trimLineName} />
            <Zeile bezeichnung="Motor" wert={katalog.engineName} />
            <Zeile bezeichnung="Motorcode" wert={katalog.engineCode} />
            <Zeile bezeichnung="Kraftstoff" wert={katalog.fuelTypeLabel} />
            <Zeile bezeichnung="Hubraum" wert={formatDisplacement(katalog.displacementCcm)} />
            <Zeile bezeichnung="Leistung" wert={formatPower(katalog.powerKw)} />
            <Zeile bezeichnung="Getriebe" wert={katalog.transmissionLabel} />
            <Zeile bezeichnung="Antrieb" wert={katalog.driveTypeLabel} />
          </dl>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Ausstattung" eyebrow="Aus dem Katalog" />
        <CardBody>
          {katalog.equipmentNames.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {katalog.equipmentNames.map((name) => (
                <li
                  key={name}
                  className="rounded-md border border-line/60 bg-surface-2 px-2.5 py-1 text-sm text-ink"
                >
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-muted">
              {katalog.trimLineName
                ? 'Zu dieser Ausstattungslinie ist im Katalog noch keine Ausstattung erfasst.'
                : 'Ohne gewählte Ausstattungslinie lässt sich die Serienausstattung nicht ' +
                  'zuordnen. Eine Vermutung wäre hier wertlos — sie stünde später in der Anzeige.'}
            </p>
          )}
        </CardBody>
      </Card>
    </>
  );
}

import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { TokenCost, decodeVin, describeDecoding, priceOf } from '@ap/core';
import type { Valuation } from '@ap/core/valuation/estimate';
import {
  findDealer,
  findManufacturersByWmi,
  findOwnDraft,
  listingDraftRepository,
  walletRepository,
} from '@ap/db';

import { DetailsForm } from '@/components/sales/DetailsForm';
import { GenerateButton } from '@/components/sales/GenerateButton';
import { KopierKnopf } from '@/components/sales/KopierKnopf';
import { PublishForm } from '@/components/sales/PublishForm';
import { ValuationPanel } from '@/components/sales/ValuationPanel';
import { VehicleFacts } from '@/components/sales/VehicleFacts';
import { VehiclePicker } from '@/components/sales/VehiclePicker';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Verkaufsentwurf' };
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

function alsDatum(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

export default async function EntwurfPage({ params }: Props) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const entwurf = await findOwnDraft(id, session.principal.userId);
  if (!entwurf) notFound();

  const auswertung = entwurf.vin ? decodeVin(entwurf.vin) : null;
  const vorschlaege = auswertung ? await findManufacturersByWmi(auswertung.wmi) : [];
  const konto = await walletRepository.ensureWallet(session.principal.userId);
  const preis = priceOf(TokenCost.AI_LISTING_TEXT);
  const bewertungspreis = priceOf(TokenCost.VALUATION);
  const haendler = session.principal.dealerId
    ? await findDealer(session.principal.dealerId)
    : null;
  // Nur eine Bewertung anzeigen, die zum aktuellen Stand des Entwurfs passt.
  // Eine Zahl zu einem alten Kilometerstand waere schlimmer als keine.
  const bewertung =
    entwurf.valuedAt && entwurf.valuedAt >= entwurf.updatedAt
      ? (entwurf.valuationJson as Valuation | null)
      : null;

  const bestaetigt = entwurf.catalogConfirmedAt !== null;
  // Erst nach der Bestaetigung: Vorher gaebe es nur eine unvollstaendige
  // Zuordnung zu zeigen, und die sieht wie eine Tatsache aus.
  const katalog = bestaetigt ? await listingDraftRepository.loadCatalogContext(entwurf.id) : null;
  const hatTexte = entwurf.generatedTitle !== null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[{ href: '/verkaufen', label: 'Verkaufen' }, { label: 'Entwurf' }]}
      />

      <div className="accent-rule mb-6" />
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Verkaufsentwurf</h1>

      {auswertung ? (
        <Card className="mt-6">
          <CardHeader
            title="Was in der VIN steht"
            eyebrow="Schritt 1"
            action={<Badge tone="neutral">belegt</Badge>}
          />
          <CardBody className="space-y-2">
            <p className="font-mono text-sm text-ink">{entwurf.vin}</p>
            <p className="text-sm leading-relaxed text-ink-muted">
              {describeDecoding(auswertung)}
            </p>
            {auswertung.modelYearReliability === 'unknown' &&
            auswertung.modelYearCandidates.length > 0 ? (
              <p className="text-xs leading-relaxed text-ink-subtle">
                Der Modelljahrhinweis stammt aus Stelle 10. Diese Stelle ist nur
                in Nordamerika verbindlich belegt — bei europäischen Fahrzeugen
                ist sie üblich, aber nicht garantiert.
              </p>
            ) : null}
          </CardBody>
        </Card>
      ) : null}

      <Card className="mt-4">
        <CardHeader
          title="Fahrzeug bestätigen"
          eyebrow="Schritt 2"
          action={bestaetigt ? <Badge tone="positive">bestätigt</Badge> : undefined}
        />
        <CardBody>
          {vorschlaege.length === 0 && !bestaetigt ? (
            <p className="mb-4 rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution">
              Zu dieser Herstellerkennung ist im Katalog noch kein Hersteller
              veröffentlicht. Sobald der Katalog den Hersteller enthält, lässt
              sich das Fahrzeug hier zuordnen.
            </p>
          ) : null}

          <VehiclePicker
            draftId={entwurf.id}
            manufacturers={vorschlaege}
            vorauswahl={{
              manufacturerId: entwurf.manufacturerId,
              modelId: entwurf.modelId,
              generationId: entwurf.generationId,
              powertrainId: entwurf.powertrainId,
              trimLineId: entwurf.trimLineId,
            }}
          />
        </CardBody>
      </Card>

      {katalog ? <VehicleFacts katalog={katalog} /> : null}

      <Card className="mt-4">
        <CardHeader title="Angaben zum Fahrzeug" eyebrow="Schritt 3" />
        <CardBody className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Alles hier ist freiwillig. Was Sie leer lassen, taucht in der Anzeige
            nicht auf — weder als Angabe noch als Vermutung.
          </p>
          <DetailsForm
            draftId={entwurf.id}
            werte={{
              mileageKm: entwurf.mileageKm,
              firstRegistration: alsDatum(entwurf.firstRegistration),
              previousOwners: entwurf.previousOwners,
              huValidUntil: alsDatum(entwurf.huValidUntil),
              serviceHistory: entwurf.serviceHistory,
              condition: entwurf.condition,
              tyreCondition: entwurf.tyreCondition,
              damages: entwurf.damages,
              hadAccident: entwurf.hadAccident,
              accidentDetails: entwurf.accidentDetails,
              additionalNotes: entwurf.additionalNotes,
            }}
          />
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Was das Fahrzeug wert ist" eyebrow="Schritt 4" />
        <CardBody>
          <ValuationPanel
            draftId={entwurf.id}
            preis={bewertungspreis}
            guthaben={konto.availableTokens}
            bestaetigt={bestaetigt}
            vorhandene={bewertung}
          />
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Verkaufstexte"
          eyebrow="Schritt 5"
          action={
            <span className="tabular text-sm text-ink-muted">
              {konto.availableTokens} Tokens verfügbar
            </span>
          }
        />
        <CardBody className="space-y-4">
          {!bestaetigt ? (
            <p className="text-sm text-ink-muted">
              Bitte zuerst das Fahrzeug bestätigen. Ohne bestätigte Zuordnung
              entstünde ein Text über ein geratenes Fahrzeug.
            </p>
          ) : (
            <GenerateButton draftId={entwurf.id} preis={preis} />
          )}

          {hatTexte ? (
            <div className="space-y-4 border-t border-line pt-4">
              {/*
                * Jeder Textbaustein einzeln kopierbar. Wer seine Anzeige auf
                * einem anderen Portal einstellt, braucht genau einen davon --
                * und nicht alles zusammen in einem Block.
                */}
              <TextBaustein
                id="erzeugt-titel"
                ueberschrift="Titel"
                text={entwurf.generatedTitle}
                hervorgehoben
              />
              <TextBaustein
                id="erzeugt-kurz"
                ueberschrift="Kurzbeschreibung"
                text={entwurf.generatedShortText}
              />
              <TextBaustein
                id="erzeugt-lang"
                ueberschrift="Ausführliche Beschreibung"
                text={entwurf.generatedLongText}
              />
              <TextBaustein
                id="erzeugt-kleinanzeigen"
                ueberschrift="Fassung für Kleinanzeigen"
                text={entwurf.generatedClassifiedText}
              />
              <p className="text-xs text-ink-subtle">
                Erstellt am {entwurf.generatedAt?.toLocaleDateString('de-DE')}
                {entwurf.generationModel ? ` · Modell ${entwurf.generationModel}` : ''}. Bitte
                vor der Veröffentlichung prüfen — Sie verantworten die Angaben in
                Ihrer Anzeige.
              </p>
            </div>
          ) : null}
        </CardBody>
      </Card>
      <Card className="mt-4">
        <CardHeader title="Anzeige aufgeben" eyebrow="Schritt 6" />
        <CardBody>
          {bestaetigt ? (
            <PublishForm
              draftId={entwurf.id}
              haendler={haendler ? { id: haendler.id, name: haendler.name } : null}
              vorschlag={{
                title: entwurf.generatedTitle ?? '',
                description: entwurf.generatedLongText ?? '',
              }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-ink-muted">
              Bitte zuerst das Fahrzeug bestätigen. Eine Anzeige über ein geratenes
              Fahrzeug wäre für Kaufinteressenten wertlos.
            </p>
          )}
        </CardBody>
      </Card>

    </div>
  );
}

/**
 * Ein erzeugter Textbaustein mit Kopierknopf.
 *
 * Ohne Text erscheint gar nichts -- eine leere Ueberschrift mit einem
 * Kopierknopf daneben, der nichts kopiert, waere eine Attrappe.
 */
function TextBaustein({
  id,
  ueberschrift,
  text,
  hervorgehoben,
}: {
  id: string;
  ueberschrift: string;
  text: string | null;
  hervorgehoben?: boolean;
}) {
  if (!text) return null;
  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <p className="eyebrow">{ueberschrift}</p>
        <KopierKnopf text={text} bezeichnung={ueberschrift} zielId={id} />
      </div>
      <p
        id={id}
        className={
          hervorgehoben
            ? 'text-sm text-ink'
            : 'whitespace-pre-line text-sm leading-relaxed text-ink-muted'
        }
      >
        {text}
      </p>
    </div>
  );
}

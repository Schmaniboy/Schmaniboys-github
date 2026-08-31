import { decodeVin, describeDecoding, vinInput } from '@ap/core';
import { createListingDraft, findManufacturersByWmi, listOwnDrafts } from '@ap/db';

import { created, ok, route } from '@/lib/api';
import { hashVin } from '@/lib/hash';

/**
 * Verkaufsentwuerfe.
 *
 * POST legt aus einer VIN einen Entwurf an und liefert zurueck, was sich aus
 * der Nummer BELEGEN laesst -- Herstellerkennung, Herkunft, Modelljahrhinweis.
 * Modell, Generation und Motor sind ausdruecklich nicht dabei: Sie stehen
 * nicht in der VIN. Die Antwort sagt das auch so.
 */

export const POST = route(
  async (context) => {
    const { vin } = await context.body(vinInput);
    const auswertung = decodeVin(vin);
    const entwurf = await createListingDraft({
      ownerId: context.userId(),
      vin,
      vinHash: hashVin(vin),
    });

    // Nur Hersteller, deren Kennung tatsaechlich zur VIN passt. Das ist der
    // einzige belegbare Teil der Fahrzeugbestimmung.
    const vorschlaege = await findManufacturersByWmi(auswertung.wmi);

    return created({
      draft: entwurf,
      decoding: {
        wmi: auswertung.wmi,
        region: auswertung.region,
        checkDigit: auswertung.checkDigit,
        modelYearCandidates: auswertung.modelYearCandidates,
        modelYearReliability: auswertung.modelYearReliability,
        summary: describeDecoding(auswertung),
      },
      manufacturerSuggestions: vorschlaege,
      /*
       * Ausdruecklich in der Antwort, nicht nur in der Oberflaeche: Wer diese
       * Schnittstelle nutzt, soll die Grenze kennen.
       */
      notice:
        'Aus der Fahrzeug-Identifizierungsnummer sind nur Hersteller, Herkunft und ' +
        'ein Hinweis auf das Modelljahr ableitbar. Modell, Generation, Motor und ' +
        'Ausstattung müssen aus dem Katalog ausgewählt und bestätigt werden.',
    });
  },
  {
    auth: 'required',
    // Die VIN-Auswertung ist billig, das Anlegen von Entwuerfen soll trotzdem
    // nicht automatisiert missbraucht werden.
    rateLimit: { limit: 30, windowSeconds: 3600, scope: 'verkaufen:entwurf', perUser: true },
  },
);

export const GET = route(
  async (context) => ok({ drafts: await listOwnDrafts(context.userId()) }),
  { auth: 'required' },
);

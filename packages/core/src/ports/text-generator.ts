import { AppError, ErrorCode } from '../errors';
import type { AiListingContext } from '../sales/field-guard';

/**
 * Texterzeugung als austauschbare Schnittstelle.
 *
 * Die Domaenenschicht kennt keinen Anbieter. Sie weiss nur, dass es etwas
 * gibt, das aus einem geprueften Kontext vier Texte macht. Der konkrete
 * Anbieter wird in der Anwendungsschicht eingehaengt.
 *
 * Das ist nicht nur Ordnungsliebe: Solange kein Zugang eingerichtet ist,
 * laeuft die Plattform mit einer Implementierung, die ehrlich meldet, dass
 * die Funktion nicht verfuegbar ist. Der ganze Ablauf davor -- VIN, Auswahl,
 * Angaben, Guthabenpruefung -- ist dadurch trotzdem baubar und pruefbar.
 */

export interface GeneratedListing {
  /** Verkaufstitel, kurz und ohne Ausrufezeichen. */
  title: string;
  /** Zwei bis drei Saetze fuer Trefferlisten. */
  shortText: string;
  /** Ausfuehrlicher Verkaeufertext aus Sicht der verkaufenden Person. */
  longText: string;
  /** Gekuerzte Fassung fuer Kleinanzeigenportale. */
  classifiedText: string;
  /** Welches Modell den Text erzeugt hat. */
  model: string;
}

export interface TextGenerator {
  generateListing(context: AiListingContext): Promise<GeneratedListing>;
  /** Ob der Dienst nutzbar ist. Wird vor der Guthabenreservierung geprueft. */
  isAvailable(): boolean;
}

/**
 * Ersatz, solange kein Zugang eingerichtet ist.
 *
 * Wirft mit einer Meldung, die den Grund nennt, statt still nichts zu tun.
 * Wichtig: Er wird geprueft, BEVOR Guthaben reserviert wird -- niemand soll
 * fuer eine Funktion zahlen, die gar nicht laufen kann.
 */
export class UnavailableTextGenerator implements TextGenerator {
  readonly #grund: string;

  constructor(grund = 'Für die Texterzeugung ist kein Zugang eingerichtet.') {
    this.#grund = grund;
  }

  isAvailable(): boolean {
    return false;
  }

  async generateListing(): Promise<GeneratedListing> {
    throw new AppError(ErrorCode.SERVICE_UNAVAILABLE, {
      message: `${this.#grund} Ihre Angaben bleiben gespeichert, es wurde kein Guthaben verbraucht.`,
    });
  }
}

/** Attrappe fuer Tests und fuer die Erprobung ohne externen Aufruf. */
export class StubTextGenerator implements TextGenerator {
  readonly aufrufe: AiListingContext[] = [];

  isAvailable(): boolean {
    return true;
  }

  async generateListing(context: AiListingContext): Promise<GeneratedListing> {
    this.aufrufe.push(context);

    const bezeichnung = `${context.vehicle.manufacturer} ${context.vehicle.model}`;
    const laufleistung = context.vehicleFacts.mileageKm
      ? ` mit ${context.vehicleFacts.mileageKm.toLocaleString('de-DE')} Kilometern`
      : '';

    /*
     * Die Texte sind absichtlich lang genug, um die Laengenpruefung zu
     * bestehen. Eine Attrappe, die an der eigenen Pruefung scheitert, testet
     * nur die Pruefung -- nicht den Ablauf.
     */
    return {
      title: `${bezeichnung} ${context.vehicle.generation}`,
      shortText:
        `${bezeichnung}${laufleistung}. Die Angaben stammen aus dem bestätigten ` +
        'Fahrzeugeintrag und den Angaben der verkaufenden Person.',
      longText:
        `Ich biete hier meinen ${bezeichnung}${laufleistung}. ` +
        'Dieser Text stammt aus einer Attrappe und dient ausschließlich dazu, ' +
        'den Ablauf ohne externen Aufruf zu prüfen. Er enthält keine Angaben, ' +
        'die nicht im übergebenen Kontext stehen.',
      classifiedText:
        `${bezeichnung}${laufleistung} zu verkaufen. Weitere Angaben stehen in ` +
        'der vollständigen Anzeige.',
      model: 'stub',
    };
  }
}

import 'server-only';

import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
/*
 * Bewusst `zod/v4`: Der Zod-Helfer des SDK erwartet die vierte Fassung des
 * Schemas. Das Projekt nutzt sonst durchgaengig die dritte -- beide liegen im
 * selben Paket, und die Vermischung bleibt auf diese eine Datei beschraenkt.
 */
import { z } from 'zod/v4';

import {
  AppError,
  ErrorCode,
  SYSTEM_PROMPT,
  buildUserMessage,
  type AiListingContext,
  type GeneratedListing,
  type TextGenerator,
} from '@ap/core';

import { env } from '../env';

/**
 * Texterzeugung ueber die Claude API.
 *
 * `server-only` ganz oben ist kein Zierrat: Es laesst den Build scheitern,
 * falls diese Datei je aus einer Client-Komponente heraus eingebunden wird.
 * Der Schluessel darf unter keinen Umstaenden in ein Browser-Bundle geraten.
 * Aus demselben Grund heisst die Variable ANTHROPIC_API_KEY und nicht
 * NEXT_PUBLIC_ANTHROPIC_API_KEY -- der Praefix wuerde sie ausliefern.
 */

const MODELL = 'claude-opus-5';

/**
 * Die Antwortform. Ueber strukturierte Ausgabe erzwungen statt aus Fliesstext
 * geparst -- vier Felder aus einer Antwort zu schneiden ist eine Fehlerquelle,
 * die es nicht braucht.
 */
const antwortSchema = z.object({
  title: z.string().describe('Verkaufstitel, kurz, ohne Ausrufezeichen'),
  shortText: z.string().describe('Zwei bis drei Saetze fuer Trefferlisten'),
  longText: z
    .string()
    .describe('Ausfuehrlicher Verkaeufertext in der ersten Person Singular'),
  classifiedText: z.string().describe('Gekuerzte Fassung fuer Kleinanzeigenportale'),
});

/** Ein KI-Aufruf darf den Request nicht unbegrenzt aufhalten. */
const TIMEOUT_MS = 120_000;

export class AnthropicTextGenerator implements TextGenerator {
  readonly #client: Anthropic | null;

  constructor(apiKey: string | undefined = env.ANTHROPIC_API_KEY) {
    // Ohne Schluessel wird gar kein Client gebaut -- so kann auch kein
    // versehentlicher Aufruf entstehen.
    this.#client = apiKey ? new Anthropic({ apiKey, timeout: TIMEOUT_MS }) : null;
  }

  isAvailable(): boolean {
    return this.#client !== null;
  }

  async generateListing(context: AiListingContext): Promise<GeneratedListing> {
    const client = this.#client;
    if (!client) {
      throw new AppError(ErrorCode.SERVICE_UNAVAILABLE, {
        message: 'Für die Texterzeugung ist kein Zugang eingerichtet.',
      });
    }

    try {
      /*
       * `parse` statt `create`: Es prueft die Antwort gegen das Schema und
       * liefert `parsed_output`. Vier Felder aus Fliesstext zu schneiden waere
       * eine Fehlerquelle, die es nicht braucht.
       */
      const antwort = await client.messages.parse({
        model: MODELL,
        max_tokens: 16_000,
        system: SYSTEM_PROMPT,
        thinking: { type: 'adaptive' },
        output_config: {
          // Eine Verkaufsanzeige ist keine schwere Denkaufgabe; mittlerer
          // Aufwand liefert hier dieselbe Qualitaet zu geringeren Kosten.
          effort: 'medium',
          format: zodOutputFormat(antwortSchema),
        },
        messages: [{ role: 'user', content: buildUserMessage(context) }],
      });

      const geparst = antwort.parsed_output;
      if (!geparst) {
        throw new AppError(ErrorCode.INTERNAL, {
          internal: `Antwort ohne verwertbare Struktur (stop_reason: ${antwort.stop_reason})`,
        });
      }

      return { ...geparst, model: MODELL };
    } catch (fehler) {
      throw uebersetzeFehler(fehler);
    }
  }
}

/**
 * Uebersetzt Fehler der Claude API in die Fehlertaxonomie der Plattform.
 *
 * Wichtig fuer die Abrechnung: Jeder dieser Fehler fuehrt dazu, dass die
 * Guthabenreservierung freigegeben wird -- ein gescheiterter Aufruf kostet
 * nichts. Die Unterscheidung dient der Meldung an die verkaufende Person,
 * nicht der Buchung.
 */
function uebersetzeFehler(fehler: unknown): AppError {
  if (fehler instanceof AppError) return fehler;

  if (fehler instanceof Anthropic.RateLimitError) {
    return new AppError(ErrorCode.SERVICE_UNAVAILABLE, {
      message:
        'Die Texterzeugung ist gerade überlastet. Bitte in einigen Minuten erneut versuchen. ' +
        'Es wurde kein Guthaben verbraucht.',
      cause: fehler,
    });
  }

  if (fehler instanceof Anthropic.AuthenticationError) {
    // Ein Konfigurationsfehler auf unserer Seite. Der Nutzer kann nichts tun,
    // und die Ursache gehoert nicht in die Antwort.
    return new AppError(ErrorCode.SERVICE_UNAVAILABLE, {
      message: 'Die Texterzeugung ist derzeit nicht verfügbar.',
      internal: 'Anthropic: Authentifizierung fehlgeschlagen',
      cause: fehler,
    });
  }

  if (fehler instanceof Anthropic.BadRequestError) {
    return new AppError(ErrorCode.INTERNAL, {
      internal: `Anthropic: ungueltige Anfrage - ${fehler.message}`,
      cause: fehler,
    });
  }

  if (fehler instanceof Anthropic.APIConnectionError) {
    return new AppError(ErrorCode.SERVICE_UNAVAILABLE, {
      message:
        'Die Texterzeugung war nicht erreichbar. Bitte später erneut versuchen. ' +
        'Es wurde kein Guthaben verbraucht.',
      cause: fehler,
    });
  }

  if (fehler instanceof Anthropic.APIError) {
    return new AppError(ErrorCode.SERVICE_UNAVAILABLE, {
      message: 'Die Texterzeugung ist derzeit nicht verfügbar.',
      internal: `Anthropic: ${fehler.status} ${fehler.message}`,
      cause: fehler,
    });
  }

  return new AppError(ErrorCode.INTERNAL, { cause: fehler });
}

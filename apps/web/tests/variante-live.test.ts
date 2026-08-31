import { prisma } from '@ap/db';
import { describe, expect, it } from 'vitest';

/**
 * Die Seite einer einzelnen Motorvariante.
 *
 * Geprueft wird vor allem die Adresse: Wer die Kennung einer Variante kennt,
 * darf sie nicht unter einem beliebigen Modell aufrufen koennen. Sonst gaebe
 * es beliebig viele Adressen fuer denselben Inhalt -- schlecht fuer
 * Suchmaschinen und irrefuehrend fuer Leser.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

suite('Seite einer Motorvariante', () => {
  it('zeigt eine veroeffentlichte Variante unter ihrer eigenen Adresse', async (ctx) => {
    const variante = await prisma.powertrainCombination.findFirst({
      where: {
        status: 'PUBLISHED',
        generation: {
          status: 'PUBLISHED',
          model: { status: 'PUBLISHED', manufacturer: { status: 'PUBLISHED' } },
        },
      },
      select: {
        id: true,
        engine: { select: { name: true } },
        generation: {
          select: {
            slug: true,
            model: { select: { slug: true, manufacturer: { select: { slug: true } } } },
          },
        },
      },
    });

    if (!variante) {
      /*
       * Kein "expect(true).toBe(true)": Ein Test, der ohne Voraussetzung gruen
       * meldet, behauptet etwas geprueft zu haben. Uebersprungen ist ehrlich.
       */
      ctx.skip();
      return;
    }

    const marke = variante.generation.model.manufacturer.slug;
    const modell = variante.generation.model.slug;
    const generation = variante.generation.slug;

    const richtig = await fetch(
      `${BASE_URL}/katalog/${marke}/${modell}/${generation}/motor/${variante.id}`,
    );
    expect(richtig.status).toBe(200);
    expect(await richtig.text()).toContain(variante.engine.name);

    // Dieselbe Kennung unter einem falschen Modell darf es nicht geben.
    const falsch = await fetch(
      `${BASE_URL}/katalog/${marke}/gibt-es-nicht/${generation}/motor/${variante.id}`,
    );
    expect(falsch.status).toBe(404);

    const falscheMarke = await fetch(
      `${BASE_URL}/katalog/andere-marke/${modell}/${generation}/motor/${variante.id}`,
    );
    expect(falscheMarke.status).toBe(404);
  });

  it('zeigt eine unbekannte Kennung als nicht gefunden', async () => {
    const antwort = await fetch(
      `${BASE_URL}/katalog/musterfahrzeug-demodaten/muster-300/zweite-generation/motor/gibtsnicht`,
    );
    expect(antwort.status).toBe(404);
  });

  it('zeigt einen unveroeffentlichten Eintrag nicht', async (ctx) => {
    const entwurf = await prisma.powertrainCombination.findFirst({
      where: { status: { not: 'PUBLISHED' } },
      select: {
        id: true,
        generation: {
          select: {
            slug: true,
            model: { select: { slug: true, manufacturer: { select: { slug: true } } } },
          },
        },
      },
    });

    if (!entwurf) {
      // Uebersprungen statt still gruen -- siehe oben.
      ctx.skip();
      return;
    }

    const marke = entwurf.generation.model.manufacturer.slug;
    const antwort = await fetch(
      `${BASE_URL}/katalog/${marke}/${entwurf.generation.model.slug}/${entwurf.generation.slug}/motor/${entwurf.id}`,
    );
    expect(antwort.status).toBe(404);
  });
});

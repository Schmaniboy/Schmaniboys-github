import { prisma } from '../client';

/**
 * Der Merkzettel mit aufgeloesten Eintraegen.
 *
 * Der polymorphe Verweis (subjectType + subjectId) ist beim Speichern
 * bequem und beim Anzeigen unbequem: Es gibt keine Beziehung, ueber die
 * Prisma mitladen koennte. Deshalb wird je Art einmal nachgeladen -- sieben
 * kleine Abfragen statt eines Verbunds ueber sieben Tabellen.
 *
 * Eintraege, deren Ziel es nicht mehr gibt oder das nicht mehr
 * veroeffentlicht ist, werden als solche zurueckgegeben und NICHT
 * stillschweigend entfernt: Wer sich etwas gemerkt hat, soll erfahren, was
 * daraus wurde.
 */

export interface MerkzettelEintrag {
  id: string;
  subjectType: string;
  subjectId: string;
  createdAt: Date;
  /** Aufgeloest, sofern der Eintrag noch sichtbar ist. */
  titel: string | null;
  untertitel: string | null;
  href: string | null;
}

const VEROEFFENTLICHT = { status: 'PUBLISHED' } as const;

export async function ladeMerkzettel(userId: string): Promise<MerkzettelEintrag[]> {
  const roh = await prisma.catalogFavorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: { id: true, subjectType: true, subjectId: true, createdAt: true },
  });

  if (roh.length === 0) return [];

  const idsVon = (art: string) =>
    roh.filter((eintrag) => eintrag.subjectType === art).map((eintrag) => eintrag.subjectId);

  const [antriebe, motoren, generationen, ausstattungen, farben, raeder, editionen] =
    await Promise.all([
      prisma.powertrainCombination.findMany({
        where: { id: { in: idsVon('PowertrainCombination') }, ...VEROEFFENTLICHT },
        select: {
          id: true,
          powerKw: true,
          engine: { select: { name: true, code: true } },
          generation: {
            select: {
              name: true,
              slug: true,
              model: {
                select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
              },
            },
          },
        },
      }),
      prisma.engine.findMany({
        where: { id: { in: idsVon('Engine') }, ...VEROEFFENTLICHT },
        select: {
          id: true,
          name: true,
          code: true,
          powerKw: true,
          manufacturer: { select: { name: true, slug: true } },
        },
      }),
      prisma.generation.findMany({
        where: { id: { in: idsVon('Generation') }, ...VEROEFFENTLICHT },
        select: {
          id: true,
          name: true,
          slug: true,
          code: true,
          model: {
            select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
          },
        },
      }),
      prisma.optionalEquipment.findMany({
        where: { id: { in: idsVon('OptionalEquipment') }, ...VEROEFFENTLICHT },
        select: {
          id: true,
          name: true,
          optionCode: true,
          manufacturer: { select: { name: true, slug: true } },
        },
      }),
      prisma.paintColor.findMany({
        where: { id: { in: idsVon('PaintColor') }, ...VEROEFFENTLICHT },
        select: {
          id: true,
          name: true,
          code: true,
          manufacturer: { select: { name: true, slug: true } },
        },
      }),
      prisma.wheelOption.findMany({
        where: { id: { in: idsVon('WheelOption') }, ...VEROEFFENTLICHT },
        select: {
          id: true,
          name: true,
          code: true,
          manufacturer: { select: { name: true, slug: true } },
        },
      }),
      prisma.specialEdition.findMany({
        where: { id: { in: idsVon('SpecialEdition') }, ...VEROEFFENTLICHT },
        select: {
          id: true,
          name: true,
          generation: {
            select: {
              name: true,
              slug: true,
              model: {
                select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
              },
            },
          },
        },
      }),
    ]);

  const aufgeloest = new Map<string, { titel: string; untertitel: string; href: string }>();

  for (const eintrag of antriebe) {
    const kette = eintrag.generation;
    aufgeloest.set(`PowertrainCombination:${eintrag.id}`, {
      titel: `${kette.model.manufacturer.name} ${kette.model.name} ${eintrag.engine.name}`,
      untertitel: [kette.name, eintrag.engine.code, eintrag.powerKw ? `${eintrag.powerKw} kW` : null]
        .filter(Boolean)
        .join(' · '),
      href: `/katalog/${kette.model.manufacturer.slug}/${kette.model.slug}/${kette.slug}/motor/${eintrag.id}`,
    });
  }

  for (const eintrag of motoren) {
    aufgeloest.set(`Engine:${eintrag.id}`, {
      titel: `${eintrag.manufacturer.name} ${eintrag.name}`,
      untertitel: [eintrag.code, eintrag.powerKw ? `${eintrag.powerKw} kW` : null]
        .filter(Boolean)
        .join(' · '),
      href: `/suche?q=${encodeURIComponent(eintrag.code ?? eintrag.name)}`,
    });
  }

  for (const eintrag of generationen) {
    aufgeloest.set(`Generation:${eintrag.id}`, {
      titel: `${eintrag.model.manufacturer.name} ${eintrag.model.name}`,
      untertitel: [eintrag.name, eintrag.code].filter(Boolean).join(' · '),
      href: `/katalog/${eintrag.model.manufacturer.slug}/${eintrag.model.slug}/${eintrag.slug}`,
    });
  }

  for (const eintrag of ausstattungen) {
    aufgeloest.set(`OptionalEquipment:${eintrag.id}`, {
      titel: `${eintrag.manufacturer.name} ${eintrag.name}`,
      untertitel: eintrag.optionCode ?? '',
      href: `/katalog/${eintrag.manufacturer.slug}`,
    });
  }

  for (const [art, liste] of [
    ['PaintColor', farben],
    ['WheelOption', raeder],
  ] as const) {
    for (const eintrag of liste) {
      aufgeloest.set(`${art}:${eintrag.id}`, {
        titel: `${eintrag.manufacturer.name} ${eintrag.name}`,
        untertitel: eintrag.code ?? '',
        href: `/katalog/${eintrag.manufacturer.slug}`,
      });
    }
  }

  for (const eintrag of editionen) {
    const kette = eintrag.generation;
    aufgeloest.set(`SpecialEdition:${eintrag.id}`, {
      titel: `${kette.model.manufacturer.name} ${kette.model.name} ${eintrag.name}`,
      untertitel: kette.name,
      href: `/katalog/${kette.model.manufacturer.slug}/${kette.model.slug}/${kette.slug}`,
    });
  }

  return roh.map((eintrag) => {
    const ziel = aufgeloest.get(`${eintrag.subjectType}:${eintrag.subjectId}`);
    return {
      id: eintrag.id,
      subjectType: eintrag.subjectType,
      subjectId: eintrag.subjectId,
      createdAt: eintrag.createdAt,
      titel: ziel?.titel ?? null,
      untertitel: ziel?.untertitel || null,
      href: ziel?.href ?? null,
    };
  });
}

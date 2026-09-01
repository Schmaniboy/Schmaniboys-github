/**
 * Echte Hersteller-Stammdaten einspielen.
 *
 * Legt die gaengigen Automobilhersteller mit belegbaren Stammdaten an:
 * Name, Herkunftsland, WMI-Codes (VIN-Praefix) und Logo-Pfad.
 *
 * KEINE technischen Fahrzeugdaten — nur die Hersteller selbst.
 * WMI-Codes stammen aus oeffentlich dokumentierten NHTSA/ISO-Quellen.
 *
 * Aufruf: npx tsx scripts/seed-hersteller.ts
 * Entfernen: npx tsx scripts/seed-hersteller.ts --entfernen
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { prisma } from '@ap/db';

const rootEnv = resolve(process.cwd(), '.env');
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

interface HerstellerDaten {
  name: string;
  slug: string;
  country: string;
  wmiCodes: string[];
  logoUrl: string;
}

const HERSTELLER: HerstellerDaten[] = [
  {
    name: 'BMW',
    slug: 'bmw',
    country: 'Deutschland',
    wmiCodes: ['WBA', 'WBS', 'WBY', '4US'],
    logoUrl: '/logos/hersteller/bmw.svg',
  },
  {
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    country: 'Deutschland',
    wmiCodes: ['WDB', 'WDC', 'WDD', 'W1K', 'W1N'],
    logoUrl: '/logos/hersteller/mercedes-benz.svg',
  },
  {
    name: 'Audi',
    slug: 'audi',
    country: 'Deutschland',
    wmiCodes: ['WAU', 'WUA'],
    logoUrl: '/logos/hersteller/audi.svg',
  },
  {
    name: 'Volkswagen',
    slug: 'volkswagen',
    country: 'Deutschland',
    wmiCodes: ['WVW', 'WV1', 'WV2', 'WV3'],
    logoUrl: '/logos/hersteller/volkswagen.svg',
  },
  {
    name: 'Porsche',
    slug: 'porsche',
    country: 'Deutschland',
    wmiCodes: ['WP0', 'WP1'],
    logoUrl: '/logos/hersteller/porsche.svg',
  },
  {
    name: 'Opel',
    slug: 'opel',
    country: 'Deutschland',
    wmiCodes: ['W0L'],
    logoUrl: '/logos/hersteller/opel.svg',
  },
  {
    name: 'Ford',
    slug: 'ford',
    country: 'USA',
    wmiCodes: ['WF0', '1FA', '1FB', '1FC'],
    logoUrl: '/logos/hersteller/ford.svg',
  },
  {
    name: 'Toyota',
    slug: 'toyota',
    country: 'Japan',
    wmiCodes: ['JTD', 'JTE', 'JTN', 'SB1'],
    logoUrl: '/logos/hersteller/toyota.svg',
  },
  {
    name: 'Hyundai',
    slug: 'hyundai',
    country: 'Suedkorea',
    wmiCodes: ['KMH', 'TMA'],
    logoUrl: '/logos/hersteller/hyundai.svg',
  },
  {
    name: 'Kia',
    slug: 'kia',
    country: 'Suedkorea',
    wmiCodes: ['KNA', 'KNC', 'U5Y'],
    logoUrl: '/logos/hersteller/kia.svg',
  },
  {
    name: 'Nissan',
    slug: 'nissan',
    country: 'Japan',
    wmiCodes: ['JN1', 'SJN', 'VSK'],
    logoUrl: '/logos/hersteller/nissan.svg',
  },
  {
    name: 'Mazda',
    slug: 'mazda',
    country: 'Japan',
    wmiCodes: ['JMZ', 'JM7'],
    logoUrl: '/logos/hersteller/mazda.svg',
  },
  {
    name: 'Honda',
    slug: 'honda',
    country: 'Japan',
    wmiCodes: ['JHM', 'SHH'],
    logoUrl: '/logos/hersteller/honda.svg',
  },
  {
    name: 'Mitsubishi',
    slug: 'mitsubishi',
    country: 'Japan',
    wmiCodes: ['JMB', 'JMY'],
    logoUrl: '/logos/hersteller/mitsubishi.svg',
  },
  {
    name: 'Suzuki',
    slug: 'suzuki',
    country: 'Japan',
    wmiCodes: ['JSA', 'TSM'],
    logoUrl: '/logos/hersteller/suzuki.svg',
  },
  {
    name: 'Subaru',
    slug: 'subaru',
    country: 'Japan',
    wmiCodes: ['JF1', 'JF2'],
    logoUrl: '/logos/hersteller/subaru.svg',
  },
  {
    name: 'Renault',
    slug: 'renault',
    country: 'Frankreich',
    wmiCodes: ['VF1', 'VF6'],
    logoUrl: '/logos/hersteller/renault.svg',
  },
  {
    name: 'Peugeot',
    slug: 'peugeot',
    country: 'Frankreich',
    wmiCodes: ['VF3'],
    logoUrl: '/logos/hersteller/peugeot.svg',
  },
  {
    name: 'Citroën',
    slug: 'citroen',
    country: 'Frankreich',
    wmiCodes: ['VF7'],
    logoUrl: '/logos/hersteller/citroen.svg',
  },
  {
    name: 'Fiat',
    slug: 'fiat',
    country: 'Italien',
    wmiCodes: ['ZFA'],
    logoUrl: '/logos/hersteller/fiat.svg',
  },
  {
    name: 'Alfa Romeo',
    slug: 'alfa-romeo',
    country: 'Italien',
    wmiCodes: ['ZAR'],
    logoUrl: '/logos/hersteller/alfa-romeo.svg',
  },
  {
    name: 'SEAT',
    slug: 'seat',
    country: 'Spanien',
    wmiCodes: ['VSS'],
    logoUrl: '/logos/hersteller/seat.svg',
  },
  {
    name: 'CUPRA',
    slug: 'cupra',
    country: 'Spanien',
    wmiCodes: ['VS6'],
    logoUrl: '/logos/hersteller/cupra.svg',
  },
  {
    name: 'Škoda',
    slug: 'skoda',
    country: 'Tschechien',
    wmiCodes: ['TMB'],
    logoUrl: '/logos/hersteller/skoda.svg',
  },
  {
    name: 'Volvo',
    slug: 'volvo',
    country: 'Schweden',
    wmiCodes: ['YV1', 'YV4'],
    logoUrl: '/logos/hersteller/volvo.svg',
  },
  {
    name: 'Dacia',
    slug: 'dacia',
    country: 'Rumaenien',
    wmiCodes: ['UU1'],
    logoUrl: '/logos/hersteller/dacia.svg',
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    country: 'USA',
    wmiCodes: ['5YJ', '7SA'],
    logoUrl: '/logos/hersteller/tesla.svg',
  },
  {
    name: 'Land Rover',
    slug: 'land-rover',
    country: 'Vereinigtes Koenigreich',
    wmiCodes: ['SAL'],
    logoUrl: '/logos/hersteller/land-rover.svg',
  },
  {
    name: 'Jaguar',
    slug: 'jaguar',
    country: 'Vereinigtes Koenigreich',
    wmiCodes: ['SAJ'],
    logoUrl: '/logos/hersteller/jaguar.svg',
  },
  {
    name: 'MINI',
    slug: 'mini',
    country: 'Vereinigtes Koenigreich',
    wmiCodes: ['WMW'],
    logoUrl: '/logos/hersteller/mini.svg',
  },
  {
    name: 'smart',
    slug: 'smart',
    country: 'Deutschland',
    wmiCodes: ['WME'],
    logoUrl: '/logos/hersteller/smart.svg',
  },
  {
    name: 'Jeep',
    slug: 'jeep',
    country: 'USA',
    wmiCodes: ['1C4'],
    logoUrl: '/logos/hersteller/jeep.svg',
  },
];

async function entfernen(): Promise<void> {
  const slugs = HERSTELLER.map((h) => h.slug);
  const bestehende = await prisma.manufacturer.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true, _count: { select: { models: true } } },
  });

  let uebersprungen = 0;
  let entfernt = 0;

  for (const h of bestehende) {
    if (h._count.models > 0) {
      console.log(`  Uebersprungen: ${h.slug} (hat ${h._count.models} Modell(e))`);
      uebersprungen++;
      continue;
    }
    await prisma.manufacturer.delete({ where: { id: h.id } });
    entfernt++;
  }

  console.log(`${entfernt} Hersteller entfernt, ${uebersprungen} uebersprungen (mit Modellen).`);
}

async function anlegen(): Promise<void> {
  const jetzt = new Date();
  let angelegt = 0;
  let aktualisiert = 0;

  for (const daten of HERSTELLER) {
    const bestehend = await prisma.manufacturer.findUnique({
      where: { slug: daten.slug },
    });

    if (bestehend) {
      await prisma.manufacturer.update({
        where: { id: bestehend.id },
        data: {
          name: daten.name,
          country: daten.country,
          wmiCodes: daten.wmiCodes,
          logoUrl: daten.logoUrl,
        },
      });
      aktualisiert++;
    } else {
      await prisma.manufacturer.create({
        data: {
          name: daten.name,
          slug: daten.slug,
          country: daten.country,
          wmiCodes: daten.wmiCodes,
          logoUrl: daten.logoUrl,
          status: 'PUBLISHED',
          publishedAt: jetzt,
        },
      });
      angelegt++;
    }
  }

  console.log(
    `Hersteller-Stammdaten: ${angelegt} neu angelegt, ${aktualisiert} aktualisiert.`,
  );
  console.log(`Insgesamt ${HERSTELLER.length} echte Hersteller mit Logo-Pfaden.`);
}

async function main(): Promise<void> {
  try {
    if (process.argv.includes('--entfernen')) {
      await entfernen();
    } else {
      await anlegen();
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main();

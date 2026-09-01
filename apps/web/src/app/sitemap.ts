import type { MetadataRoute } from 'next';

import { systemClock } from '@ap/core';
import { listPublicSlugs } from '@ap/db';

import { env } from '@/lib/env';

/**
 * Sitemap.
 *
 * Enthaelt nur, was tatsaechlich oeffentlich sichtbar ist. Eine Sitemap mit
 * Adressen, die 404 liefern, schadet mehr als sie nuetzt -- und pausierte
 * oder verkaufte Anzeigen sind genau das.
 */
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basis = env.APP_URL.replace(/\/$/, '');

  const feste: MetadataRoute.Sitemap = [
    { url: `${basis}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${basis}/katalog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${basis}/katalog/glossar`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${basis}/katalog/datenbestand`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${basis}/katalog/vergleich`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${basis}/katalog/hsn-tsn`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${basis}/suche`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${basis}/marktplatz`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${basis}/bewertung`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${basis}/verkaufen`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${basis}/ausstattung`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${basis}/dokumente`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${basis}/dokumente/kaufvertrag`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${basis}/dokumente/uebergabeprotokoll`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${basis}/dokumente/kaeufer-checkliste`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${basis}/dokumente/fahrzeugbericht`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${basis}/impressum`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${basis}/datenschutz`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${basis}/agb`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const anzeigen = await listPublicSlugs(systemClock.now()).catch(() => []);

  return [
    ...feste,
    ...anzeigen.map((anzeige) => ({
      url: `${basis}/marktplatz/${anzeige.slug}`,
      lastModified: anzeige.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];
}

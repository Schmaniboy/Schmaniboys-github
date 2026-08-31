import type { MetadataRoute } from 'next';

import { darfIndexiertWerden, env } from '@/lib/env';

/**
 * robots.txt.
 *
 * Gesperrt, solange die Indexierung nicht ausdruecklich freigegeben ist
 * (SUCHMASCHINEN_INDEXIEREN). Ein halbfertiger Marktplatz gehoert nicht in
 * einen Index; die Adressen bleiben danach in Suchergebnissen stehen, lange
 * nachdem sie nicht mehr stimmen.
 *
 * Bewusst NICHT an NODE_ENV gehaengt: Vorschau-Umgebungen laufen ebenfalls
 * mit NODE_ENV=production. Die Freigabe ist eine Entscheidung, kein
 * Nebeneffekt. Das Wurzel-Layout liest denselben Wert -- zwei Stellen mit
 * verschiedener Antwort waeren schlimmer als eine falsche.
 */
export default function robots(): MetadataRoute.Robots {
  const basis = env.APP_URL.replace(/\/$/, '');

  if (!darfIndexiertWerden) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Angemeldete Bereiche und Schnittstellen gehoeren nicht in einen Index.
        disallow: ['/api/', '/konto/', '/haendler/', '/admin/', '/anmelden', '/registrieren'],
      },
    ],
    sitemap: `${basis}/sitemap.xml`,
  };
}

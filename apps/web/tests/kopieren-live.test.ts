import { prisma } from '@ap/db';
import { afterAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Die erzeugten Texte muessen sich kopieren lassen.
 *
 * Der letzte Schritt des Verkaufsablaufs ist, den Text auf einem anderen
 * Portal einzufuegen. Ohne Kopierknopf heisst das: mit dem Finger markieren,
 * auf dem Telefon ueber mehrere Absaetze hinweg. Genau dort bricht der
 * Ablauf ab.
 *
 * Geprueft wird, dass fuer jeden vorhandenen Textbaustein ein eigener Knopf
 * erscheint -- und dass fuer einen fehlenden Baustein keiner erscheint. Ein
 * Knopf, der nichts kopiert, ist eine Attrappe.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `kop${Date.now().toString(36)}`;

suite('Erzeugte Texte kopieren', () => {
  afterAll(async () => {
    const konten = await prisma.user.findMany({
      where: { email: { startsWith: marker } },
      select: { id: true },
    });
    const ids = konten.map((k) => k.id);
    await prisma.listingDraft.deleteMany({ where: { ownerId: { in: ids } } });
    await prisma.session.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  });

  async function entwurfMitTexten(texte: {
    generatedTitle?: string | null;
    generatedShortText?: string | null;
    generatedLongText?: string | null;
    generatedClassifiedText?: string | null;
  }) {
    const sitzung = await benutzerMitSitzung({
      email: `${marker}${Math.random().toString(36).slice(2, 8)}@example.test`,
      displayName: `Kopieren ${marker}`,
      role: 'USER',
    });
    const entwurf = await prisma.listingDraft.create({
      data: {
        ownerId: sitzung.userId,
        vin: 'WBA3A5C55DF123456',
        status: 'TEXT_GENERATED',
        generatedAt: new Date(),
        ...texte,
      },
    });
    const seite = await fetch(`${BASE_URL}/verkaufen/entwurf/${entwurf.id}`, {
      headers: { cookie: sitzung.cookie },
    });
    return { status: seite.status, html: await seite.text() };
  }

  it('gibt jedem erzeugten Textbaustein einen eigenen Kopierknopf', async () => {
    const { status, html } = await entwurfMitTexten({
      generatedTitle: 'BMW 320d Touring, gepflegt',
      generatedShortText: 'Kurzfassung für die Übersicht.',
      generatedLongText: 'Ausführlicher Text.\nMit zweiter Zeile.',
      generatedClassifiedText: 'Fassung für Kleinanzeigen.',
    });

    expect(status).toBe(200);
    for (const bezeichnung of [
      'Titel',
      'Kurzbeschreibung',
      'Ausführliche Beschreibung',
      'Fassung für Kleinanzeigen',
    ]) {
      expect(html, bezeichnung).toContain(`${bezeichnung} kopieren`);
    }
  });

  it('zeigt keinen Knopf fuer einen Baustein, den es nicht gibt', async () => {
    const { html } = await entwurfMitTexten({
      generatedTitle: 'Nur ein Titel',
      generatedShortText: null,
      generatedLongText: null,
      generatedClassifiedText: null,
    });

    expect(html).toContain('Titel kopieren');
    expect(html).not.toContain('Kurzbeschreibung kopieren');
    expect(html).not.toContain('Fassung für Kleinanzeigen kopieren');
  });

  it('zeigt den Text selbst, nicht nur den Knopf', async () => {
    const { html } = await entwurfMitTexten({
      generatedTitle: `Titelprobe ${marker}`,
      generatedClassifiedText: `Kleinanzeigenprobe ${marker}`,
    });

    expect(html).toContain(`Titelprobe ${marker}`);
    expect(html).toContain(`Kleinanzeigenprobe ${marker}`);
  });
});

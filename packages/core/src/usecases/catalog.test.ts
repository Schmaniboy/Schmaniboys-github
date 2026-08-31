import { beforeEach, describe, expect, it } from 'vitest';

import { Role } from '../auth/roles';
import { EditorialStatus } from '../catalog/publishing';
import { AppError, ErrorCode } from '../errors';
import { CatalogSubject } from '../ports/catalog-repository';
import { fixedClock } from '../ports/clock';

import { FakeCatalogRepository, RecordingAuditLogger } from './fakes';
import { type CatalogDeps, addSource, changeStatus, removeSource } from './catalog';

const JETZT = new Date('2026-05-01T10:00:00.000Z');

const redaktion = { userId: 'ed1', role: Role.EDITOR, dealerId: null };
const nutzer = { userId: 'u1', role: Role.USER, dealerId: null };
const admin = { userId: 'a1', role: Role.ADMIN, dealerId: null };

let catalog: FakeCatalogRepository;
let audit: RecordingAuditLogger;
let deps: CatalogDeps;

beforeEach(() => {
  catalog = new FakeCatalogRepository();
  audit = new RecordingAuditLogger();
  deps = { catalog, audit, clock: fixedClock(JETZT) };
});

async function codeOf(action: () => Promise<unknown>): Promise<string> {
  try {
    await action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

async function meldungVon(action: () => Promise<unknown>): Promise<string> {
  try {
    await action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.message : 'falscher Fehlertyp';
  }
}

describe('Katalog: Rechte', () => {
  beforeEach(() => {
    catalog.seed(CatalogSubject.MODEL, 'm1', EditorialStatus.DRAFT, 1);
  });

  it('laesst normale Benutzer nicht an die Stammdaten', () => {
    return expect(
      codeOf(() =>
        changeStatus(deps, nutzer, CatalogSubject.MODEL, 'm1', { status: 'IN_REVIEW' }),
      ),
    ).resolves.toBe(ErrorCode.FORBIDDEN);
  });

  it('verlangt ohne Sitzung eine Anmeldung, nicht eine Rechtemeldung', () => {
    return expect(
      codeOf(() => changeStatus(deps, null, CatalogSubject.MODEL, 'm1', { status: 'IN_REVIEW' })),
    ).resolves.toBe(ErrorCode.UNAUTHENTICATED);
  });

  it('erlaubt der Redaktion das Einreichen zur Pruefung', async () => {
    const ergebnis = await changeStatus(deps, redaktion, CatalogSubject.MODEL, 'm1', {
      status: 'IN_REVIEW',
    });
    expect(ergebnis.status).toBe(EditorialStatus.IN_REVIEW);
  });
});

describe('Katalog: Veroeffentlichen', () => {
  it('veroeffentlicht nicht ohne Quelle -- auch nicht als Administration', async () => {
    catalog.seed(CatalogSubject.GENERATION, 'g1', EditorialStatus.IN_REVIEW, 0);
    const meldung = await meldungVon(() =>
      changeStatus(deps, admin, CatalogSubject.GENERATION, 'g1', { status: 'PUBLISHED' }),
    );
    expect(meldung).toContain('Quellenangabe');
    expect(await catalog.findStatus(CatalogSubject.GENERATION, 'g1')).toBe(
      EditorialStatus.IN_REVIEW,
    );
  });

  it('veroeffentlicht mit Quelle und protokolliert es', async () => {
    catalog.seed(CatalogSubject.GENERATION, 'g1', EditorialStatus.IN_REVIEW, 2);
    const ergebnis = await changeStatus(deps, redaktion, CatalogSubject.GENERATION, 'g1', {
      status: 'PUBLISHED',
    });
    expect(ergebnis.status).toBe(EditorialStatus.PUBLISHED);
    expect(audit.actions()).toContain('catalog.published');
    expect(audit.events[0]?.metadata?.quellen).toBe(2);
  });

  it('springt nicht vom Entwurf direkt in die Veroeffentlichung', async () => {
    catalog.seed(CatalogSubject.MODEL, 'm1', EditorialStatus.DRAFT, 3);
    const meldung = await meldungVon(() =>
      changeStatus(deps, redaktion, CatalogSubject.MODEL, 'm1', { status: 'PUBLISHED' }),
    );
    expect(meldung).toContain('in Prüfung');
  });

  it('meldet einen unbekannten Eintrag als nicht gefunden', () => {
    return expect(
      codeOf(() =>
        changeStatus(deps, redaktion, CatalogSubject.MODEL, 'gibtsnicht', {
          status: 'IN_REVIEW',
        }),
      ),
    ).resolves.toBe(ErrorCode.NOT_FOUND);
  });

  it('weist einen ungueltigen Zielstatus als Validierungsfehler ab', () => {
    catalog.seed(CatalogSubject.MODEL, 'm1', EditorialStatus.DRAFT, 1);
    return expect(
      codeOf(() =>
        changeStatus(deps, redaktion, CatalogSubject.MODEL, 'm1', { status: 'IRGENDWAS' }),
      ),
    ).resolves.toBe(ErrorCode.VALIDATION_FAILED);
  });
});

describe('Katalog: Quellen', () => {
  beforeEach(() => {
    catalog.seed(CatalogSubject.ENGINE, 'e1', EditorialStatus.DRAFT, 0);
  });

  it('nimmt eine Quelle auf und setzt das Pruefdatum', async () => {
    const quelle = await addSource(deps, redaktion, CatalogSubject.ENGINE, 'e1', {
      title: 'Technische Daten, Preisliste 03/2015',
      kind: 'MANUFACTURER_DOCUMENT',
    });
    expect(quelle.title).toContain('Preisliste');
    expect(quelle.checkedAt.getTime()).toBe(JETZT.getTime());
    expect(await catalog.countSources(CatalogSubject.ENGINE, 'e1')).toBe(1);
  });

  it('nimmt keine Quelle von jemandem ohne Schreibrecht an', () => {
    return expect(
      codeOf(() =>
        addSource(deps, nutzer, CatalogSubject.ENGINE, 'e1', { title: 'Irgendetwas' }),
      ),
    ).resolves.toBe(ErrorCode.FORBIDDEN);
  });

  it('laesst die letzte Quelle eines veroeffentlichten Eintrags nicht entfernen', async () => {
    catalog.seed(CatalogSubject.ENGINE, 'e2', EditorialStatus.PUBLISHED, 1);
    const quellen = await catalog.listSources(CatalogSubject.ENGINE, 'e2');
    const meldung = await meldungVon(() =>
      removeSource(deps, redaktion, CatalogSubject.ENGINE, 'e2', quellen[0]?.id ?? ''),
    );
    expect(meldung).toContain('letzte Quelle');
    expect(await catalog.countSources(CatalogSubject.ENGINE, 'e2')).toBe(1);
  });

  it('laesst eine von mehreren Quellen entfernen', async () => {
    catalog.seed(CatalogSubject.ENGINE, 'e3', EditorialStatus.PUBLISHED, 2);
    const quellen = await catalog.listSources(CatalogSubject.ENGINE, 'e3');
    await removeSource(deps, redaktion, CatalogSubject.ENGINE, 'e3', quellen[0]?.id ?? '');
    expect(await catalog.countSources(CatalogSubject.ENGINE, 'e3')).toBe(1);
  });

  it('laesst die letzte Quelle eines Entwurfs entfernen', async () => {
    catalog.seed(CatalogSubject.ENGINE, 'e4', EditorialStatus.DRAFT, 1);
    const quellen = await catalog.listSources(CatalogSubject.ENGINE, 'e4');
    await removeSource(deps, redaktion, CatalogSubject.ENGINE, 'e4', quellen[0]?.id ?? '');
    expect(await catalog.countSources(CatalogSubject.ENGINE, 'e4')).toBe(0);
  });
});

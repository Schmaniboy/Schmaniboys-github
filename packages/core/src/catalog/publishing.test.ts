import { describe, expect, it } from 'vitest';

import { AppError } from '../errors';

import { EditorialStatus, assertTransition, isPubliclyVisible, isTransitionAllowed } from './publishing';

function fehlerText(action: () => void): string {
  try {
    action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.message : 'falscher Fehlertyp';
  }
}

describe('Redaktionsablauf', () => {
  it('zeigt oeffentlich ausschliesslich veroeffentlichte Eintraege', () => {
    expect(isPubliclyVisible(EditorialStatus.PUBLISHED)).toBe(true);
    for (const status of [
      EditorialStatus.DRAFT,
      EditorialStatus.IN_REVIEW,
      EditorialStatus.ARCHIVED,
    ]) {
      expect(isPubliclyVisible(status)).toBe(false);
    }
  });

  it('laesst keinen direkten Weg vom Entwurf zur Veroeffentlichung', () => {
    // Erfassen und Freigeben sind getrennte Schritte (Blocker B3).
    expect(isTransitionAllowed(EditorialStatus.DRAFT, EditorialStatus.PUBLISHED)).toBe(false);
    expect(isTransitionAllowed(EditorialStatus.DRAFT, EditorialStatus.IN_REVIEW)).toBe(true);
    expect(isTransitionAllowed(EditorialStatus.IN_REVIEW, EditorialStatus.PUBLISHED)).toBe(true);
  });

  it('erlaubt das Zurueckweisen aus der Pruefung', () => {
    expect(isTransitionAllowed(EditorialStatus.IN_REVIEW, EditorialStatus.DRAFT)).toBe(true);
  });

  it('kennt kein Loeschen, nur Zurueckziehen', () => {
    expect(isTransitionAllowed(EditorialStatus.PUBLISHED, EditorialStatus.ARCHIVED)).toBe(true);
    expect(isTransitionAllowed(EditorialStatus.PUBLISHED, EditorialStatus.DRAFT)).toBe(false);
    expect(isTransitionAllowed(EditorialStatus.ARCHIVED, EditorialStatus.DRAFT)).toBe(true);
  });

  it('veroeffentlicht nicht ohne Quelle', () => {
    const meldung = fehlerText(() =>
      assertTransition({
        from: EditorialStatus.IN_REVIEW,
        to: EditorialStatus.PUBLISHED,
        sourceCount: 0,
      }),
    );
    expect(meldung).toContain('Quellenangabe');
  });

  it('veroeffentlicht mit mindestens einer Quelle', () => {
    expect(() =>
      assertTransition({
        from: EditorialStatus.IN_REVIEW,
        to: EditorialStatus.PUBLISHED,
        sourceCount: 1,
      }),
    ).not.toThrow();
  });

  it('verlangt fuer andere Uebergaenge keine Quelle', () => {
    expect(() =>
      assertTransition({
        from: EditorialStatus.DRAFT,
        to: EditorialStatus.IN_REVIEW,
        sourceCount: 0,
      }),
    ).not.toThrow();
  });

  it('meldet einen Wechsel auf denselben Stand als Konflikt', () => {
    expect(
      fehlerText(() =>
        assertTransition({
          from: EditorialStatus.DRAFT,
          to: EditorialStatus.DRAFT,
          sourceCount: 3,
        }),
      ),
    ).toContain('bereits');
  });

  it('nennt in der Fehlermeldung die moeglichen Wege', () => {
    const meldung = fehlerText(() =>
      assertTransition({
        from: EditorialStatus.DRAFT,
        to: EditorialStatus.PUBLISHED,
        sourceCount: 5,
      }),
    );
    expect(meldung).toContain('in Prüfung');
  });
});

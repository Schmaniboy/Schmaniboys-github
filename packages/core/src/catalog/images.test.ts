import { describe, expect, it } from 'vitest';

import {
  type ImageBinding,
  KEIN_BILD,
  baueBildAnweisung,
  darfVeroeffentlichtWerden,
  hatBild,
  pruefeBildangaben,
  pruefeHerkunftsart,
  taugtFuerKatalog,
  urhebernennungPflicht,
  waehleBild,
} from './images';

/*
 * Die Namen sind an die Faelle der Vorgabe angelehnt: Golf 7 vor und nach
 * dem Facelift, A4 B9 gegen B9.5, G20 gegen G20 LCI. Es sind Kennungen,
 * keine Fahrzeugdaten -- geprueft wird die Zuordnungslogik, nicht der
 * Fahrzeugbestand.
 */
const G_VORFACELIFT = 'gen-golf7';
const P_VORFACELIFT = 'phase-vor';
const P_FACELIFT = 'phase-lci';

function bild(teil: Partial<ImageBinding> & { id: string }): ImageBinding {
  return {
    kind: 'VEHICLE_EXTERIOR',
    origin: 'PRESS',
    background: 'NEUTRAL',
    sourceType: 'ORIGINAL',
    // Ohne geklaerten Rechtsstand wird nichts ausgewaehlt -- die Tests
    // setzen ihn deshalb ausdruecklich, statt sich auf eine Voreinstellung
    // zu verlassen, die es bewusst nicht gibt.
    licenceStatus: 'CLEARED',
    ...teil,
  };
}

describe('Bildzuordnung', () => {
  it('nimmt das Bild, das zu allen erfassten Merkmalen passt', () => {
    const ergebnis = waehleBild(
      [
        bild({ id: 'passt', generationId: G_VORFACELIFT, faceliftPhaseId: P_VORFACELIFT }),
        bild({ id: 'andere-phase', generationId: G_VORFACELIFT, faceliftPhaseId: P_FACELIFT }),
      ],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT, faceliftPhaseId: P_VORFACELIFT },
    );

    expect(hatBild(ergebnis)).toBe(true);
    if (!hatBild(ergebnis)) return;
    expect(ergebnis.image.id).toBe('passt');
    expect(ergebnis.level).toBe('EXACT');
  });

  it('legt NIEMALS ein Facelift-Bild auf ein Vor-Facelift-Fahrzeug', () => {
    /*
     * Der Kern der Vorgabe. Es gibt genau ein Bild, es ist von der falschen
     * Phase -- und die Antwort ist nicht "besser als nichts", sondern
     * ausdruecklich nichts.
     */
    const ergebnis = waehleBild(
      [bild({ id: 'facelift', generationId: G_VORFACELIFT, faceliftPhaseId: P_FACELIFT })],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT, faceliftPhaseId: P_VORFACELIFT },
    );

    expect(hatBild(ergebnis)).toBe(false);
    expect(ergebnis.statement).toContain(KEIN_BILD);
    if (hatBild(ergebnis)) return;
    expect(ergebnis.rejected).toBe(1);
  });

  it('nimmt kein Bild einer anderen Generation', () => {
    const ergebnis = waehleBild([bild({ id: 'b9-5', generationId: 'gen-a4-b95' })], {
      kind: 'VEHICLE_EXTERIOR',
      generationId: 'gen-a4-b9',
    });
    expect(hatBild(ergebnis)).toBe(false);
  });

  it('nimmt kein Bild einer anderen Karosserie', () => {
    const ergebnis = waehleBild([bild({ id: 'kombi', bodyTypeId: 'kombi' })], {
      kind: 'VEHICLE_EXTERIOR',
      bodyTypeId: 'limousine',
    });
    expect(hatBild(ergebnis)).toBe(false);
  });

  it('weist ungepruefte Merkmale aus, statt sie als Treffer auszugeben', () => {
    // Das Bild nennt keine Phase. Es widerspricht damit nicht -- aber es
    // belegt die Phase auch nicht, und genau das muss dastehen.
    const ergebnis = waehleBild([bild({ id: 'ohne-phase', generationId: G_VORFACELIFT })], {
      kind: 'VEHICLE_EXTERIOR',
      generationId: G_VORFACELIFT,
      faceliftPhaseId: P_VORFACELIFT,
    });

    expect(hatBild(ergebnis)).toBe(true);
    if (!hatBild(ergebnis)) return;
    expect(ergebnis.level).toBe('PARTIAL');
    expect(ergebnis.unchecked).toContain('Facelift-Phase');
    expect(ergebnis.statement).toContain('Facelift-Phase');
  });

  it('haelt sich an die Rangfolge der Herkunft', () => {
    const ergebnis = waehleBild(
      [
        bild({ id: 'archiv', generationId: G_VORFACELIFT, origin: 'ARCHIVE' }),
        bild({ id: 'hersteller', generationId: G_VORFACELIFT, origin: 'MANUFACTURER' }),
        bild({ id: 'presse', generationId: G_VORFACELIFT, origin: 'PRESS' }),
      ],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );

    if (!hatBild(ergebnis)) throw new Error('Es haette ein Bild geben muessen.');
    expect(ergebnis.image.id).toBe('hersteller');
  });

  it('nimmt ein erzeugtes Bild nur, wenn es sonst keines gibt -- und kennzeichnet es', () => {
    const nurKi = waehleBild(
      [bild({ id: 'ki', generationId: G_VORFACELIFT, origin: 'AI_GENERATED' })],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );
    if (!hatBild(nurKi)) throw new Error('Es haette ein Bild geben muessen.');
    expect(nurKi.generated).toBe(true);
    expect(nurKi.statement).toContain('erzeugt');

    const mitAufnahme = waehleBild(
      [
        bild({ id: 'ki', generationId: G_VORFACELIFT, origin: 'AI_GENERATED' }),
        bild({ id: 'echt', generationId: G_VORFACELIFT, origin: 'ARCHIVE' }),
      ],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );
    if (!hatBild(mitAufnahme)) throw new Error('Es haette ein Bild geben muessen.');
    expect(mitAufnahme.image.id).toBe('echt');
    expect(mitAufnahme.generated).toBe(false);
  });

  it('beachtet den Baujahrbereich des Bildes', () => {
    const zuFrueh = waehleBild(
      [bild({ id: 'spaet', generationId: G_VORFACELIFT, yearFrom: 2017, yearTo: 2020 })],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT, year: 2013 },
    );
    expect(hatBild(zuFrueh)).toBe(false);

    const passt = waehleBild(
      [bild({ id: 'frueh', generationId: G_VORFACELIFT, yearFrom: 2012, yearTo: 2016 })],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT, year: 2013 },
    );
    expect(hatBild(passt)).toBe(true);
  });

  it('verwechselt Bildarten nicht', () => {
    const ergebnis = waehleBild(
      [bild({ id: 'innen', kind: 'VEHICLE_INTERIOR', generationId: G_VORFACELIFT })],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );
    expect(hatBild(ergebnis)).toBe(false);
  });

  it('gibt bei leerer Auswahl den vorgeschriebenen Satz zurueck', () => {
    const ergebnis = waehleBild([], { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT });
    expect(ergebnis.statement).toBe(KEIN_BILD);
  });
});

describe('Freistellung', () => {
  it('laesst nur freigestellte und neutrale Bilder in den Katalog', () => {
    expect(taugtFuerKatalog(bild({ id: 'a', background: 'CUTOUT' }))).toBe(true);
    expect(taugtFuerKatalog(bild({ id: 'b', background: 'NEUTRAL' }))).toBe(true);
    expect(taugtFuerKatalog(bild({ id: 'c', background: 'SCENE' }))).toBe(false);
    expect(taugtFuerKatalog(bild({ id: 'd', background: 'UNKNOWN' }))).toBe(false);
  });

  it('zieht das freigestellte Bild vor', () => {
    const ergebnis = waehleBild(
      [
        bild({ id: 'parkplatz', generationId: G_VORFACELIFT, background: 'SCENE' }),
        bild({ id: 'freigestellt', generationId: G_VORFACELIFT, background: 'CUTOUT' }),
      ],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );
    if (!hatBild(ergebnis)) throw new Error('Es haette ein Bild geben muessen.');
    expect(ergebnis.image.id).toBe('freigestellt');
  });
});

describe('Pflichtangaben je Herkunft', () => {
  it('verlangt bei uebernommenen Bildern Fundstelle, Titel und Urheber', () => {
    const fehler = pruefeBildangaben({
      origin: 'PRESS',
      licence: 'Pressefreigabe',
      description: 'Frontansicht',
    });
    expect(Object.keys(fehler)).toEqual(
      expect.arrayContaining(['sourceUrl', 'sourceTitle', 'author']),
    );
  });

  it('verlangt bei erzeugten Bildern Modell und Anweisung statt einer Fundstelle', () => {
    const fehler = pruefeBildangaben({
      origin: 'AI_GENERATED',
      licence: 'eigene Erzeugung',
      description: 'Seitenansicht',
    });
    expect(Object.keys(fehler)).toEqual(
      expect.arrayContaining(['generatedByModel', 'generatedPrompt']),
    );
    // Eine Fundstelle waere hier sinnlos und wird deshalb nicht verlangt.
    expect(fehler.sourceUrl).toBeUndefined();
  });

  it('verlangt immer Lizenz und Bildunterschrift', () => {
    const fehler = pruefeBildangaben({ origin: 'MANUFACTURER' });
    expect(fehler.licence).toBeDefined();
    expect(fehler.description).toBeDefined();
  });

  it('laesst ein vollstaendiges Bild durch', () => {
    const fehler = pruefeBildangaben({
      origin: 'WIKIMEDIA',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Beispiel.jpg',
      sourceTitle: 'Wikimedia Commons',
      author: 'Beispielperson',
      licence: 'CC BY-SA 4.0',
      description: 'Frontansicht in Grau',
    });
    expect(Object.keys(fehler)).toHaveLength(0);
  });
});

describe('Rechtsstand', () => {
  it('waehlt nur Bilder mit geklaerter Nutzung', () => {
    for (const status of ['UNCLEAR', 'NOT_CLEARED', 'EDITORIAL_ONLY'] as const) {
      const ergebnis = waehleBild(
        [bild({ id: 'x', generationId: G_VORFACELIFT, licenceStatus: status })],
        { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
      );
      expect(hatBild(ergebnis), status).toBe(false);
    }
  });

  it('behandelt ein Bild ohne Rechtsstand als ungeklaert', () => {
    // Die vorsichtige Voreinstellung ist hier die richtige: Ein Bild
    // anzuzeigen, dessen Rechtsstand niemand geprueft hat, ist kein
    // Schoenheitsfehler.
    const ergebnis = waehleBild(
      [{ id: 'ohne', kind: 'VEHICLE_EXTERIOR', origin: 'PRESS', background: 'NEUTRAL' }],
      { kind: 'VEHICLE_EXTERIOR' },
    );
    expect(hatBild(ergebnis)).toBe(false);
  });

  it('nennt rechtlich gesperrte Bilder im Hinweis', () => {
    const ergebnis = waehleBild(
      [bild({ id: 'x', generationId: G_VORFACELIFT, licenceStatus: 'UNCLEAR' })],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );
    expect(ergebnis.statement).toContain('rechtlich nicht geklärt');
  });

  it('unterscheidet Nutzungserlaubnis und Nennungspflicht', () => {
    expect(darfVeroeffentlichtWerden({ licenceStatus: 'CLEARED' })).toBe(true);
    expect(darfVeroeffentlichtWerden({ licenceStatus: 'ATTRIBUTION_REQUIRED' })).toBe(true);
    expect(urhebernennungPflicht({ licenceStatus: 'ATTRIBUTION_REQUIRED' })).toBe(true);
    expect(urhebernennungPflicht({ licenceStatus: 'CLEARED' })).toBe(false);
  });
});

describe('Herkunftsart', () => {
  it('haelt Vorrang ein: Original vor lizenziert vor erzeugt', () => {
    const ergebnis = waehleBild(
      [
        bild({ id: 'ki', generationId: G_VORFACELIFT, origin: 'AI_GENERATED', sourceType: 'GENERATED' }),
        bild({ id: 'lizenz', generationId: G_VORFACELIFT, sourceType: 'LICENSED' }),
        bild({ id: 'original', generationId: G_VORFACELIFT, sourceType: 'ORIGINAL' }),
      ],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );
    if (!hatBild(ergebnis)) throw new Error('Es haette ein Bild geben muessen.');
    expect(ergebnis.image.id).toBe('original');
  });

  it('zieht ein Archivbild einer erzeugten Darstellung vor', () => {
    // Auch wenn der Fundort schlechter ist: Eine Aufnahme zeigt ein Auto,
    // das gebaut wurde.
    const ergebnis = waehleBild(
      [
        bild({ id: 'ki', generationId: G_VORFACELIFT, origin: 'AI_GENERATED', sourceType: 'GENERATED' }),
        bild({ id: 'archiv', generationId: G_VORFACELIFT, origin: 'ARCHIVE', sourceType: 'ORIGINAL' }),
      ],
      { kind: 'VEHICLE_EXTERIOR', generationId: G_VORFACELIFT },
    );
    if (!hatBild(ergebnis)) throw new Error('Es haette ein Bild geben muessen.');
    expect(ergebnis.image.id).toBe('archiv');
  });

  it('erzwingt, dass Herkunft und Herkunftsart zusammenpassen', () => {
    expect(pruefeHerkunftsart({ origin: 'AI_GENERATED', sourceType: 'ORIGINAL' }).sourceType)
      .toBeDefined();
    expect(pruefeHerkunftsart({ origin: 'PRESS', sourceType: 'GENERATED' }).origin).toBeDefined();
    expect(
      Object.keys(pruefeHerkunftsart({ origin: 'AI_GENERATED', sourceType: 'GENERATED' })),
    ).toHaveLength(0);
    expect(
      Object.keys(pruefeHerkunftsart({ origin: 'WIKIMEDIA', sourceType: 'ORIGINAL' })),
    ).toHaveLength(0);
  });
});

describe('Anweisung fuer erzeugte Bilder', () => {
  it('nimmt nur auf, was belegt ist', () => {
    const anweisung = baueBildAnweisung({
      manufacturer: 'Prüfmarke',
      model: 'Prüfmodell',
      generationCode: 'P1',
      bodyType: 'Limousine',
    });

    expect(anweisung.prompt).toContain('Prüfmarke Prüfmodell');
    expect(anweisung.prompt).toContain('Baureihe P1');
    expect(anweisung.prompt).toContain('Limousine');
    // Nicht Belegtes taucht NICHT auf.
    expect(anweisung.prompt).not.toContain('Lackfarbe');
    expect(anweisung.prompt).not.toContain('Baujahr');
  });

  it('weist aus, was das Bild zwangslaeufig zeigt, ohne belegt zu sein', () => {
    /*
     * Der ehrliche Teil: Ein erzeugtes Bild hat immer Scheinwerfer, auch
     * wenn niemand weiss, welche diese Phase hatte.
     */
    const anweisung = baueBildAnweisung({
      manufacturer: 'Prüfmarke',
      model: 'Prüfmodell',
      generationCode: 'P1',
      bodyType: 'Limousine',
    });

    expect(anweisung.unverifiedAspects.join(' ')).toContain('Scheinwerfer');
    expect(anweisung.unverifiedAspects.join(' ')).toContain('Lackfarbe');
    expect(anweisung.coveredFields).toContain('generation');
    expect(anweisung.coveredFields).not.toContain('paintColor');
  });

  it('verweigert die Erzeugung ohne Generation oder Karosserie', () => {
    const ohneGeneration = baueBildAnweisung({ manufacturer: 'X', model: 'Y', bodyType: 'Kombi' });
    expect(ohneGeneration.sufficient).toBe(false);
    expect(ohneGeneration.reason).toContain('mehrerer Generationen');

    const ohneKarosserie = baueBildAnweisung({ manufacturer: 'X', model: 'Y', generationCode: 'P1' });
    expect(ohneKarosserie.sufficient).toBe(false);
  });

  it('verbietet in der Anweisung ausdruecklich Fremdmerkmale und Umgebung', () => {
    const anweisung = baueBildAnweisung({
      manufacturer: 'X',
      model: 'Y',
      generationCode: 'P1',
      bodyType: 'Limousine',
    });
    expect(anweisung.prompt).toContain('Keine Menschen');
    expect(anweisung.prompt).toContain('keine anderen Fahrzeuge');
    expect(anweisung.prompt).toContain('Keine Merkmale anderer Generationen');
    expect(anweisung.prompt).toContain('neutralem');
  });
});

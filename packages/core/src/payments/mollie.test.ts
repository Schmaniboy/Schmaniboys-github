import { describe, expect, it } from 'vitest';

import { PaymentStatus as MollieStatus } from '@mollie/api-client';

import {
  MolliePaymentProvider,
  betragAlsCents,
  centsAlsBetrag,
  uebersetzeZustand,
} from './mollie';

/*
 * Geprueft wird, was ohne Netzverbindung pruefbar ist: die Umrechnung von
 * Betraegen, die Abbildung der Zustaende und das Verhalten ohne Schluessel.
 * Die Aufrufe gegen Mollie selbst gehoeren in einen Test mit Testschluessel
 * und lassen sich hier nicht ehrlich nachstellen -- ein nachgebauter Mollie
 * pruefte nur, ob mein Nachbau zu meinem Adapter passt.
 */

describe('Betraege', () => {
  it('rechnet Cent in das Format des Anbieters', () => {
    expect(centsAlsBetrag(1000)).toBe('10.00');
    expect(centsAlsBetrag(999)).toBe('9.99');
    expect(centsAlsBetrag(5)).toBe('0.05');
    expect(centsAlsBetrag(0)).toBe('0.00');
    expect(centsAlsBetrag(123456)).toBe('1234.56');
  });

  it('lehnt unsinnige Betraege ab, statt sie zu runden', () => {
    expect(() => centsAlsBetrag(-1)).toThrow();
    expect(() => centsAlsBetrag(10.5)).toThrow();
  });

  it('liest Betraege zurueck, ohne an der Gleitkommarechnung zu scheitern', () => {
    expect(betragAlsCents('10.00')).toBe(1000);
    expect(betragAlsCents('0.05')).toBe(5);
    expect(betragAlsCents('1234.56')).toBe(123456);
    // 0.1 + 0.2 laesst gruessen: 29.99 * 100 ergibt roh 2998.9999...
    expect(betragAlsCents('29.99')).toBe(2999);
  });

  it('ist in beide Richtungen verlustfrei', () => {
    for (const cents of [1, 5, 99, 100, 2999, 123456, 999999]) {
      expect(betragAlsCents(centsAlsBetrag(cents))).toBe(cents);
    }
  });

  it('lehnt einen unlesbaren Betrag ab, statt null zu liefern', () => {
    expect(() => betragAlsCents('kein Betrag')).toThrow();
  });
});

describe('Zustandsabbildung', () => {
  it('bildet die Zustaende des Anbieters ab', () => {
    expect(uebersetzeZustand(MollieStatus.paid)).toBe('PAID');
    expect(uebersetzeZustand(MollieStatus.authorized)).toBe('AUTHORIZED');
    expect(uebersetzeZustand(MollieStatus.failed)).toBe('FAILED');
    expect(uebersetzeZustand(MollieStatus.open)).toBe('PENDING');
    expect(uebersetzeZustand(MollieStatus.pending)).toBe('PENDING');
  });

  it('behandelt „abgelaufen" als abgebrochen, nicht als gescheitert', () => {
    // Eine abgelaufene Zahlung ist keine gescheiterte, sondern eine nie
    // begonnene. FAILED loeste in der Oberflaeche einen Hinweis aus, den sie
    // nicht verdient.
    expect(uebersetzeZustand(MollieStatus.expired)).toBe('CANCELLED');
    expect(uebersetzeZustand(MollieStatus.canceled)).toBe('CANCELLED');
  });

  it('haelt einen unbekannten Zustand NICHT fuer bezahlt', () => {
    // Sollte Mollie einen neuen Zustand einfuehren, bleibt der Vorgang offen,
    // statt Guthaben freizugeben.
    expect(uebersetzeZustand('etwas-neues' as MollieStatus)).toBe('PENDING');
  });
});

describe('Verfuegbarkeit', () => {
  const konfig = { webhookUrl: 'https://example.test/api/zahlungen/mollie' };

  it('meldet sich ohne Schluessel als nicht eingerichtet', () => {
    expect(new MolliePaymentProvider({ ...konfig, apiKey: undefined }).isAvailable()).toBe(false);
    expect(new MolliePaymentProvider({ ...konfig, apiKey: '' }).isAvailable()).toBe(false);
    expect(new MolliePaymentProvider({ ...konfig, apiKey: '   ' }).isAvailable()).toBe(false);
  });

  it('lehnt einen Schluessel ab, der nicht wie einer aussieht', () => {
    // Faengt den haeufigsten Konfigurationsfehler: einen Platzhalter.
    for (const schluessel of ['HIER_SCHLUESSEL_EINTRAGEN', 'sk_live_abc', 'abc123']) {
      expect(
        new MolliePaymentProvider({ ...konfig, apiKey: schluessel }).isAvailable(),
        schluessel,
      ).toBe(false);
    }
  });

  it('nimmt Test- und Echtschluessel an und unterscheidet sie', () => {
    const test = new MolliePaymentProvider({ ...konfig, apiKey: 'test_abcdefghijklmnop' });
    const echt = new MolliePaymentProvider({ ...konfig, apiKey: 'live_abcdefghijklmnop' });

    expect(test.isAvailable()).toBe(true);
    expect(test.istEchtbetrieb).toBe(false);
    expect(echt.isAvailable()).toBe(true);
    expect(echt.istEchtbetrieb).toBe(true);
  });

  it('wirft ohne Schluessel mit einer Meldung, die den Grund nennt', async () => {
    const ohne = new MolliePaymentProvider({ ...konfig, apiKey: undefined });
    await expect(ohne.getPaymentStatus('tr_abc')).rejects.toThrow(/MOLLIE_API_KEY/);
  });
});

describe('Benachrichtigung', () => {
  const anbieter = new MolliePaymentProvider({
    apiKey: 'test_abcdefghijklmnop',
    webhookUrl: 'https://example.test/api/zahlungen/mollie',
  });

  it('lehnt eine Benachrichtigung ohne Kennung ab', async () => {
    await expect(anbieter.handleWebhook('')).rejects.toThrow(/Zahlungskennung/);
    await expect(anbieter.handleWebhook('foo=bar')).rejects.toThrow(/Zahlungskennung/);
  });

  it('lehnt eine Kennung ab, die nicht wie eine Zahlungskennung aussieht', async () => {
    /*
     * Der Endpunkt ist oeffentlich. Ohne diese Pruefung liesse sich mit
     * beliebigen Zeichenketten gegen die Anbieterschnittstelle klopfen.
     */
    for (const kennung of ['../../etc/passwd', 'ord_abc', '<script>', 'tr_']) {
      await expect(
        anbieter.handleWebhook(`id=${encodeURIComponent(kennung)}`),
        kennung,
      ).rejects.toThrow(/Zahlungskennung/);
    }
  });
});

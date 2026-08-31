'use client';

import { useEffect, useState } from 'react';

import { LinkButton } from '@/components/ui/Button';

/**
 * Anmeldezustand in der Kopfzeile.
 *
 * Warum im Browser und nicht auf dem Server: Wuerde das Wurzel-Layout die
 * Sitzung lesen, waere jede Seite dynamisch -- auch die Katalogseiten, die
 * statisch ausgeliefert werden sollen (siehe docs/gehirn/01-Architektur.md).
 * Diese Komponente ergaenzt den Zustand deshalb nachtraeglich.
 *
 * Sichtbarkeit ist keine Berechtigung: Was hier erscheint, sagt nichts
 * darueber aus, was der Server erlaubt. Das entscheidet er selbst.
 */

interface MeResponse {
  data?: { user?: { displayName: string } | null; permissions?: string[] };
}

export function AccountMenu() {
  const [state, setState] = useState<'unbekannt' | 'anonym' | 'angemeldet'>('unbekannt');
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/auth/me', { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<MeResponse>) : null))
      .then((payload) => {
        const user = payload?.data?.user;
        if (user) {
          setDisplayName(user.displayName);
          setState('angemeldet');
          const perms = payload?.data?.permissions ?? [];
          setIsAdmin(perms.includes('ADMIN_USERS'));
        } else {
          setState('anonym');
        }
      })
      .catch(() => {
        setState('anonym');
      });

    return () => controller.abort();
  }, []);

  if (state === 'unbekannt') {
    // Platzhalter in der Hoehe der Schaltflaechen, damit die Kopfzeile beim
    // Nachladen nicht springt. Auf dem Handy schmal, weil dort nur eine
    // Schaltflaeche steht.
    return <div className="h-8 w-9 sm:w-40" aria-hidden="true" />;
  }

  if (state === 'angemeldet') {
    return (
      <>
        {displayName ? (
          <span className="hidden text-sm text-ink-muted sm:inline">{displayName}</span>
        ) : null}
        {isAdmin ? (
          <LinkButton href="/admin" size="sm" variant="ghost">
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">Verwaltung</span>
          </LinkButton>
        ) : null}
        <LinkButton href="/konto" size="sm" variant="secondary">
          <span className="sm:hidden">Konto</span>
          <span className="hidden sm:inline">Mein Konto</span>
        </LinkButton>
      </>
    );
  }

  /*
   * Auf dem Handy steht hier nur noch die Anmeldung.
   *
   * Beide Schaltflaechen nebeneinander waren auf 390 Bildpunkten breiter als
   * der Platz, den die Kopfzeile hat -- "Konto erstellen" schob sich ueber
   * den Menueknopf und machte ihn unerreichbar. Das ist kein Schoenheits-
   * fehler: Die Hauptnavigation war damit auf dem Telefon gar nicht mehr zu
   * oeffnen. Die Kontoeroeffnung steht weiterhin im Menue und auf der
   * Anmeldeseite.
   */
  return (
    <>
      <LinkButton href="/anmelden" size="sm" variant="ghost">Anmelden</LinkButton>
      {/*
        Der Wrapper traegt das Ausblenden, nicht die Schaltflaeche selbst.
        `hidden` und `inline-flex` sind beides Anzeigeklassen; stehen sie am
        selben Element, entscheidet die Reihenfolge im Stylesheet -- und dort
        gewinnt `inline-flex`. Das Ergebnis war eine Schaltflaeche, die
        ausgeblendet aussehen sollte und es nicht war.
      */}
      <span className="hidden sm:contents">
        <LinkButton href="/registrieren" size="sm" variant="primary">
          Konto erstellen
        </LinkButton>
      </span>
    </>
  );
}

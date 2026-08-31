'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { MAX_LAENGE } from '@ap/core/messaging/policy';

import { Button } from '@/components/ui/Button';

/**
 * Ein Gespraech.
 *
 * Die Warnhinweise stehen ueber dem Verlauf und nicht neben einzelnen
 * Nachrichten: Sie beziehen sich auf das Gespraech, und einzelne Nachrichten
 * anzumarkern liest sich wie eine Beschuldigung. Sie sperren nichts --
 * gelesen wird die Nachricht trotzdem.
 */

interface Anhang {
  id: string;
  storageKey: string;
  width: number;
  height: number;
}

interface Nachricht {
  id: string;
  senderId: string;
  body: string | null;
  entfernt: boolean;
  entferntGrund: string | null;
  createdAt: string;
  attachments: Anhang[];
}

interface Warnzeichen {
  id: string;
  hinweis: string;
}

export function ConversationView({
  conversationId,
  eigeneKennung,
  gegenueber,
  fahrzeug,
  fahrzeugSlug,
  zustand,
  nachrichten: anfaenglich,
  warnungen,
}: {
  conversationId: string;
  eigeneKennung: string;
  gegenueber: string;
  fahrzeug: string | null;
  fahrzeugSlug: string | null;
  zustand: string;
  nachrichten: Nachricht[];
  warnungen: Warnzeichen[];
}) {
  const [nachrichten, setNachrichten] = useState(anfaenglich);
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [geschlossen, setGeschlossen] = useState(zustand !== 'OPEN');
  const feld = useRef<HTMLTextAreaElement>(null);
  const ende = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  useEffect(() => {
    ende.current?.scrollIntoView({ block: 'nearest' });
  }, [nachrichten.length]);

  async function senden(ereignis: React.FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    const text = feld.current?.value ?? '';
    if (text.trim().length < 2) return;

    setLaeuft(true);
    setMeldung(null);
    try {
      const antwort = await fetch(`/api/nachrichten/${conversationId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      const inhalt = (await antwort.json()) as {
        data?: { message: { id: string; body: string; createdAt: string } };
        error?: { message?: string };
      };

      if (antwort.ok && inhalt.data) {
        setNachrichten((bisher) => [
          ...bisher,
          {
            id: inhalt.data!.message.id,
            senderId: eigeneKennung,
            body: inhalt.data!.message.body,
            entfernt: false,
            entferntGrund: null,
            createdAt: inhalt.data!.message.createdAt,
            attachments: [],
          },
        ]);
        if (feld.current) feld.current.value = '';
      } else {
        setMeldung(inhalt.error?.message ?? 'Die Nachricht wurde nicht gesendet.');
      }
    } catch {
      setMeldung('Die Nachricht wurde nicht gesendet.');
    } finally {
      setLaeuft(false);
    }
  }

  async function zustandWechseln() {
    const ziel = geschlossen ? 'OPEN' : 'CLOSED';
    setLaeuft(true);
    try {
      const antwort = await fetch(`/api/nachrichten/${conversationId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ state: ziel }),
      });
      if (antwort.ok) {
        setGeschlossen(ziel === 'CLOSED');
      } else {
        setMeldung('Das hat gerade nicht geklappt.');
      }
    } catch {
      setMeldung('Das hat gerade nicht geklappt.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{gegenueber}</h1>
          {fahrzeug ? (
            <p className="mt-1 text-sm text-ink-muted">
              {fahrzeugSlug ? (
                <Link href={`/marktplatz/${fahrzeugSlug}`} className="underline-offset-4 hover:underline">
                  {fahrzeug}
                </Link>
              ) : (
                <>
                  {fahrzeug}{' '}
                  <span className="text-ink-subtle">— die Anzeige ist nicht mehr online.</span>
                </>
              )}
            </p>
          ) : null}
        </div>

        {zustand !== 'BLOCKED' ? (
          <button
            type="button"
            onClick={zustandWechseln}
            disabled={!bereit || laeuft}
            className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
          >
            {geschlossen ? 'Wieder öffnen' : 'Gespräch schließen'}
          </button>
        ) : null}
      </div>

      {warnungen.length > 0 ? (
        <section className="rounded-md border border-caution/40 bg-caution/10 p-4">
          <h2 className="text-sm font-semibold text-caution">Worauf Sie achten sollten</h2>
          <ul className="mt-2 space-y-2">
            {warnungen.map((warnung) => (
              <li key={warnung.id} className="text-sm leading-relaxed text-ink-muted">
                {warnung.hinweis}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
            Das sind Anhaltspunkte, keine Beweise — und die Nachricht wurde deswegen nicht
            zurückgehalten. Entscheiden Sie selbst.
          </p>
        </section>
      ) : null}

      <ul className="space-y-3">
        {nachrichten.map((nachricht) => {
          const vonMir = nachricht.senderId === eigeneKennung;
          return (
            <li key={nachricht.id} className={vonMir ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                  vonMir
                    ? 'bg-accent/15 text-ink'
                    : 'border border-line/60 bg-surface-2 text-ink'
                }`}
              >
                {nachricht.entfernt ? (
                  <p className="text-sm italic text-ink-subtle">
                    Diese Nachricht wurde von der Moderation entfernt.
                    {nachricht.entferntGrund ? ` Grund: ${nachricht.entferntGrund}` : ''}
                  </p>
                ) : (
                  <>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{nachricht.body}</p>
                    {nachricht.attachments.length > 0 ? (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {nachricht.attachments.map((anhang) => (
                          <li key={anhang.id}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/api/bilder/${anhang.storageKey}`}
                              alt="Anhang"
                              className="max-h-48 rounded border border-line/60"
                              loading="lazy"
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                )}
                <p className="mt-1 text-xs text-ink-subtle">
                  {new Date(nachricht.createdAt).toLocaleString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div ref={ende} />

      {meldung ? (
        <p
          role="status"
          className="rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution"
        >
          {meldung}
        </p>
      ) : null}

      {geschlossen ? (
        <p className="rounded-md border border-line/60 bg-surface-2 px-4 py-3 text-sm text-ink-muted">
          Dieses Gespräch ist geschlossen. Es lässt sich weiter lesen, aber nicht fortsetzen.
        </p>
      ) : (
        <form onSubmit={senden} method="post" className="space-y-2">
          <label className="block">
            <span className="sr-only">Nachricht</span>
            <textarea
              ref={feld}
              name="body"
              rows={4}
              maxLength={MAX_LAENGE}
              required
              placeholder="Ihre Nachricht …"
              className="w-full rounded-md border border-line-interactive bg-surface-1 px-3 py-2 text-base sm:text-sm text-ink placeholder:text-ink-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs leading-relaxed text-ink-subtle">
              Bleiben Sie im Gespräch auf der Plattform — hier bleibt der Verlauf erhalten.
            </p>
            <Button type="submit" disabled={!bereit || laeuft}>
              {laeuft ? 'Wird gesendet …' : 'Senden'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

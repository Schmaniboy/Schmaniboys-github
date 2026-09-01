'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { Button } from './Button';

interface DialogKontext {
  bestaetigen: (nachricht: string, optionen?: { titel?: string; gefahr?: boolean }) => Promise<boolean>;
  eingabe: (nachricht: string, optionen?: { titel?: string; platzhalter?: string }) => Promise<string | null>;
}

const Ctx = createContext<DialogKontext | null>(null);

export function useDialog(): DialogKontext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDialog ausserhalb von DialogProvider');
  return ctx;
}

type DialogZustand =
  | null
  | { art: 'bestaetigen'; nachricht: string; titel: string; gefahr: boolean; aufloesung: (ok: boolean) => void }
  | { art: 'eingabe'; nachricht: string; titel: string; platzhalter: string; aufloesung: (text: string | null) => void };

export function DialogProvider({ children }: { children: ReactNode }) {
  const [zustand, setZustand] = useState<DialogZustand>(null);

  const bestaetigen = useCallback(
    (nachricht: string, optionen?: { titel?: string; gefahr?: boolean }): Promise<boolean> =>
      new Promise((aufloesung) => {
        setZustand({
          art: 'bestaetigen',
          nachricht,
          titel: optionen?.titel ?? 'Bestätigung',
          gefahr: optionen?.gefahr ?? false,
          aufloesung,
        });
      }),
    [],
  );

  const eingabe = useCallback(
    (nachricht: string, optionen?: { titel?: string; platzhalter?: string }): Promise<string | null> =>
      new Promise((aufloesung) => {
        setZustand({
          art: 'eingabe',
          nachricht,
          titel: optionen?.titel ?? 'Eingabe',
          platzhalter: optionen?.platzhalter ?? '',
          aufloesung,
        });
      }),
    [],
  );

  const schliessen = useCallback(() => {
    if (!zustand) return;
    if (zustand.art === 'bestaetigen') zustand.aufloesung(false);
    else zustand.aufloesung(null);
    setZustand(null);
  }, [zustand]);

  return (
    <Ctx value={{ bestaetigen, eingabe }}>
      {children}
      {zustand?.art === 'bestaetigen' ? (
        <BestaetigungsDialog
          nachricht={zustand.nachricht}
          titel={zustand.titel}
          gefahr={zustand.gefahr}
          onBestaetigen={() => { zustand.aufloesung(true); setZustand(null); }}
          onAbbrechen={schliessen}
        />
      ) : zustand?.art === 'eingabe' ? (
        <EingabeDialog
          nachricht={zustand.nachricht}
          titel={zustand.titel}
          platzhalter={zustand.platzhalter}
          onBestaetigen={(text) => { zustand.aufloesung(text); setZustand(null); }}
          onAbbrechen={schliessen}
        />
      ) : null}
    </Ctx>
  );
}

function BestaetigungsDialog({
  nachricht,
  titel,
  gefahr,
  onBestaetigen,
  onAbbrechen,
}: {
  nachricht: string;
  titel: string;
  gefahr: boolean;
  onBestaetigen: () => void;
  onAbbrechen: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = () => onAbbrechen();
    dialog.addEventListener('close', handler);
    return () => dialog.removeEventListener('close', handler);
  }, [onAbbrechen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface-3 p-0 text-ink shadow-overlay backdrop:bg-black/70"
    >
      <div className="border-b border-line px-5 py-4">
        <h2 id="dialog-title" className="text-base font-semibold">{titel}</h2>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm leading-relaxed text-ink-muted">{nachricht}</p>
      </div>
      <div className="flex justify-end gap-2 border-t border-line px-5 py-3">
        <Button variant="ghost" onClick={onAbbrechen}>Abbrechen</Button>
        <Button variant={gefahr ? 'danger' : 'primary'} onClick={onBestaetigen}>
          Fortfahren
        </Button>
      </div>
    </dialog>
  );
}

function EingabeDialog({
  nachricht,
  titel,
  platzhalter,
  onBestaetigen,
  onAbbrechen,
}: {
  nachricht: string;
  titel: string;
  platzhalter: string;
  onBestaetigen: (text: string) => void;
  onAbbrechen: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const feldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    setTimeout(() => feldRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = () => onAbbrechen();
    dialog.addEventListener('close', handler);
    return () => dialog.removeEventListener('close', handler);
  }, [onAbbrechen]);

  function absenden(ereignis: React.FormEvent) {
    ereignis.preventDefault();
    const text = feldRef.current?.value ?? '';
    onBestaetigen(text);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface-3 p-0 text-ink shadow-overlay backdrop:bg-black/70"
    >
      <form onSubmit={absenden}>
        <div className="border-b border-line px-5 py-4">
          <h2 id="dialog-title" className="text-base font-semibold">{titel}</h2>
        </div>
        <div className="space-y-3 px-5 py-4">
          <p className="text-sm leading-relaxed text-ink-muted">{nachricht}</p>
          <textarea
            ref={feldRef}
            rows={3}
            placeholder={platzhalter}
            className="w-full rounded-md border border-line-interactive bg-surface-1 px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-line px-5 py-3">
          <Button type="button" variant="ghost" onClick={onAbbrechen}>Abbrechen</Button>
          <Button type="submit" variant="primary">Bestätigen</Button>
        </div>
      </form>
    </dialog>
  );
}

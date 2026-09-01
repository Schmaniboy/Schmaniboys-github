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

import { cn } from '@/lib/cn';

type Ton = 'neutral' | 'positive' | 'caution' | 'critical';

interface ToastDaten {
  id: number;
  nachricht: string;
  ton: Ton;
  ablauf: number;
}

interface ToastKontext {
  zeigen: (nachricht: string, optionen?: { ton?: Ton; dauer?: number }) => void;
}

const Ctx = createContext<ToastKontext | null>(null);

export function useToast(): ToastKontext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast ausserhalb von ToastProvider');
  return ctx;
}

const STANDARD_DAUER = 4000;

const TON_KLASSEN: Record<Ton, string> = {
  neutral: 'border-line-interactive bg-surface-3 text-ink',
  positive: 'border-positive/40 bg-positive/10 text-positive',
  caution: 'border-caution/40 bg-caution/10 text-caution',
  critical: 'border-critical/40 bg-critical/10 text-critical',
};

let naechsteId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastDaten[]>([]);
  const timerRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const entfernen = useCallback((id: number) => {
    setToasts((vorher) => vorher.filter((t) => t.id !== id));
    const timer = timerRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerRef.current.delete(id);
    }
  }, []);

  const zeigen = useCallback(
    (nachricht: string, optionen?: { ton?: Ton; dauer?: number }) => {
      const id = ++naechsteId;
      const dauer = optionen?.dauer ?? STANDARD_DAUER;
      const toast: ToastDaten = {
        id,
        nachricht,
        ton: optionen?.ton ?? 'neutral',
        ablauf: Date.now() + dauer,
      };

      setToasts((vorher) => [...vorher.slice(-4), toast]);

      const timer = setTimeout(() => entfernen(id), dauer);
      timerRef.current.set(id, timer);
    },
    [entfernen],
  );

  useEffect(() => {
    const timers = timerRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
    };
  }, []);

  return (
    <Ctx value={{ zeigen }}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4"
      >
        {toasts.map((toast) => (
          <ToastEintrag key={toast.id} toast={toast} onClose={() => entfernen(toast.id)} />
        ))}
      </div>
    </Ctx>
  );
}

function ToastEintrag({ toast, onClose }: { toast: ToastDaten; onClose: () => void }) {
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSichtbar(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex max-w-md items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-overlay transition-all duration-300',
        TON_KLASSEN[toast.ton],
        sichtbar ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      )}
    >
      <span className="min-w-0 flex-1">{toast.nachricht}</span>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-current opacity-50 transition-opacity hover:opacity-100"
        aria-label="Schliessen"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}

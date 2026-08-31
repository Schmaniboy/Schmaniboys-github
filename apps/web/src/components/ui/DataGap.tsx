import { cn } from '@/lib/cn';

/**
 * Kennzeichnung fehlender Daten.
 *
 * Vorgabe C3 verlangt, Luecken auszuweisen statt sie zu fuellen. Diese
 * Komponente macht daraus eine sichtbare Zusage: Wo sie steht, ist bekannt,
 * dass etwas fehlt -- und es wurde nichts geraten.
 *
 * Sie ist absichtlich unauffaellig. Eine Luecke ist kein Fehler, sondern eine
 * ehrliche Angabe.
 */
export function DataGap({
  reason = 'nicht erfasst',
  className,
}: {
  reason?: string;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-sm text-ink-subtle', className)}
      title="Dieser Wert liegt nicht belegt vor und wird deshalb nicht angezeigt."
    >
      <span aria-hidden="true" className="font-mono">
        —
      </span>
      <span className="text-xs">{reason}</span>
    </span>
  );
}

/**
 * Quellenangabe zu einer harten Zahl.
 *
 * Jede technische Angabe im Katalog traegt ihre Herkunft. Ohne Quelle wird
 * nicht veroeffentlicht.
 */
export function SourceNote({ sources }: { sources: readonly string[] }) {
  if (sources.length === 0) {
    return <DataGap reason="ohne Quellenangabe" />;
  }

  return (
    <p className="text-xs text-ink-subtle">
      Quelle{sources.length > 1 ? 'n' : ''}:{' '}
      {sources.map((source, index) => (
        <span key={source}>
          {index > 0 ? ', ' : ''}
          <span className="break-all">{source}</span>
        </span>
      ))}
    </p>
  );
}

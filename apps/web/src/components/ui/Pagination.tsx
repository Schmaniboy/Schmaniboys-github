import Link from 'next/link';

export function Pagination({
  pfad,
  seite,
  gesamt,
  seitengroesse,
  parameter,
}: {
  pfad: string;
  seite: number;
  gesamt: number;
  seitengroesse: number;
  parameter?: Record<string, string | undefined>;
}) {
  const letzteSeite = Math.max(0, Math.ceil(gesamt / seitengroesse) - 1);
  if (letzteSeite === 0) return null;

  function href(ziel: number) {
    const p = new URLSearchParams();
    if (parameter) {
      for (const [k, v] of Object.entries(parameter)) {
        if (v) p.set(k, v);
      }
    }
    if (ziel > 0) p.set('seite', String(ziel));
    const qs = p.toString();
    return qs ? `${pfad}?${qs}` : pfad;
  }

  return (
    <nav className="mt-6 flex items-center justify-between" aria-label="Seiten">
      {seite > 0 ? (
        <Link
          href={href(seite - 1)}
          className="text-sm text-ink underline-offset-4 hover:underline"
        >
          Zurück
        </Link>
      ) : (
        <span className="text-sm text-ink-subtle">Zurück</span>
      )}
      <span className="text-sm text-ink-subtle">
        Seite {seite + 1} von {letzteSeite + 1}
      </span>
      {seite < letzteSeite ? (
        <Link
          href={href(seite + 1)}
          className="text-sm text-ink underline-offset-4 hover:underline"
        >
          Weiter
        </Link>
      ) : (
        <span className="text-sm text-ink-subtle">Weiter</span>
      )}
    </nav>
  );
}

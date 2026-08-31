import { LinkButton } from '@/components/ui/Button';

/**
 * Platzhalter fuer Bereiche, die laut MASTERPLAN noch entstehen.
 *
 * Bewusst ehrlich statt leer: Die Navigation zeigt den geplanten Umfang der
 * Plattform. Ein toter Link waere schlechter als eine Seite, die sagt, was
 * hier hinkommt und wann. Jede dieser Seiten wird in ihrer Phase ersetzt.
 */
export function ComingSoon({
  eyebrow,
  title,
  description,
  phase,
  scope,
}: {
  eyebrow: string;
  title: string;
  description: string;
  phase: string;
  scope: readonly string[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
        {description}
      </p>

      <div className="mt-8 rounded-lg border border-line bg-surface-2 p-5">
        <p className="eyebrow mb-3">Geplanter Umfang · {phase}</p>
        <ul className="space-y-2">
          {scope.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-ink-muted">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <LinkButton href="/" variant="secondary">Zur Startseite</LinkButton>
      </div>
    </div>
  );
}

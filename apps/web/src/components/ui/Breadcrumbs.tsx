import Link from 'next/link';

/** Pfadanzeige. Wichtig in einem Katalog mit vier Ebenen. */
export function Breadcrumbs({
  items,
}: {
  items: readonly { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Pfad" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-subtle">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className="text-line-interactive">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-muted">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Anbieterkennzeichnung.',
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Rechtliches</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Impressum</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Anbieterkennzeichnung nach § 5 TMG.
      </p>

      <div className="mt-8 rounded-lg border border-line bg-surface-2 p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          Die Angaben nach § 5 TMG werden vom Betreiber eingetragen, sobald
          der Geschäftsbetrieb aufgenommen wird. Bis dahin ist diese Seite ein
          Platzhalter.
        </p>
      </div>
    </div>
  );
}

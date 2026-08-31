import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Anbieterkennzeichnung.',
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Impressum</h1>
      <div className="mt-6 rounded-lg border border-line bg-surface-2 p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          Die Angaben nach § 5 TMG werden vom Betreiber eingetragen, sobald
          der Geschäftsbetrieb aufgenommen wird. Bis dahin ist diese Seite ein
          Platzhalter.
        </p>
      </div>
    </div>
  );
}

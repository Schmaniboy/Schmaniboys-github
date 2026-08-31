import type { Metadata } from 'next';

import { GLOSSARY_KEYS } from '@ap/core';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { TermCard } from '@/components/ui/Term';

export const metadata: Metadata = {
  title: 'Glossar',
  description:
    'Technische Begriffe rund ums Auto, erklärt für Menschen ohne Vorwissen.',
};

export default function GlossarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[{ href: '/katalog', label: 'Fahrzeugwissen' }, { label: 'Glossar' }]}
      />

      <div className="accent-rule mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Glossar</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Technische Angaben nützen nur, wenn man sie versteht. Hier steht, was
        die Begriffe bedeuten und warum sie beim Autokauf zählen — ohne
        Vorwissen lesbar.
      </p>

      <div className="mt-8">
        {GLOSSARY_KEYS.map((key) => (
          <TermCard key={key} term={key} />
        ))}
      </div>
    </div>
  );
}

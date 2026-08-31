import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { findeWarnzeichen } from '@ap/core';
import { findOwnConversation, listMessages } from '@ap/db';

import { ConversationView } from '@/components/messaging/ConversationView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Gespräch' };
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GespraechPage({ params }: Props) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const gespraech = await findOwnConversation(id, session.principal.userId);
  if (!gespraech) notFound();

  const nachrichten = await listMessages(id, session.principal.userId);
  const gegenueber =
    gespraech.initiatorId === session.principal.userId ? gespraech.recipient : gespraech.initiator;

  const fremdeTexte = nachrichten
    .filter((nachricht) => nachricht.senderId !== session.principal.userId && nachricht.body)
    .map((nachricht) => nachricht.body ?? '')
    .join('\n');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { href: '/konto/nachrichten', label: 'Nachrichten' },
          { label: gegenueber.displayName },
        ]}
      />

      <div className="accent-rule mb-5 mt-4" />

      <ConversationView
        conversationId={gespraech.id}
        eigeneKennung={session.principal.userId}
        gegenueber={gegenueber.displayName}
        fahrzeug={gespraech.listingLabel}
        fahrzeugSlug={gespraech.listing?.slug ?? null}
        zustand={gespraech.state}
        nachrichten={nachrichten.map((nachricht) => ({
          id: nachricht.id,
          senderId: nachricht.senderId,
          body: nachricht.body,
          entfernt: nachricht.entfernt,
          entferntGrund: nachricht.entferntGrund,
          createdAt: nachricht.createdAt.toISOString(),
          attachments: nachricht.attachments,
        }))}
        warnungen={findeWarnzeichen(fremdeTexte)}
      />
    </div>
  );
}

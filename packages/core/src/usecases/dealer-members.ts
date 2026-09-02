import { type Principal, requireSameDealer } from '../auth/access';
import { errors } from '../errors';
import { parseOrThrow } from '../validation/common';
import { dealerMemberInviteInput, dealerMemberRoleInput } from '../dealer/schemas';
import { z } from 'zod';

export interface DealerMemberRepository {
  listMembers(dealerId: string): Promise<unknown[]>;
  addMember(dealerId: string, email: string, role: string): Promise<unknown>;
  setMemberRole(dealerId: string, userId: string, role: string): Promise<void>;
  removeMember(dealerId: string, userId: string): Promise<void>;
}

export interface DealerMemberDeps {
  members: DealerMemberRepository;
}

export async function listDealerStaff(deps: DealerMemberDeps, principal: Principal | null) {
  const admin = requireSameDealer(principal, principal?.dealerId);
  return deps.members.listMembers(admin.dealerId as string);
}

export async function inviteDealerMember(
  deps: DealerMemberDeps,
  principal: Principal | null,
  rawInput: unknown,
) {
  const admin = requireSameDealer(principal, principal?.dealerId);
  const { email, role } = parseOrThrow(dealerMemberInviteInput, rawInput);
  return deps.members.addMember(admin.dealerId as string, email, role);
}

export async function changeDealerMemberRole(
  deps: DealerMemberDeps,
  principal: Principal | null,
  rawInput: unknown,
) {
  const handelnde = requireSameDealer(principal, principal?.dealerId);
  const { userId, role } = parseOrThrow(dealerMemberRoleInput, rawInput);

  if (userId === handelnde.userId && role === 'DEALER_STAFF') {
    throw errors.conflict(
      'Die eigene Rolle lässt sich hier nicht herabstufen. Bitte von einem anderen ' +
        'Inhaber ändern lassen.',
    );
  }

  await deps.members.setMemberRole(handelnde.dealerId as string, userId, role);
  return { userId, role };
}

const entfernenInput = z.object({ userId: z.string().min(1) });

export async function removeDealerMemberUseCase(
  deps: DealerMemberDeps,
  principal: Principal | null,
  rawInput: unknown,
) {
  const handelnde = requireSameDealer(principal, principal?.dealerId);
  const { userId } = parseOrThrow(entfernenInput, rawInput);

  if (userId === handelnde.userId) {
    throw errors.conflict(
      'Sich selbst aus dem Betrieb zu entfernen ist hier nicht vorgesehen. Bitte von ' +
        'einem anderen Inhaber entfernen lassen.',
    );
  }

  await deps.members.removeMember(handelnde.dealerId as string, userId);
}

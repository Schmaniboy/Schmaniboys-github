import type { Principal } from '../auth/access';
import { requireSameDealer } from '../auth/access';
import { errors } from '../errors';
import { dealerProfileInput, openingHoursInput } from '../dealer/schemas';
import { uhrzeitZuMinuten, pruefeZeitspannen, type Zeitspanne } from '../dealer/opening-hours';
import { parseOrThrow } from '../validation/common';

export interface DealerProfileRepository {
  findDealer(dealerId: string): Promise<unknown | null>;
  updateDealerProfile(dealerId: string, data: Record<string, unknown>): Promise<unknown>;
  replaceOpeningHours(dealerId: string, spannen: Zeitspanne[]): Promise<void>;
}

export interface DealerProfileDeps {
  dealers: DealerProfileRepository;
}

export async function readDealerProfile(
  deps: DealerProfileDeps,
  principal: Principal | null,
) {
  const admin = requireSameDealer(principal, principal?.dealerId);
  const haendler = await deps.dealers.findDealer(admin.dealerId as string);
  if (!haendler) throw errors.notFound();
  return haendler;
}

export async function updateDealerProfileUseCase(
  deps: DealerProfileDeps,
  principal: Principal | null,
  rawInput: unknown,
) {
  const admin = requireSameDealer(principal, principal?.dealerId);
  const eingabe = parseOrThrow(dealerProfileInput, rawInput);
  return deps.dealers.updateDealerProfile(admin.dealerId as string, eingabe);
}

export async function setOpeningHours(
  deps: DealerProfileDeps,
  principal: Principal | null,
  rawInput: unknown,
) {
  const admin = requireSameDealer(principal, principal?.dealerId);
  const { spannen } = parseOrThrow(openingHoursInput, rawInput);

  const umgerechnet = spannen.map((spanne) => {
    const von = uhrzeitZuMinuten(spanne.von);
    const bis = uhrzeitZuMinuten(spanne.bis);
    if (von === null || bis === null) {
      throw errors.validation({ spannen: ['Bitte Uhrzeiten im Format 08:30 angeben.'] });
    }
    return { weekday: spanne.weekday, opensMinute: von, closesMinute: bis };
  });

  pruefeZeitspannen(umgerechnet);
  await deps.dealers.replaceOpeningHours(admin.dealerId as string, umgerechnet);

  const haendler = await deps.dealers.findDealer(admin.dealerId as string);
  return { openingHours: (haendler as { openingHours?: unknown[] } | null)?.openingHours ?? [] };
}

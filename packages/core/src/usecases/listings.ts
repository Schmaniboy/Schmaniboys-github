import type { Clock } from '../ports/clock';
import type { Principal } from '../auth/access';
import { errors } from '../errors';
import {
  assertListingTransition,
  ablaufDatum,
  type ListingStatus,
} from '../marketplace/status';
import { istOeffentlichSichtbar } from '../marketplace/status';
import {
  listingStatusInput,
  createListingInput,
  updateListingInput,
  type ListingSearchInput,
} from '../marketplace/schemas';
import { parseOrThrow } from '../validation/common';

export interface ListingRepository {
  findOwnListing(listingId: string, sellerId: string): Promise<{ status: string; [k: string]: unknown } | null>;
  listOwnListings(sellerId: string): Promise<unknown[]>;
  updateOwnListing(listingId: string, sellerId: string, data: Record<string, unknown>): Promise<unknown>;
  setListingStatus(
    listingId: string,
    sellerId: string,
    status: ListingStatus,
    zeiten: { jetzt: Date; expiresAt: Date | null },
  ): Promise<unknown>;
  searchListings(filter: ListingSearchInput, jetzt: Date): Promise<unknown>;
  createListingFromDraft(input: {
    draftId: string;
    sellerId: string;
    dealerId: string | null;
    title: string;
    description: string;
    priceCents: number;
    negotiable: boolean;
    postalCode: string;
    city: string;
  }): Promise<unknown>;
  findListingVisibility(listingId: string): Promise<{ status: ListingStatus; expiresAt: Date | null } | null>;
  addFavorite(userId: string, listingId: string): Promise<void>;
  removeFavorite(userId: string, listingId: string): Promise<void>;
}

export interface ListingDeps {
  listings: ListingRepository;
  clock: Clock;
}

export async function readOwnListing(deps: ListingDeps, listingId: string, userId: string) {
  const anzeige = await deps.listings.findOwnListing(listingId, userId);
  if (!anzeige) throw errors.notFound();
  return anzeige;
}

export async function updateListing(
  deps: ListingDeps,
  listingId: string,
  userId: string,
  rawInput: unknown,
) {
  const daten = parseOrThrow(updateListingInput, rawInput);
  return deps.listings.updateOwnListing(listingId, userId, daten);
}

export async function changeListingStatus(
  deps: ListingDeps,
  listingId: string,
  userId: string,
  rawInput: unknown,
) {
  const { status } = parseOrThrow(listingStatusInput, rawInput);

  const anzeige = await deps.listings.findOwnListing(listingId, userId);
  if (!anzeige) throw errors.notFound();

  assertListingTransition(anzeige.status as ListingStatus, status);

  const jetzt = deps.clock.now();
  return deps.listings.setListingStatus(listingId, userId, status, {
    jetzt,
    expiresAt: status === 'ACTIVE' ? ablaufDatum(jetzt) : null,
  });
}

export async function searchPublicListings(deps: ListingDeps, filter: ListingSearchInput) {
  return deps.listings.searchListings(filter, deps.clock.now());
}

export async function createListing(
  deps: ListingDeps,
  principal: Principal | null,
  rawInput: unknown,
) {
  if (!principal) throw errors.unauthenticated();
  const eingabe = parseOrThrow(createListingInput, rawInput);

  const dealerId =
    eingabe.dealerId && eingabe.dealerId === principal.dealerId
      ? eingabe.dealerId
      : null;

  return deps.listings.createListingFromDraft({
    draftId: eingabe.draftId,
    sellerId: principal.userId,
    dealerId,
    title: eingabe.title,
    description: eingabe.description,
    priceCents: eingabe.priceCents,
    negotiable: eingabe.negotiable,
    postalCode: eingabe.postalCode,
    city: eingabe.city,
  });
}

export async function addListingFavorite(
  deps: ListingDeps,
  userId: string,
  listingId: string,
) {
  const anzeige = await deps.listings.findListingVisibility(listingId);
  if (!anzeige || !istOeffentlichSichtbar(anzeige, deps.clock.now())) {
    throw errors.notFound();
  }
  await deps.listings.addFavorite(userId, listingId);
  return { gemerkt: true };
}

export async function removeListingFavorite(
  deps: ListingDeps,
  userId: string,
  listingId: string,
) {
  await deps.listings.removeFavorite(userId, listingId);
}

import { createHash } from "node:crypto";

export type Itinerary = {
  destination: string;
  dates: { start: string; end: string };
  days: Array<{ date: string; stops: Array<{ name: string; note?: string }> }>;
};

/** Stable JSON for hashing. Keep the schema small and explicit. */
export function canonicalItinerary(itinerary: Itinerary): string {
  return JSON.stringify(itinerary);
}

export function itineraryHash(itinerary: Itinerary): Uint8Array {
  return new Uint8Array(
    createHash("sha256").update(canonicalItinerary(itinerary), "utf8").digest(),
  );
}

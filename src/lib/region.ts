import { PARTIES, type Party, type PartyId, type Region } from "@/data";

export const REGIONS: { id: Region; label: string }[] = [
  { id: "england", label: "England" },
  { id: "scotland", label: "Scotland" },
  { id: "wales", label: "Wales" },
  { id: "ni", label: "Northern Ireland" },
];

export const REGION_LABEL: Record<Region, string> = {
  england: "England",
  scotland: "Scotland",
  wales: "Wales",
  ni: "Northern Ireland",
};

/** Returns party ids standing in `region`, or all party ids when `region` is null. */
export function partiesForRegion(region: Region | null): PartyId[] {
  const all = Object.values(PARTIES) as Party[];
  if (region === null) return all.map((p) => p.id);
  return all.filter((p) => p.standingIn.includes(region)).map((p) => p.id);
}

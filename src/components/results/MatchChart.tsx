"use client";

import type { PartyMatch } from "@/lib/scoring";
import type { Party, PartyId } from "@/data";

interface Props {
  matches: PartyMatch[];
  parties: Record<PartyId, Party>;
}

export function MatchChart({ matches, parties }: Props) {
  const ranked = [...matches].sort((a, b) => (b.match ?? -1) - (a.match ?? -1));
  return (
    <ul className="space-y-3">
      {ranked.map((m) => {
        const party = parties[m.partyId];
        const pct = m.match ?? 0;
        return (
          <li key={m.partyId}>
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-medium">{party.shortName}</span>
              <span className="tabular-nums text-sm text-[var(--color-muted)]">
                {m.match === null ? "—" : `${Math.round(pct)}%`}
                <span className="ml-2 text-xs">
                  ({m.answeredCount}/{m.totalStated} statements)
                </span>
              </span>
            </div>
            <div className="h-3 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                role="img"
                aria-label={`${party.shortName} match: ${m.match === null ? "no overlap" : `${Math.round(pct)} percent`}`}
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%`, background: party.colour }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

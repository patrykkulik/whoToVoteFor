"use client";

import { useSurvey } from "@/lib/store";
import { REGIONS, REGION_LABEL } from "@/lib/region";
import type { Region } from "@/data";

interface Props {
  className?: string;
}

export function RegionPicker({ className = "" }: Props) {
  const region = useSurvey((s) => s.region);
  const setRegion = useSurvey((s) => s.setRegion);

  const options: { id: Region | null; label: string }[] = [
    { id: null, label: "All of Great Britain" },
    ...REGIONS.map((r) => ({ id: r.id, label: REGION_LABEL[r.id] })),
  ];

  return (
    <div className={className}>
      <label htmlFor="region-select" className="block text-sm font-medium mb-2">
        Where are you voting?
      </label>
      <select
        id="region-select"
        value={region ?? ""}
        onChange={(e) => setRegion((e.target.value || null) as Region | null)}
        className="w-full sm:w-auto h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-fg)]"
      >
        {options.map((o) => (
          <option key={o.id ?? "all"} value={o.id ?? ""}>
            {o.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-[var(--color-muted)] mt-2">
        We&apos;ll only show parties standing in your area.
      </p>
    </div>
  );
}

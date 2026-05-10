import { Info } from "lucide-react";

export function ScopeBanner() {
  return (
    <div className="rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-border)] p-4 text-sm flex gap-3">
      <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
      <div>
        <strong>Scope of v1:</strong> the survey covers Labour, Conservative,
        Liberal Democrats, Green, Reform UK and SNP. Plaid Cymru and Northern
        Ireland parties are not yet included. Stance summaries in this dataset
        are hand-curated based on the parties&apos; published 2024 manifestos
        and will be replaced over time with verbatim, page-cited quotes via the{" "}
        automated pipeline (see <a href="/about">About</a>).
      </div>
    </div>
  );
}

import { HydrationGate } from "@/components/HydrationGate";
import { SurveyShell } from "@/components/survey/SurveyShell";

export const dynamic = "force-static";

export default function SurveyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
      <HydrationGate fallback={<SurveyLoading />}>
        <SurveyShell />
      </HydrationGate>
    </div>
  );
}

function SurveyLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-1.5 w-full bg-[var(--color-border)] rounded" />
      <div className="h-64 w-full bg-[var(--color-border)]/40 rounded-2xl" />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/lib/store";
import { PARTIES, STATEMENTS } from "@/data";
import { rank, scoreParties } from "@/lib/scoring";
import { partiesForRegion, REGION_LABEL } from "@/lib/region";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MatchChart } from "@/components/results/MatchChart";
import { TopicBreakdown } from "@/components/results/TopicBreakdown";
import { HydrationGate } from "@/components/HydrationGate";
import { ScopeBanner } from "@/components/ScopeBanner";
import { RegionPicker } from "@/components/RegionPicker";

export const dynamic = "force-static";

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <HydrationGate fallback={<p className="text-[var(--color-muted)]">Loading your results…</p>}>
        <ResultsContent />
      </HydrationGate>
    </div>
  );
}

function ResultsContent() {
  const router = useRouter();
  const answers = useSurvey((s) => s.answers);
  const weights = useSurvey((s) => s.weights);
  const region = useSurvey((s) => s.region);
  const reset = useSurvey((s) => s.reset);

  const partyIds = useMemo(() => partiesForRegion(region), [region]);

  const matches = useMemo(
    () => rank(scoreParties(STATEMENTS, partyIds, answers, weights)),
    [answers, weights, partyIds],
  );

  const answeredCount = Object.values(answers).filter(
    (a) => a !== null && a !== undefined,
  ).length;

  if (answeredCount === 0) {
    return (
      <div className="space-y-6 text-center py-10">
        <h1 className="font-display text-3xl">No answers yet</h1>
        <p className="text-[var(--color-muted)]">
          Complete the survey to see your party matches.
        </p>
        <Link href="/survey">
          <Button>Take the survey</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-[var(--color-muted)]">
          Your results
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">
          Your views align most with…
        </h1>
        <p className="text-[var(--color-muted)]">
          Based on {answeredCount} answer{answeredCount === 1 ? "" : "s"}. The
          percentage shows how closely each party&apos;s manifesto matches your
          views, weighted by the topics you marked as important.
        </p>
      </header>

      <Card className="p-6">
        {partyIds.length === 0 ? (
          <div className="text-sm">
            <p className="font-medium mb-1">
              No supported parties for {region ? REGION_LABEL[region] : "this region"} yet.
            </p>
            <p className="text-[var(--color-muted)]">
              v1 of WhoToVoteFor doesn&apos;t yet cover the parties contesting
              Northern Ireland seats. Choose a different region to see how your
              answers compare to the parties currently in the dataset.
            </p>
            <div className="mt-4">
              <RegionPicker />
            </div>
          </div>
        ) : (
          <>
            <MatchChart matches={matches} parties={PARTIES} />
            <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
              <RegionPicker />
            </div>
          </>
        )}
      </Card>

      <ScopeBanner />

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Topic breakdown</h2>
          <Link href="/parties" className="text-sm">
            Browse all party stances →
          </Link>
        </div>
        <TopicBreakdown answers={answers} />
      </section>

      <div className="flex flex-wrap gap-3 pt-4">
        <Link href="/survey">
          <Button variant="secondary">Review my answers</Button>
        </Link>
        <Button
          variant="ghost"
          onClick={() => {
            reset();
            router.push("/survey");
          }}
        >
          Start again
        </Button>
      </div>
    </div>
  );
}

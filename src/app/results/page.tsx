"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/lib/store";
import { PARTIES, STATEMENTS, TOPICS, type TopicId } from "@/data";
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
  const mode = useSurvey((s) => s.mode);
  const resetSurvey = useSurvey((s) => s.resetSurvey);
  const reviewAnswers = useSurvey((s) => s.reviewAnswers);

  const partyIds = useMemo(() => partiesForRegion(region), [region]);
  const effectiveMode = mode ?? "full";

  const matches = useMemo(
    () => rank(scoreParties(STATEMENTS, partyIds, answers, weights, effectiveMode)),
    [answers, weights, partyIds, effectiveMode],
  );

  const answeredCount = Object.values(answers).filter(
    (a) => a !== null && a !== undefined,
  ).length;

  const skippedTopicCount =
    effectiveMode === "focused"
      ? (Object.keys(TOPICS) as TopicId[]).filter((id) => weights[id] === "skip").length
      : 0;

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
        {effectiveMode === "focused" && skippedTopicCount > 0 && (
          <p className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]">
            Focused survey · {skippedTopicCount} topic
            {skippedTopicCount === 1 ? "" : "s"} skipped
          </p>
        )}
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
        <Button
          onClick={() => {
            resetSurvey();
            router.push("/survey");
          }}
        >
          Take another survey
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            reviewAnswers();
            router.push("/survey");
          }}
        >
          Review my answers
        </Button>
      </div>
    </div>
  );
}

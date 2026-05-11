import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LandingResetEffect } from "@/components/LandingResetEffect";
import { ScopeBanner } from "@/components/ScopeBanner";
import { ELECTION_YEAR, STATEMENTS, TOPICS } from "@/data";
import { ArrowRight, Lock, ListChecks, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const topicCount = Object.keys(TOPICS).length;
  const statementCount = STATEMENTS.length;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <LandingResetEffect />
      <section className="text-center">
        <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">
          UK General Election {ELECTION_YEAR}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-5">
          Who should you vote for?
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-xl mx-auto mb-8">
          Answer {statementCount} short policy statements. We&apos;ll match your
          views to the parties&apos; manifestos. Takes about five minutes.
        </p>
        <Link href="/survey">
          <Button size="lg">
            Start the survey <ArrowRight className="w-4 h-4" aria-hidden />
          </Button>
        </Link>
        <p className="text-xs text-[var(--color-muted)] mt-4">
          No accounts. No tracking. Your answers stay on your device.
        </p>
      </section>

      <section className="mt-16 grid sm:grid-cols-3 gap-4">
        <FeatureCard icon={<ListChecks className="w-5 h-5" />} title={`${topicCount} topics`}>
          From the NHS to the constitution — covering the issues most likely to shape your vote.
        </FeatureCard>
        <FeatureCard icon={<BarChart3 className="w-5 h-5" />} title="Honest scoring">
          Weighted by what matters to you. Parties that don&apos;t address a topic aren&apos;t penalised.
        </FeatureCard>
        <FeatureCard icon={<Lock className="w-5 h-5" />} title="Private by design">
          No backend. No cookies. Everything runs in your browser.
        </FeatureCard>
      </section>

      <section className="mt-12">
        <ScopeBanner />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl mb-5">How it works</h2>
        <ol className="space-y-4">
          {[
            ["Pick what matters", "Mark each policy topic as low, medium or high importance — or skip topics you'd rather not answer."],
            ["Answer the statements", "For each one, say how much you agree or disagree."],
            ["See your matches", "We rank each party by how closely their manifesto aligns with you."],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4">
              <span
                aria-hidden
                className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] grid place-items-center text-sm font-semibold"
              >
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-[var(--color-muted)] text-sm">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="text-[var(--color-accent)] mb-3">{icon}</div>
      <p className="font-medium mb-1">{title}</p>
      <p className="text-sm text-[var(--color-muted)]">{children}</p>
    </Card>
  );
}

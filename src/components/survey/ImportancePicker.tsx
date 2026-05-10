"use client";

import { TOPICS, type TopicId } from "@/data";
import { useSurvey } from "@/lib/store";
import type { Importance } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScopeBanner } from "@/components/ScopeBanner";
import { RegionPicker } from "@/components/RegionPicker";

const OPTIONS: { value: Importance; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function ImportancePicker() {
  const weights = useSurvey((s) => s.weights);
  const setImportance = useSurvey((s) => s.setImportance);
  const setPhase = useSurvey((s) => s.setPhase);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl mb-2">What matters to you?</h1>
        <p className="text-[var(--color-muted)]">
          Mark each topic as low, medium or high importance. We&apos;ll weight
          your matches accordingly. (Default is medium.)
        </p>
      </header>

      <ScopeBanner />

      <Card className="p-5">
        <RegionPicker />
      </Card>

      <ul className="space-y-3">
        {Object.values(TOPICS).map((topic) => {
          const current = weights[topic.id as TopicId] ?? "medium";
          return (
            <li key={topic.id}>
              <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <p className="font-medium">{topic.label}</p>
                  <p className="text-sm text-[var(--color-muted)]">{topic.blurb}</p>
                </div>
                <div
                  role="radiogroup"
                  aria-label={`Importance of ${topic.label}`}
                  className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden self-start sm:self-auto"
                >
                  {OPTIONS.map((opt) => {
                    const selected = current === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setImportance(topic.id as TopicId, opt.value)}
                        className={`px-3 h-9 text-sm transition-colors ${
                          selected
                            ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                            : "bg-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => setPhase("questions")}>
          Begin
        </Button>
      </div>
    </div>
  );
}

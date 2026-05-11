"use client";

import { STATEMENTS, TOPICS, type TopicId } from "@/data";
import { useSurvey } from "@/lib/store";
import { activeStatementsFor, type Importance } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScopeBanner } from "@/components/ScopeBanner";
import { RegionPicker } from "@/components/RegionPicker";

const OPTIONS: { value: Importance; label: string }[] = [
  { value: "skip", label: "Skip" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function ImportancePicker() {
  const weights = useSurvey((s) => s.weights);
  const setImportance = useSurvey((s) => s.setImportance);
  const beginSurvey = useSurvey((s) => s.beginSurvey);

  const allTopics = Object.values(TOPICS);
  const skippedCount = allTopics.filter((t) => weights[t.id as TopicId] === "skip").length;
  const allSkipped = skippedCount === allTopics.length;
  const noneSkipped = skippedCount === 0;

  const focusedDisabled = noneSkipped || allSkipped;
  const focusedHint = noneSkipped
    ? "Mark a topic as Skip to focus the survey."
    : allSkipped
      ? "Un-skip at least one topic to continue."
      : null;

  const onBegin = (mode: "full" | "focused") => {
    const ids = activeStatementsFor(STATEMENTS, weights, mode).map((s) => s.id);
    beginSurvey(mode, ids);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl mb-2">What matters to you?</h1>
        <p className="text-[var(--color-muted)]">
          Mark each topic as low, medium or high importance — or Skip to leave
          it out of a focused survey. (Default is medium.)
        </p>
      </header>

      <ScopeBanner />

      <Card className="p-5">
        <RegionPicker />
      </Card>

      <ul className="space-y-3">
        {allTopics.map((topic) => {
          const current = weights[topic.id as TopicId] ?? "medium";
          const isSkipped = current === "skip";
          return (
            <li key={topic.id}>
              <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isSkipped ? "line-through text-[var(--color-muted)]" : ""
                    }`}
                  >
                    {topic.label}
                  </p>
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

      <div className="space-y-3">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <div className="flex flex-col items-stretch sm:items-end gap-1">
            <Button
              size="lg"
              variant="secondary"
              disabled={focusedDisabled}
              onClick={() => onBegin("focused")}
            >
              Take focused survey
            </Button>
            <p className="text-xs text-[var(--color-muted)] sm:text-right">
              {focusedHint ?? `Skips ${skippedCount} topic${skippedCount === 1 ? "" : "s"}.`}
            </p>
          </div>
          <div className="flex flex-col items-stretch sm:items-end gap-1">
            <Button size="lg" onClick={() => onBegin("full")}>
              Take full survey
            </Button>
            <p className="text-xs text-[var(--color-muted)] sm:text-right">
              Answer every statement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


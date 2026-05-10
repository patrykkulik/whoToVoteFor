"use client";

import type { Statement } from "@/data";
import type { AnswerScore } from "@/lib/scoring";
import { Card } from "@/components/ui/Card";

const SCALE: { value: AnswerScore; label: string; short: string }[] = [
  { value: -2, label: "Strongly disagree", short: "1" },
  { value: -1, label: "Disagree", short: "2" },
  { value: 0, label: "Neutral", short: "3" },
  { value: 1, label: "Agree", short: "4" },
  { value: 2, label: "Strongly agree", short: "5" },
];

interface Props {
  statement: Statement;
  topicLabel: string;
  current?: AnswerScore | null;
  onAnswer: (value: AnswerScore) => void;
}

export function QuestionCard({ statement, topicLabel, current, onAnswer }: Props) {
  return (
    <Card className="p-7 sm:p-9">
      <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] mb-3">
        {topicLabel}
      </p>
      <h2 className="font-display text-2xl sm:text-[1.75rem] leading-snug mb-7">
        {statement.text}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2" role="radiogroup" aria-label="Your view">
        {SCALE.map((s) => {
          const selected = current === s.value;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onAnswer(s.value)}
              className={`h-14 rounded-lg text-sm font-medium border transition-colors px-3 text-left sm:text-center ${
                selected
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] border-[var(--color-accent)]"
                  : "bg-[var(--color-card)] border-[var(--color-border)] hover:bg-[var(--color-accent-soft)]"
              }`}
            >
              <span className="hidden sm:inline-block opacity-50 text-xs mr-1">
                {s.short}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[var(--color-muted)] mt-4">
        Use keys 1–5 to answer · ← back · → skip
      </p>
    </Card>
  );
}

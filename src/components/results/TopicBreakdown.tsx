"use client";

import type { Answers } from "@/lib/scoring";
import { STATEMENTS, TOPICS, PARTIES, type TopicId, type PartyId } from "@/data";
import { Card } from "@/components/ui/Card";

interface Props {
  answers: Answers;
}

const SCORE_LABEL: Record<number, string> = {
  [-2]: "Strongly disagrees",
  [-1]: "Disagrees",
  [0]: "Neutral",
  [1]: "Agrees",
  [2]: "Strongly agrees",
};

const USER_LABEL: Record<number, string> = {
  [-2]: "You strongly disagreed",
  [-1]: "You disagreed",
  [0]: "You were neutral",
  [1]: "You agreed",
  [2]: "You strongly agreed",
};

export function TopicBreakdown({ answers }: Props) {
  const topicIds = Object.keys(TOPICS) as TopicId[];

  return (
    <div className="space-y-3">
      {topicIds.map((topicId) => {
        const topic = TOPICS[topicId];
        const topicStatements = STATEMENTS.filter((s) => s.topic === topicId);
        const answered = topicStatements.filter((s) => {
          const a = answers[s.id];
          return a !== null && a !== undefined;
        });
        if (answered.length === 0) return null;

        return (
          <details
            key={topicId}
            className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden"
          >
            <summary className="cursor-pointer list-none p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{topic.label}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {answered.length} of {topicStatements.length} answered
                </p>
              </div>
              <span
                aria-hidden
                className="text-[var(--color-muted)] text-sm group-open:rotate-180 transition-transform"
              >
                ▾
              </span>
            </summary>
            <div className="px-4 pb-4 space-y-5 border-t border-[var(--color-border)] pt-4">
              {answered.map((statement) => {
                const userAnswer = answers[statement.id]!;
                return (
                  <div key={statement.id}>
                    <p className="font-medium text-sm mb-1">
                      &ldquo;{statement.text}&rdquo;
                    </p>
                    <p className="text-xs text-[var(--color-muted)] mb-3">
                      {USER_LABEL[userAnswer]}
                    </p>
                    <ul className="space-y-1.5">
                      {(Object.keys(PARTIES) as PartyId[]).map((partyId) => {
                        const stance = statement.stances[partyId];
                        const party = PARTIES[partyId];
                        if (!stance) return null;
                        const text =
                          stance.kind === "stated"
                            ? `${SCORE_LABEL[stance.score]} — ${stance.citations[0].quote}`
                            : `No stated position${stance.note ? ` — ${stance.note}` : ""}`;
                        return (
                          <li key={partyId} className="flex gap-3 text-sm">
                            <span
                              aria-hidden
                              className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                              style={{ background: party.colour }}
                            />
                            <span>
                              <span className="font-medium">{party.shortName}: </span>
                              <span className="text-[var(--color-muted)]">{text}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}

export default TopicBreakdown;

import type { PartyId, Statement, TopicId } from "@/data";

export const IMPORTANCE_WEIGHTS = { low: 1, medium: 2, high: 3 } as const;
export type Importance = keyof typeof IMPORTANCE_WEIGHTS;

export type AnswerScore = -2 | -1 | 0 | 1 | 2;
/** User's answer per statement id; missing key or `null` = skipped. */
export type Answers = Record<string, AnswerScore | null | undefined>;
export type Weights = Partial<Record<TopicId, Importance>>;

export interface PartyMatch {
  partyId: PartyId;
  /** 0..100, or null if no overlap with the user's answers. */
  match: number | null;
  answeredCount: number;
  totalStated: number;
}

const ANSWER_RANGE = 4; // |a - s| max when both in {-2..2}

/**
 * Pure scoring function. See DESIGN.md "Scoring Algorithm" section.
 */
export function scoreParties(
  statements: readonly Statement[],
  partyIds: readonly PartyId[],
  answers: Answers,
  weights: Weights,
): PartyMatch[] {
  return partyIds.map((partyId) => {
    let numerator = 0;
    let denominator = 0;
    let answered = 0;
    let totalStated = 0;

    for (const statement of statements) {
      const stance = statement.stances[partyId];
      if (!stance || stance.kind !== "stated") continue;
      totalStated += 1;

      const answer = answers[statement.id];
      if (answer === null || answer === undefined) continue;

      const importance = weights[statement.topic] ?? "medium";
      const weight = IMPORTANCE_WEIGHTS[importance];

      numerator += weight * (ANSWER_RANGE - Math.abs(answer - stance.score));
      denominator += weight * ANSWER_RANGE;
      answered += 1;
    }

    return {
      partyId,
      match: denominator === 0 ? null : (numerator / denominator) * 100,
      answeredCount: answered,
      totalStated,
    };
  });
}

export function rank(matches: PartyMatch[]): PartyMatch[] {
  return [...matches].sort((a, b) => {
    if (a.match === null && b.match === null) return 0;
    if (a.match === null) return 1;
    if (b.match === null) return -1;
    return b.match - a.match;
  });
}

import type { PartyId, Statement, TopicId } from "@/data";

export const IMPORTANCE_WEIGHTS = { low: 1, medium: 2, high: 3 } as const;
/**
 * `"skip"` is intentionally not a key in IMPORTANCE_WEIGHTS — it's a
 * topic-inclusion flag, resolved to a numeric weight (or excluded) at
 * scoring time via `scoringWeight()`. This keeps "include" and "weight"
 * orthogonal at the type level.
 */
export type Importance = "skip" | "low" | "medium" | "high";

export type SurveyMode = "full" | "focused";

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
 * Resolves a (possibly skipped/undefined) topic importance to a scoring
 * weight key, or `null` to mean "exclude this statement from scoring".
 *
 * - Undefined → `"medium"` (the picker default).
 * - `"skip"` in focused mode → `null` (excluded).
 * - `"skip"` in full mode → `"low"` (the user marked it as least important
 *   but elected to answer everything; preserve that signal at scoring time
 *   without mutating their persisted weights).
 */
export function scoringWeight(
  raw: Importance | undefined,
  mode: SurveyMode,
): "low" | "medium" | "high" | null {
  const r = raw ?? "medium";
  if (r !== "skip") return r;
  return mode === "full" ? "low" : null;
}

/**
 * Returns the statements asked in a given mode. In `"full"` mode this is
 * every statement; in `"focused"` mode, statements whose topic is marked
 * `"skip"` are excluded.
 */
export function activeStatementsFor(
  statements: readonly Statement[],
  weights: Weights,
  mode: SurveyMode,
): Statement[] {
  if (mode === "full") return [...statements];
  return statements.filter((s) => (weights[s.topic] ?? "medium") !== "skip");
}

/**
 * Pure scoring function. See DESIGN.md "Scoring Algorithm" section.
 *
 * `mode` defaults to `"full"` so existing callers and tests continue to
 * compile. In `"focused"` mode, topics marked `"skip"` are excluded from
 * both numerator and denominator even if a stale answer exists.
 */
export function scoreParties(
  statements: readonly Statement[],
  partyIds: readonly PartyId[],
  answers: Answers,
  weights: Weights,
  mode: SurveyMode = "full",
): PartyMatch[] {
  return partyIds.map((partyId) => {
    let numerator = 0;
    let denominator = 0;
    let answered = 0;
    let totalStated = 0;

    for (const statement of statements) {
      const stance = statement.stances[partyId];
      if (!stance || stance.kind !== "stated") continue;

      const weightKey = scoringWeight(weights[statement.topic], mode);
      if (weightKey === null) continue;

      totalStated += 1;

      const answer = answers[statement.id];
      if (answer === null || answer === undefined) continue;

      const weight = IMPORTANCE_WEIGHTS[weightKey];

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

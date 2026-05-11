import { describe, expect, it } from "vitest";
import {
  scoreParties,
  rank,
  scoringWeight,
  activeStatementsFor,
  type Answers,
  type Weights,
} from "./scoring";
import type { PartyId, Statement } from "@/data";

const mkStatement = (
  id: string,
  topic: Statement["topic"],
  scores: Partial<Record<PartyId, number | "u">>,
): Statement => ({
  id,
  topic,
  text: id,
  stances: Object.fromEntries(
    Object.entries(scores).map(([p, v]) => [
      p,
      v === "u"
        ? { kind: "unstated", source: "curated" as const }
        : {
            kind: "stated" as const,
            score: v as -2 | -1 | 0 | 1 | 2,
            citations: [{ quote: "x", printedPage: 0, pdfPage: 0 }],
            confidence: 1,
            source: "curated" as const,
          },
    ]),
  ) as Statement["stances"],
});

const PARTIES: PartyId[] = ["labour", "conservative"];

describe("scoreParties", () => {
  it("returns 100% for perfect agreement", () => {
    const statements = [mkStatement("a", "nhs", { labour: 2 })];
    const answers: Answers = { a: 2 };
    const [labour] = scoreParties(statements, ["labour"], answers, {});
    expect(labour.match).toBe(100);
    expect(labour.answeredCount).toBe(1);
  });

  it("returns 0% for perfect disagreement", () => {
    const statements = [mkStatement("a", "nhs", { labour: 2 })];
    const answers: Answers = { a: -2 };
    const [labour] = scoreParties(statements, ["labour"], answers, {});
    expect(labour.match).toBe(0);
  });

  it("returns 50% for orthogonal answers", () => {
    const statements = [mkStatement("a", "nhs", { labour: 2 })];
    const answers: Answers = { a: 0 };
    const [labour] = scoreParties(statements, ["labour"], answers, {});
    expect(labour.match).toBe(50);
  });

  it("excludes skipped questions from numerator and denominator", () => {
    const statements = [
      mkStatement("a", "nhs", { labour: 2 }),
      mkStatement("b", "nhs", { labour: -2 }),
    ];
    const answers: Answers = { a: 2, b: null };
    const [labour] = scoreParties(statements, ["labour"], answers, {});
    expect(labour.match).toBe(100);
    expect(labour.answeredCount).toBe(1);
    expect(labour.totalStated).toBe(2);
  });

  it("excludes unstated stances per-party (asymmetric Q_p)", () => {
    const statements = [
      mkStatement("a", "nhs", { labour: 2, conservative: -2 }),
      mkStatement("b", "nhs", { labour: 2, conservative: "u" }),
    ];
    const answers: Answers = { a: 2, b: -2 };
    const [labour, conservative] = scoreParties(statements, PARTIES, answers, {});
    // Labour: a perfect (100%, weight 2*4=8), b perfect-disagree (0%, weight 2*4=8) -> 50%
    expect(labour.match).toBe(50);
    // Conservative: only `a` counts (perfect-disagree with answer +2) -> 0%
    expect(conservative.match).toBe(0);
    expect(conservative.totalStated).toBe(1);
  });

  it("returns null when there's no overlap with stated stances", () => {
    const statements = [mkStatement("a", "nhs", { labour: "u" })];
    const answers: Answers = { a: 2 };
    const [labour] = scoreParties(statements, ["labour"], answers, {});
    expect(labour.match).toBeNull();
  });

  it("weights high-importance topics more than low", () => {
    const statements = [
      mkStatement("hi", "nhs", { labour: 2 }),
      mkStatement("lo", "economy", { labour: -2 }),
    ];
    const answers: Answers = { hi: 2, lo: 2 };
    const weights: Weights = { nhs: "high", economy: "low" };
    const [labour] = scoreParties(statements, ["labour"], answers, weights);
    // num = 3*4 + 1*0 = 12; den = 3*4 + 1*4 = 16 -> 75%
    expect(labour.match).toBe(75);
  });

  it("rank() puts nulls last", () => {
    const matches = [
      { partyId: "labour" as PartyId, match: null, answeredCount: 0, totalStated: 0 },
      { partyId: "conservative" as PartyId, match: 30, answeredCount: 1, totalStated: 1 },
      { partyId: "libdem" as PartyId, match: 80, answeredCount: 1, totalStated: 1 },
    ];
    const r = rank(matches);
    expect(r.map((m) => m.partyId)).toEqual(["libdem", "conservative", "labour"]);
  });
});

describe("scoringWeight", () => {
  it("defaults undefined to medium in either mode", () => {
    expect(scoringWeight(undefined, "full")).toBe("medium");
    expect(scoringWeight(undefined, "focused")).toBe("medium");
  });
  it("passes low/medium/high through unchanged", () => {
    for (const m of ["full", "focused"] as const) {
      expect(scoringWeight("low", m)).toBe("low");
      expect(scoringWeight("medium", m)).toBe("medium");
      expect(scoringWeight("high", m)).toBe("high");
    }
  });
  it("maps skip → low in full mode and null in focused mode", () => {
    expect(scoringWeight("skip", "full")).toBe("low");
    expect(scoringWeight("skip", "focused")).toBeNull();
  });
});

describe("activeStatementsFor", () => {
  const statements = [
    mkStatement("a", "nhs", { labour: 1 }),
    mkStatement("b", "economy", { labour: 1 }),
    mkStatement("c", "housing", { labour: 1 }),
  ];

  it("returns all statements in full mode regardless of weights", () => {
    expect(activeStatementsFor(statements, { nhs: "skip" }, "full")).toHaveLength(3);
  });
  it("drops skipped-topic statements in focused mode", () => {
    const out = activeStatementsFor(statements, { nhs: "skip", economy: "high" }, "focused");
    expect(out.map((s) => s.id)).toEqual(["b", "c"]);
  });
  it("treats undefined weights as medium (kept) in focused mode", () => {
    expect(activeStatementsFor(statements, {}, "focused")).toHaveLength(3);
  });
  it("returns empty array when all topics are skipped in focused mode", () => {
    const out = activeStatementsFor(
      statements,
      { nhs: "skip", economy: "skip", housing: "skip" },
      "focused",
    );
    expect(out).toEqual([]);
  });
});

describe("scoreParties + mode", () => {
  it("defaults mode to full when omitted (back-compat)", () => {
    const statements = [mkStatement("a", "nhs", { labour: 2 })];
    const [labour] = scoreParties(statements, ["labour"], { a: 2 }, { nhs: "skip" });
    // skip → low at scoring time, perfect agreement still 100%
    expect(labour.match).toBe(100);
  });

  it("excludes skip-topic statements in focused mode even with stale answers", () => {
    const statements = [
      mkStatement("a", "nhs", { labour: 2 }),
      mkStatement("b", "economy", { labour: 2 }),
    ];
    // Stale answer on "a" (its topic is skip) must not affect scoring.
    const answers: Answers = { a: -2, b: 2 };
    const [labour] = scoreParties(
      statements,
      ["labour"],
      answers,
      { nhs: "skip", economy: "high" },
      "focused",
    );
    expect(labour.match).toBe(100);
    expect(labour.answeredCount).toBe(1);
    expect(labour.totalStated).toBe(1);
  });

  it("treats skip as low weight in full mode (relative weighting preserved)", () => {
    const statements = [
      mkStatement("hi", "nhs", { labour: 2 }),
      mkStatement("sk", "economy", { labour: -2 }),
    ];
    // Both answered +2. nhs=high (3*4=12 weight), economy=skip→low (1*4=4 weight).
    // num = 3*4 + 1*0 = 12; den = 12 + 4 = 16 → 75%.
    const [labour] = scoreParties(
      statements,
      ["labour"],
      { hi: 2, sk: 2 },
      { nhs: "high", economy: "skip" },
      "full",
    );
    expect(labour.match).toBe(75);
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import { useSurvey } from "./store";

const seedDone = () => {
  useSurvey.setState({
    phase: "done",
    region: "scotland",
    weights: { economy: "high" },
    answers: { s1: 2, s2: -1 },
    currentIndex: 5,
  });
};

describe("survey store", () => {
  beforeEach(() => {
    useSurvey.setState({
      phase: "importance",
      region: null,
      weights: {},
      answers: {},
      currentIndex: 0,
    });
  });

  it("resetSurvey wipes progress but preserves region", () => {
    seedDone();
    useSurvey.getState().resetSurvey();
    const s = useSurvey.getState();
    expect(s.phase).toBe("importance");
    expect(s.weights).toEqual({});
    expect(s.answers).toEqual({});
    expect(s.currentIndex).toBe(0);
    expect(s.region).toBe("scotland");
  });

  it("reviewAnswers transitions to questions and preserves answers/weights/region", () => {
    seedDone();
    useSurvey.getState().reviewAnswers();
    const s = useSurvey.getState();
    expect(s.phase).toBe("questions");
    expect(s.currentIndex).toBe(0);
    expect(s.answers).toEqual({ s1: 2, s2: -1 });
    expect(s.weights).toEqual({ economy: "high" });
    expect(s.region).toBe("scotland");
  });
});

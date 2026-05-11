import { beforeEach, describe, expect, it } from "vitest";
import { useSurvey } from "./store";

const seedDone = () => {
  useSurvey.setState({
    phase: "done",
    region: "scotland",
    weights: { economy: "high" },
    answers: { s1: 2, s2: -1 },
    currentIndex: 5,
    mode: "focused",
    activeStatementIds: ["s1", "s2"],
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
      mode: null,
      activeStatementIds: null,
    });
  });

  it("resetSurvey wipes progress (incl. mode + activeStatementIds) but preserves region", () => {
    seedDone();
    useSurvey.getState().resetSurvey();
    const s = useSurvey.getState();
    expect(s.phase).toBe("importance");
    expect(s.weights).toEqual({});
    expect(s.answers).toEqual({});
    expect(s.currentIndex).toBe(0);
    expect(s.mode).toBeNull();
    expect(s.activeStatementIds).toBeNull();
    expect(s.region).toBe("scotland");
  });

  it("reviewAnswers transitions to questions and preserves answers/weights/region/mode/active set", () => {
    seedDone();
    useSurvey.getState().reviewAnswers();
    const s = useSurvey.getState();
    expect(s.phase).toBe("questions");
    expect(s.currentIndex).toBe(0);
    expect(s.answers).toEqual({ s1: 2, s2: -1 });
    expect(s.weights).toEqual({ economy: "high" });
    expect(s.region).toBe("scotland");
    expect(s.mode).toBe("focused");
    expect(s.activeStatementIds).toEqual(["s1", "s2"]);
  });

  it("beginSurvey sets mode, activeStatementIds, transitions to questions, resets index", () => {
    useSurvey.setState({ currentIndex: 7 });
    useSurvey.getState().beginSurvey("focused", ["a", "b", "c"]);
    const s = useSurvey.getState();
    expect(s.phase).toBe("questions");
    expect(s.mode).toBe("focused");
    expect(s.activeStatementIds).toEqual(["a", "b", "c"]);
    expect(s.currentIndex).toBe(0);
  });
});

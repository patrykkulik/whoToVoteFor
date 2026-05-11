"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "./safeStorage";
import type { AnswerScore, Answers, Importance, SurveyMode, Weights } from "./scoring";
import type { Region, TopicId } from "@/data";

export type SurveyPhase = "importance" | "questions" | "done";

interface SurveyState {
  phase: SurveyPhase;
  region: Region | null; // null = show all parties
  weights: Weights;
  answers: Answers;
  currentIndex: number;
  /** Null until the user picks a mode at "Begin" time; treated as "full" downstream. */
  mode: SurveyMode | null;
  /**
   * Frozen at the moment the user clicks a Begin CTA — the exact set of
   * statements they're being asked, in order. `null` means "use the full
   * `STATEMENTS` list" (covers fresh state and migrated v2 sessions).
   */
  activeStatementIds: string[] | null;
  hasHydrated: boolean;

  setPhase: (p: SurveyPhase) => void;
  setRegion: (r: Region | null) => void;
  setImportance: (topic: TopicId, importance: Importance) => void;
  answer: (statementId: string, value: AnswerScore | null) => void;
  setIndex: (i: number) => void;
  /**
   * Transitions to the `questions` phase with a frozen mode and active
   * statement set. Caller is responsible for computing `activeIds` (typically
   * via `activeStatementsFor`) so the store stays decoupled from `STATEMENTS`.
   */
  beginSurvey: (mode: SurveyMode, activeIds: string[]) => void;
  /** Wipes survey progress. Preserves `region` as a long-lived preference. */
  resetSurvey: () => void;
  /**
   * Transitions out of the `done` phase so the user can edit prior answers.
   * Reuses the persisted `activeStatementIds` and `mode` so the user reviews
   * exactly the statements they were asked.
   */
  reviewAnswers: () => void;
  setHasHydrated: (b: boolean) => void;
}

const initial = {
  phase: "importance" as SurveyPhase,
  region: null as Region | null,
  weights: {} as Weights,
  answers: {} as Answers,
  currentIndex: 0,
  mode: null as SurveyMode | null,
  activeStatementIds: null as string[] | null,
};

export const useSurvey = create<SurveyState>()(
  persist(
    (set) => ({
      ...initial,
      hasHydrated: false,
      setPhase: (phase) => set({ phase }),
      setRegion: (region) => set({ region }),
      setImportance: (topic, importance) =>
        set((s) => ({ weights: { ...s.weights, [topic]: importance } })),
      answer: (statementId, value) =>
        set((s) => ({ answers: { ...s.answers, [statementId]: value } })),
      setIndex: (currentIndex) => set({ currentIndex }),
      beginSurvey: (mode, activeIds) =>
        set({
          mode,
          activeStatementIds: activeIds,
          phase: "questions",
          currentIndex: 0,
        }),
      // Preserves region as a long-lived preference; wipes survey progress.
      resetSurvey: () => set((s) => ({ ...initial, region: s.region })),
      reviewAnswers: () => set({ phase: "questions", currentIndex: 0 }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "wtvf-survey-v1",
      version: 3,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (s) => ({
        phase: s.phase,
        region: s.region,
        weights: s.weights,
        answers: s.answers,
        currentIndex: s.currentIndex,
        mode: s.mode,
        activeStatementIds: s.activeStatementIds,
      }),
      migrate: (persisted, fromVersion) => {
        let state = (persisted ?? {}) as Partial<SurveyState>;
        if (fromVersion < 2) {
          // v1 had no region field; default to "All of GB".
          state = { ...state, region: null };
        }
        if (fromVersion < 3) {
          // v2 had no mode/activeStatementIds. Default to null; for in-flight
          // sessions, treat as a full-mode run (activeStatementIds null ⇒
          // runner falls back to the full STATEMENTS list).
          const inFlight = state.phase === "questions" || state.phase === "done";
          state = {
            ...state,
            mode: inFlight ? "full" : null,
            activeStatementIds: null,
          };
        }
        return state as SurveyState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

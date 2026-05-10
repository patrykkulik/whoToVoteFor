"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "./safeStorage";
import type { AnswerScore, Answers, Importance, Weights } from "./scoring";
import type { Region, TopicId } from "@/data";

export type SurveyPhase = "importance" | "questions" | "done";

interface SurveyState {
  phase: SurveyPhase;
  region: Region | null; // null = show all parties
  weights: Weights;
  answers: Answers;
  currentIndex: number;
  hasHydrated: boolean;

  setPhase: (p: SurveyPhase) => void;
  setRegion: (r: Region | null) => void;
  setImportance: (topic: TopicId, importance: Importance) => void;
  answer: (statementId: string, value: AnswerScore | null) => void;
  setIndex: (i: number) => void;
  reset: () => void;
  setHasHydrated: (b: boolean) => void;
}

const initial = {
  phase: "importance" as SurveyPhase,
  region: null as Region | null,
  weights: {} as Weights,
  answers: {} as Answers,
  currentIndex: 0,
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
      reset: () => set({ ...initial }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "wtvf-survey-v1",
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (s) => ({
        phase: s.phase,
        region: s.region,
        weights: s.weights,
        answers: s.answers,
        currentIndex: s.currentIndex,
      }),
      migrate: (persisted, fromVersion) => {
        const state = (persisted ?? {}) as Partial<SurveyState>;
        if (fromVersion < 2) {
          // v1 had no region field; default to "All of GB".
          return { ...state, region: null } as SurveyState;
        }
        return state as SurveyState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

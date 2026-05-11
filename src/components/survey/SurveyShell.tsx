"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { STATEMENTS, TOPICS, type Statement } from "@/data";
import { useSurvey } from "@/lib/store";
import type { AnswerScore } from "@/lib/scoring";
import { ImportancePicker } from "./ImportancePicker";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";

export function SurveyShell() {
  const phase = useSurvey((s) => s.phase);
  const hasHydrated = useSurvey((s) => s.hasHydrated);
  const didCheck = useRef(false);

  // One-shot self-heal: if we mount with a previously completed survey (e.g.
  // the user clicked "Start the survey" before LandingResetEffect could run),
  // wipe progress so they begin fresh. Reads phase via getState() rather than
  // subscribing so the natural setPhase("done") -> router.push("/results")
  // transition at the end of the survey cannot retrigger this.
  useEffect(() => {
    if (!hasHydrated || didCheck.current) return;
    didCheck.current = true;
    if (useSurvey.getState().phase === "done") {
      useSurvey.getState().resetSurvey();
    }
  }, [hasHydrated]);

  if (phase === "importance") return <ImportancePicker />;
  return <Questions />;
}

function Questions() {
  const router = useRouter();
  const answers = useSurvey((s) => s.answers);
  const currentIndex = useSurvey((s) => s.currentIndex);
  const activeStatementIds = useSurvey((s) => s.activeStatementIds);
  const setIndex = useSurvey((s) => s.setIndex);
  const answer = useSurvey((s) => s.answer);
  const setPhase = useSurvey((s) => s.setPhase);
  const resetSurvey = useSurvey((s) => s.resetSurvey);

  // Resolve the frozen active statement set captured at "Begin" time. A null
  // value (fresh state or v2-migrated session) falls back to the full list.
  const { active, stale } = useMemo(() => {
    if (!activeStatementIds) return { active: STATEMENTS as readonly Statement[], stale: false };
    const byId = new Map(STATEMENTS.map((s) => [s.id, s] as const));
    const resolved = activeStatementIds
      .map((id) => byId.get(id))
      .filter((s): s is Statement => s !== undefined);
    const isStale = resolved.length !== activeStatementIds.length || resolved.length === 0;
    return { active: resolved, stale: isStale };
  }, [activeStatementIds]);

  // Stale-data recovery: persisted IDs reference statements that no longer
  // exist (e.g. a manifesto refresh). Reset and route back to the importance
  // picker rather than silently shrinking the run.
  useEffect(() => {
    if (!stale) return;
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[survey] persisted activeStatementIds are stale; resetting.");
    }
    resetSurvey();
  }, [stale, resetSurvey]);

  const total = active.length;
  // Prevents double-recording when a key is pressed during the post-answer
  // transition window.
  const transitioning = useRef(false);

  // Hooks below must run unconditionally; guard rendering after.
  const safeIndex = total === 0 ? 0 : Math.min(Math.max(currentIndex, 0), total - 1);
  const statement = total === 0 ? null : active[safeIndex];
  const current = statement ? answers[statement.id] ?? null : null;

  const advance = () => {
    if (safeIndex < total - 1) {
      setIndex(safeIndex + 1);
    } else {
      setPhase("done");
      router.push("/results");
    }
  };

  const onAnswer = (value: AnswerScore) => {
    if (!statement || transitioning.current) return;
    transitioning.current = true;
    answer(statement.id, value);
    window.setTimeout(() => {
      transitioning.current = false;
      advance();
    }, 180);
  };

  const onSkip = () => {
    if (!statement || transitioning.current) return;
    answer(statement.id, null);
    advance();
  };

  const onBack = () => {
    if (transitioning.current) return;
    if (safeIndex > 0) setIndex(safeIndex - 1);
  };

  // Keyboard handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const map: Record<string, AnswerScore> = { "1": -2, "2": -1, "3": 0, "4": 1, "5": 2 };
      if (e.key in map) {
        e.preventDefault();
        onAnswer(map[e.key]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, statement?.id]);

  if (stale || !statement) {
    return (
      <div className="space-y-4 text-center py-10">
        <p className="text-[var(--color-muted)]">No questions to show.</p>
        <Button onClick={() => setPhase("importance")}>Pick again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <ProgressBar current={safeIndex + 1} total={total} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={statement.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <QuestionCard
            statement={statement}
            topicLabel={TOPICS[statement.topic].label}
            current={current}
            onAnswer={onAnswer}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" onClick={onBack} disabled={safeIndex === 0}>
          ← Back
        </Button>
        <Button variant="secondary" onClick={onSkip}>
          Skip →
        </Button>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { STATEMENTS, TOPICS } from "@/data";
import { useSurvey } from "@/lib/store";
import type { AnswerScore } from "@/lib/scoring";
import { ImportancePicker } from "./ImportancePicker";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";

export function SurveyShell() {
  const phase = useSurvey((s) => s.phase);

  if (phase === "importance") return <ImportancePicker />;
  return <Questions />;
}

function Questions() {
  const router = useRouter();
  const answers = useSurvey((s) => s.answers);
  const currentIndex = useSurvey((s) => s.currentIndex);
  const setIndex = useSurvey((s) => s.setIndex);
  const answer = useSurvey((s) => s.answer);
  const setPhase = useSurvey((s) => s.setPhase);

  const total = STATEMENTS.length;
  const safeIndex = Math.min(Math.max(currentIndex, 0), total - 1);
  const statement = STATEMENTS[safeIndex];
  const current = answers[statement.id] ?? null;

  // Prevents double-recording when a key is pressed during the post-answer
  // transition window.
  const transitioning = useRef(false);

  const advance = () => {
    if (safeIndex < total - 1) {
      setIndex(safeIndex + 1);
    } else {
      setPhase("done");
      router.push("/results");
    }
  };

  const onAnswer = (value: AnswerScore) => {
    if (transitioning.current) return;
    transitioning.current = true;
    answer(statement.id, value);
    window.setTimeout(() => {
      transitioning.current = false;
      advance();
    }, 180);
  };

  const onSkip = () => {
    if (transitioning.current) return;
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
  }, [safeIndex]);

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

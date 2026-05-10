"use client";

import { useEffect } from "react";
import { useSurvey } from "@/lib/store";

/**
 * Mounted on the landing page. If a previously completed survey is present in
 * persisted storage, clear it so "Start the survey" begins fresh. In-progress
 * surveys are preserved. Region is preserved across restarts (handled by
 * `resetSurvey`).
 *
 * The landing page intentionally does not mount `HydrationGate` (it's a server
 * component), so this effect manages its own rehydrate trigger.
 */
export function LandingResetEffect() {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await useSurvey.persist.rehydrate();
      if (cancelled) return;
      if (useSurvey.getState().phase === "done") {
        useSurvey.getState().resetSurvey();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

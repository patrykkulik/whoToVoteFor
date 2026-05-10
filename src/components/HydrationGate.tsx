"use client";

import { useEffect, useState } from "react";
import { useSurvey } from "@/lib/store";

/** Renders children only after the persisted Zustand store has rehydrated. */
export function HydrationGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const hasHydrated = useSurvey((s) => s.hasHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    void useSurvey.persist.rehydrate();
  }, []);

  if (!mounted || !hasHydrated) return <>{fallback ?? null}</>;
  return <>{children}</>;
}

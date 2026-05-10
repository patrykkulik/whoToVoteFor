"use client";

interface Props {
  current: number; // 1-based
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="space-y-2">
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
        className="h-1.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-[var(--color-muted)]" aria-live="polite">
        Question {current} of {total}
      </p>
    </div>
  );
}

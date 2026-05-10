import * as React from "react";

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl ${className}`}
      {...props}
    />
  );
}

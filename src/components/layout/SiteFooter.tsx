import Link from "next/link";
import { REPO_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-24">
      <div className="mx-auto max-w-5xl px-5 py-10 text-sm text-[var(--color-muted)] flex flex-col sm:flex-row gap-3 sm:justify-between">
        <p>
          A non-partisan, informational tool. No tracking, no cookies. Your answers stay on your device.
        </p>
        <p className="flex flex-wrap gap-4">
          <Link href="/about" className="no-underline text-[var(--color-muted)] hover:text-[var(--color-fg)]">About &amp; sources</Link>
          <Link href="/parties" className="no-underline text-[var(--color-muted)] hover:text-[var(--color-fg)]">Party stances</Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-[var(--color-muted)] hover:text-[var(--color-fg)]"
          >
            Source on GitHub ↗
          </a>
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-tight no-underline text-[var(--color-fg)]">
          WhoToVoteFor<span className="text-[var(--color-accent)]">.</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/parties" className="text-[var(--color-muted)] hover:text-[var(--color-fg)] no-underline">Parties</Link>
          <Link href="/about" className="text-[var(--color-muted)] hover:text-[var(--color-fg)] no-underline">About</Link>
        </nav>
      </div>
    </header>
  );
}

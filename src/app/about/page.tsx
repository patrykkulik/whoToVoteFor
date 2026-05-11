import { Card } from "@/components/ui/Card";
import { ScopeBanner } from "@/components/ScopeBanner";
import { ISSUES_URL, REPO_URL } from "@/lib/site";

export const metadata = { title: "About — WhoToVoteFor" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14 space-y-10">
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl">About this tool</h1>
        <p className="text-[var(--color-muted)]">
          A non-partisan, informational guide to UK general election manifestos.
        </p>
      </header>

      <ScopeBanner />

      <section className="space-y-3">
        <h2 className="font-display text-2xl">How matching works</h2>
        <p>
          For each policy statement you score on a five-point scale (strongly
          disagree to strongly agree), every party has an editorially-curated
          stance on the same scale based on what they pledged in their published
          manifesto.
        </p>
        <p>
          Your match with a party is calculated as the weighted similarity of
          your answers to their stances, expressed as a percentage. Topics you
          marked as <em>high importance</em> count three times as much as topics
          you marked as <em>low</em>. Statements you skipped are excluded; so
          are statements where the party simply didn&apos;t take a position.
          That keeps parties with shorter manifestos from being unfairly
          penalised.
        </p>
        <p>
          Each party&apos;s percentage is calculated against only the statements
          they took a position on, so the score reflects how well-matched
          you are <em>where there&apos;s evidence to compare</em>. The
          &ldquo;answered N of M statements&rdquo; figure on the results page
          tells you how much evidence that represents.
        </p>
        <p>
          You can take the survey in two modes. <em>Full</em> asks every
          statement; topics you marked as <em>Skip</em> are still scored, but
          treated as low importance so your preference is preserved. <em>Focused</em>
          drops Skip-marked topics from the survey and from scoring entirely,
          so you only see and score what you care about.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Where the data comes from</h2>
        <p>
          Every party stance is grounded in the party&apos;s 2024 General
          Election manifesto, linked from the <a href="/parties">Parties</a>{" "}
          page. The current dataset is hand-curated as a v1 bootstrap; quotes
          are short summaries of each party&apos;s position, not verbatim PDF
          text.
        </p>
        <p>
          The longer-term plan, set out in the project design, is an automated
          build-time pipeline that ingests the manifesto PDFs and emits
          stance-level citations as <em>verbatim, mechanically-verified</em>{" "}
          quotes with page numbers. That work is gated through a human-review
          step before any data ships to the website. The website itself never
          calls a language model.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Privacy</h2>
        <p>
          There is no backend. No accounts. No cookies. No analytics. Your
          answers are saved to <code>localStorage</code> in your browser so you
          can refresh and resume; they never leave your device.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Limitations</h2>
        <ul className="list-disc list-inside space-y-1.5 text-[var(--color-muted)]">
          <li>
            v1 covers six parties (Labour, Conservative, Liberal Democrats,
            Green, Reform UK, SNP). Plaid Cymru and Northern Ireland parties are
            not yet included.
          </li>
          <li>
            Some parties don&apos;t stand in every part of the UK (the SNP
            stands only in Scotland, for example). Your highest-match party may
            not appear on your ballot paper.
          </li>
          <li>
            Manifestos summarise policy at a moment in time; positions may shift
            as governments take office.
          </li>
          <li>
            Stance summaries reflect editorial judgement. Every position is
            shown on <a href="/parties">/parties</a> so you can sanity-check it.
          </li>
        </ul>
      </section>

      <Card className="p-5">
        <h3 className="font-medium mb-1">Spot something wrong?</h3>
        <p className="text-sm text-[var(--color-muted)]">
          If a stance summary misrepresents a party&apos;s manifesto, please{" "}
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
            open an issue
          </a>{" "}
          on the project&apos;s{" "}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>
          . This is a non-partisan tool; corrections are welcome.
        </p>
      </Card>

      <section className="space-y-2">
        <h2 className="font-display text-2xl">This tool is informational</h2>
        <p className="text-[var(--color-muted)] text-sm">
          WhoToVoteFor is intended to help voters understand how their views
          compare to the parties&apos; published manifestos. It is not
          campaigning material and does not endorse any party or candidate.
        </p>
      </section>
    </div>
  );
}

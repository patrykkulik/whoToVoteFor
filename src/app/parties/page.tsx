import { PARTIES, STATEMENTS, TOPICS, type PartyId, type TopicId } from "@/data";
import { Card } from "@/components/ui/Card";
import { ScopeBanner } from "@/components/ScopeBanner";
import { REGION_LABEL } from "@/lib/region";

export const metadata = { title: "Party stances — WhoToVoteFor" };

const SCORE_LABEL: Record<number, string> = {
  [-2]: "Strongly disagrees",
  [-1]: "Disagrees",
  [0]: "Neutral",
  [1]: "Agrees",
  [2]: "Strongly agrees",
};

export default function PartiesPage() {
  const topicIds = Object.keys(TOPICS) as TopicId[];
  const partyIds = Object.keys(PARTIES) as PartyId[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14 space-y-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-[var(--color-muted)]">
          Audit
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">Party stances</h1>
        <p className="text-[var(--color-muted)]">
          Every statement in the survey, every party&apos;s position, with a
          short summary of where it comes from in their manifesto.
        </p>
      </header>

      <ScopeBanner />

      <section>
        <h2 className="font-display text-2xl mb-4">Parties &amp; manifestos</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {partyIds.map((id) => {
            const p = PARTIES[id];
            return (
              <li key={id}>
                <Card className="p-4 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: p.colour }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      Standing in: {p.standingIn.map((r) => REGION_LABEL[r]).join(", ")}
                    </p>
                  </div>
                  <a
                    href={p.manifestoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm whitespace-nowrap"
                  >
                    Manifesto ↗
                  </a>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      {topicIds.map((topicId) => {
        const topic = TOPICS[topicId];
        const topicStatements = STATEMENTS.filter((s) => s.topic === topicId);
        return (
          <section key={topicId} className="space-y-4">
            <div>
              <h2 className="font-display text-2xl">{topic.label}</h2>
              <p className="text-sm text-[var(--color-muted)]">{topic.blurb}</p>
            </div>
            <div className="space-y-4">
              {topicStatements.map((statement) => (
                <Card key={statement.id} className="p-5">
                  <p className="font-medium mb-3">&ldquo;{statement.text}&rdquo;</p>
                  <ul className="space-y-2">
                    {partyIds.map((partyId) => {
                      const stance = statement.stances[partyId];
                      const party = PARTIES[partyId];
                      if (!stance) return null;
                      return (
                        <li key={partyId} className="flex gap-3 text-sm">
                          <span
                            aria-hidden
                            className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                            style={{ background: party.colour }}
                          />
                          <div>
                            <span className="font-medium">{party.shortName}</span>
                            {stance.kind === "stated" ? (
                              <>
                                <span className="text-[var(--color-muted)]">
                                  {" — "}
                                  {SCORE_LABEL[stance.score]}.
                                </span>{" "}
                                <span className="text-[var(--color-muted)]">
                                  {stance.citations[0].quote}
                                </span>
                                {stance.citations[0].printedPage > 0 ? (
                                  <span className="text-xs text-[var(--color-muted)] ml-1">
                                    (p.{stance.citations[0].printedPage})
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-[var(--color-muted)]">
                                {" — "}No stated position
                                {stance.note ? ` (${stance.note})` : ""}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

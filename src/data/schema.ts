import { z } from "zod";

export const PartyIdSchema = z.enum([
  "labour",
  "conservative",
  "libdem",
  "green",
  "reform",
  "snp",
]);
export type PartyId = z.infer<typeof PartyIdSchema>;

export const TopicIdSchema = z.enum([
  "nhs",
  "economy",
  "education",
  "housing",
  "immigration",
  "environment",
  "crime",
  "foreign",
  "welfare",
  "transport",
  "democracy",
]);
export type TopicId = z.infer<typeof TopicIdSchema>;

export const RegionSchema = z.enum(["england", "scotland", "wales", "ni"]);
export type Region = z.infer<typeof RegionSchema>;

export const PartySchema = z.object({
  id: PartyIdSchema,
  name: z.string().min(1),
  shortName: z.string().min(1),
  colour: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  manifestoUrl: z.string().url(),
  standingIn: z.array(RegionSchema).min(1),
});
export type Party = z.infer<typeof PartySchema>;

export const TopicSchema = z.object({
  id: TopicIdSchema,
  label: z.string().min(1),
  blurb: z.string().min(1),
  icon: z.string().min(1),
});
export type Topic = z.infer<typeof TopicSchema>;

export const CitationSchema = z.object({
  quote: z.string().min(1),
  printedPage: z.number().int().nonnegative(),
  pdfPage: z.number().int().nonnegative(),
});
export type Citation = z.infer<typeof CitationSchema>;

/**
 * `pipeline` = pipeline-emitted stance with verbatim, mechanically-verified quotes.
 * `curated` = hand-authored summary stance (v1 bootstrap data); quotes are
 * curator paraphrases, not verbatim. The runtime renders these differently.
 */
export const StanceSourceSchema = z.enum(["pipeline", "curated"]);

export const StanceSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("stated"),
    score: z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]),
    citations: z.array(CitationSchema).min(1).max(3),
    confidence: z.number().min(0).max(1),
    source: StanceSourceSchema,
  }),
  z.object({
    kind: z.literal("unstated"),
    note: z.string().optional(),
    source: StanceSourceSchema,
  }),
]);
export type Stance = z.infer<typeof StanceSchema>;

export const StatementSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Statement IDs must be kebab-case"),
  topic: TopicIdSchema,
  text: z.string().min(1).max(200),
  stances: z.record(PartyIdSchema, StanceSchema),
});
export interface Statement {
  id: string;
  topic: TopicId;
  text: string;
  stances: Record<PartyId, Stance>;
}

export const ManifestoSchema = z.object({
  electionYear: z.number().int(),
  parties: z.record(PartyIdSchema, PartySchema),
  topics: z.record(TopicIdSchema, TopicSchema),
  statements: z.array(StatementSchema),
});

/**
 * Hand-written rather than `z.infer<typeof ManifestoSchema>` because zod's
 * `z.record(K, V)` produces `Partial<Record<K, V>>`, which forces undefined
 * checks on every iteration. The runtime invariant (validated by
 * `assertManifesto`) is that every topic and every party id is present.
 */
export interface Manifesto {
  electionYear: number;
  parties: Record<PartyId, Party>;
  topics: Record<TopicId, Topic>;
  statements: Statement[];
}

/**
 * Validate that every statement has a stance entry for every party listed in `parties`,
 * and that statement IDs are unique. Used in CI and unit tests.
 */
export function assertManifesto(manifesto: Manifesto): void {
  ManifestoSchema.parse(manifesto);

  const ids = new Set<string>();
  for (const s of manifesto.statements) {
    if (ids.has(s.id)) throw new Error(`Duplicate statement id: ${s.id}`);
    ids.add(s.id);

    for (const partyId of Object.keys(manifesto.parties) as PartyId[]) {
      if (!s.stances[partyId]) {
        throw new Error(`Statement ${s.id} missing stance for party ${partyId}`);
      }
    }
  }
}

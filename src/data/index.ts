import manifesto2024 from "./manifestos/2024";
import { assertManifesto } from "./schema";

// Validate at module load (build-time tree-shaken in production via NODE_ENV check).
if (process.env.NODE_ENV !== "production") {
  assertManifesto(manifesto2024);
}

export const MANIFESTO = manifesto2024;
export const PARTIES = manifesto2024.parties;
export const TOPICS = manifesto2024.topics;
export const STATEMENTS = manifesto2024.statements;
export const ELECTION_YEAR = manifesto2024.electionYear;

export type {
  Party,
  PartyId,
  Topic,
  TopicId,
  Statement,
  Stance,
  Citation,
  Manifesto,
  Region,
} from "./schema";

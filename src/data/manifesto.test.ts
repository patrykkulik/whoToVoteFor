import { describe, expect, it } from "vitest";
import manifesto from "./manifestos/2024";
import { assertManifesto } from "./schema";

describe("2024 manifesto fixture", () => {
  it("validates against the schema", () => {
    expect(() => assertManifesto(manifesto)).not.toThrow();
  });

  it("has unique kebab-case statement ids", () => {
    const ids = manifesto.statements.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("has a stance for every party on every statement", () => {
    const partyIds = Object.keys(manifesto.parties);
    for (const s of manifesto.statements) {
      for (const p of partyIds) {
        expect(s.stances[p as keyof typeof s.stances], `${s.id} missing ${p}`).toBeDefined();
      }
    }
  });

  it("topics referenced by statements all exist", () => {
    const topicIds = Object.keys(manifesto.topics);
    for (const s of manifesto.statements) {
      expect(topicIds).toContain(s.topic);
    }
  });
});

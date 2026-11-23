import { describe, expect, test } from "bun:test";
import { SessioningMemoryConcept } from "./sessioning.memory.ts";

const at = (ms: number) => new Date(Date.UTC(2026, 10, 22, 12, 0, 0) + ms);
const storedCount = (concept: SessioningMemoryConcept) =>
  (concept as unknown as { sessions: Map<string, unknown> }).sessions.size;

describe("expired session sweep", () => {
  test("starting a session forgets sessions that have expired", () => {
    const concept = new SessioningMemoryConcept();
    const { session: old } = concept.start({ subject: "ari", lifetime: 1_000, now: at(0) });
    concept.start({ subject: "bo", lifetime: 600_000, now: at(0) });
    expect(storedCount(concept)).toBe(2);

    // Two minutes later the short session has expired; the next start removes it.
    const { session: fresh } = concept.start({ subject: "cy", lifetime: 600_000, now: at(120_000) });
    expect(storedCount(concept)).toBe(2);
    expect(concept._active({ session: old, now: at(120_000) })).toEqual([]);
    expect(() => concept.current({ session: old, now: at(120_000) })).toThrow();
    expect(concept.current({ session: fresh, now: at(120_000) })).toEqual({ subject: "cy" });
  });

  test("active sessions are never swept", () => {
    const concept = new SessioningMemoryConcept();
    const { session } = concept.start({ subject: "ari", lifetime: 600_000, now: at(0) });
    concept.start({ subject: "bo", lifetime: 600_000, now: at(120_000) });
    expect(concept.current({ session, now: at(120_000) })).toEqual({ subject: "ari" });
  });
});

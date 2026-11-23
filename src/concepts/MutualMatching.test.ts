import { describe, expect, test } from "bun:test";
import {
  InterestAlreadyDecided,
  InterestAlreadyMatched,
  InterestInSelf,
  MutualMatchingConcept,
  NotMatched,
  PassAfterInterest,
  PassAlreadyMatched,
  PassOnSelf,
} from "./MutualMatching.ts";

function snapshot(concept: MutualMatchingConcept, users: string[]) {
  const decisions: Record<string, unknown> = {};
  for (const from of users) {
    for (const to of users) decisions[`${from}->${to}`] = concept._decision({ from, to });
  }
  const interested: Record<string, unknown> = {};
  const matches: Record<string, unknown> = {};
  for (const user of users) {
    interested[user] = concept._getInterestedInYou({ user });
    matches[user] = concept._getMatches({ user });
  }
  return { decisions, interested, matches };
}

const USERS = ["keti", "bumba", "ana", "dato"];

describe("MutualMatchingConcept construction", () => {
  test("constructs with no arguments and has zero runtime arity", () => {
    expect(MutualMatchingConcept.length).toBe(0);
    const concept = new MutualMatchingConcept();
    expect(concept._getMatches({ user: "keti" })).toEqual([]);
    expect(concept._getInterestedInYou({ user: "keti" })).toEqual([]);
    expect(concept._decision({ from: "keti", to: "bumba" })).toEqual([]);
  });

  test("exposes only declared actions and queries on the prototype", () => {
    const names = Object.getOwnPropertyNames(MutualMatchingConcept.prototype).sort();
    expect(names).toEqual(
      [
        "constructor",
        "showInterest",
        "pass",
        "unmatch",
        "_getInterestedInYou",
        "_getMatches",
        "_decision",
      ].sort(),
    );
  });
});

describe("MutualMatchingConcept principle", () => {
  test("operational principle", () => {
    const m = new MutualMatchingConcept();
    expect(m.showInterest({ from: "keti", to: "bumba" })).toEqual({ matched: false });
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "INTERESTED" }]);
    expect(m._getMatches({ user: "keti" })).toEqual([]);
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([{ from: "keti" }]);

    expect(m.showInterest({ from: "bumba", to: "keti" })).toEqual({ matched: true });
    expect(m._getMatches({ user: "keti" })).toEqual([{ other: "bumba" }]);
    expect(m._getMatches({ user: "bumba" })).toEqual([{ other: "keti" }]);
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([]);
    expect(m._getInterestedInYou({ user: "keti" })).toEqual([]);

    expect(() => m.showInterest({ from: "keti", to: "bumba" })).toThrow(InterestAlreadyMatched);

    expect(m.unmatch({ user: "keti", other: "bumba" })).toEqual({});
    expect(m._getMatches({ user: "keti" })).toEqual([]);
    expect(m._getMatches({ user: "bumba" })).toEqual([]);
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "PASSED" }]);
    expect(m._decision({ from: "bumba", to: "keti" })).toEqual([{ status: "PASSED" }]);
    expect(() => m.showInterest({ from: "keti", to: "bumba" })).toThrow(InterestAlreadyDecided);
    expect(() => m.showInterest({ from: "bumba", to: "keti" })).toThrow(InterestAlreadyDecided);

    expect(m.showInterest({ from: "ana", to: "bumba" })).toEqual({ matched: false });
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([{ from: "ana" }]);
    expect(m.pass({ from: "bumba", to: "ana" })).toEqual({});
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([]);
    expect(m.pass({ from: "bumba", to: "ana" })).toEqual({});
    expect(m._decision({ from: "bumba", to: "ana" })).toEqual([{ status: "PASSED" }]);
  });
});

describe("showInterest", () => {
  test("records one-sided interest without a match", () => {
    const m = new MutualMatchingConcept();
    expect(m.showInterest({ from: "keti", to: "bumba" })).toEqual({ matched: false });
    expect(m._decision({ from: "bumba", to: "keti" })).toEqual([]);
    expect(m._getMatches({ user: "bumba" })).toEqual([]);
  });

  test("creates a match exactly when interest becomes mutual", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    expect(m.showInterest({ from: "bumba", to: "keti" })).toEqual({ matched: true });
    expect(m._decision({ from: "bumba", to: "keti" })).toEqual([{ status: "INTERESTED" }]);
    expect(m._getMatches({ user: "keti" })).toEqual([{ other: "bumba" }]);
  });

  test("does not match when the target passed on the sender", () => {
    const m = new MutualMatchingConcept();
    m.pass({ from: "bumba", to: "keti" });
    expect(m.showInterest({ from: "keti", to: "bumba" })).toEqual({ matched: false });
    expect(m._getMatches({ user: "keti" })).toEqual([]);
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([]);
  });

  test("refuses interest in oneself without changing state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "ana", to: "keti" });
    const before = snapshot(m, USERS);
    expect(() => m.showInterest({ from: "keti", to: "keti" })).toThrow(InterestInSelf);
    expect(() => m.showInterest({ from: "keti", to: "keti" })).toThrow(
      "You cannot show interest in yourself.",
    );
    expect(snapshot(m, USERS)).toEqual(before);
    expect(m._decision({ from: "keti", to: "keti" })).toEqual([]);
  });

  test("refuses interest for an already matched pair without changing state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    m.showInterest({ from: "bumba", to: "keti" });
    const before = snapshot(m, USERS);
    expect(() => m.showInterest({ from: "keti", to: "bumba" })).toThrow(InterestAlreadyMatched);
    expect(() => m.showInterest({ from: "bumba", to: "keti" })).toThrow(
      "You are already matched with this person.",
    );
    expect(snapshot(m, USERS)).toEqual(before);
  });

  test("refuses repeated interest without changing state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    const before = snapshot(m, USERS);
    expect(() => m.showInterest({ from: "keti", to: "bumba" })).toThrow(InterestAlreadyDecided);
    expect(() => m.showInterest({ from: "keti", to: "bumba" })).toThrow(
      "You have already decided about this person.",
    );
    expect(snapshot(m, USERS)).toEqual(before);
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([{ from: "keti" }]);
  });

  test("refuses interest after a pass without changing state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "ana", to: "keti" });
    m.pass({ from: "keti", to: "ana" });
    const before = snapshot(m, USERS);
    expect(() => m.showInterest({ from: "keti", to: "ana" })).toThrow(InterestAlreadyDecided);
    expect(snapshot(m, USERS)).toEqual(before);
    expect(m._decision({ from: "keti", to: "ana" })).toEqual([{ status: "PASSED" }]);
  });
});

describe("pass", () => {
  test("records a pass and returns an empty object", () => {
    const m = new MutualMatchingConcept();
    expect(m.pass({ from: "keti", to: "bumba" })).toEqual({});
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "PASSED" }]);
  });

  test("repeating a pass succeeds without a second decision", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "ana", to: "bumba" });
    m.showInterest({ from: "dato", to: "bumba" });
    m.pass({ from: "bumba", to: "ana" });
    const before = snapshot(m, USERS);
    expect(m.pass({ from: "bumba", to: "ana" })).toEqual({});
    expect(m.pass({ from: "bumba", to: "ana" })).toEqual({});
    expect(snapshot(m, USERS)).toEqual(before);
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([{ from: "dato" }]);
  });

  test("refuses passing on oneself without changing state", () => {
    const m = new MutualMatchingConcept();
    const before = snapshot(m, USERS);
    expect(() => m.pass({ from: "keti", to: "keti" })).toThrow(PassOnSelf);
    expect(() => m.pass({ from: "keti", to: "keti" })).toThrow("You cannot pass on yourself.");
    expect(snapshot(m, USERS)).toEqual(before);
  });

  test("refuses passing on a matched person without changing state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    m.showInterest({ from: "bumba", to: "keti" });
    const before = snapshot(m, USERS);
    expect(() => m.pass({ from: "keti", to: "bumba" })).toThrow(PassAlreadyMatched);
    expect(() => m.pass({ from: "bumba", to: "keti" })).toThrow(
      "You are matched with this person; unmatch instead.",
    );
    expect(snapshot(m, USERS)).toEqual(before);
  });

  test("refuses passing after showing interest without changing state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    const before = snapshot(m, USERS);
    expect(() => m.pass({ from: "keti", to: "bumba" })).toThrow(PassAfterInterest);
    expect(() => m.pass({ from: "keti", to: "bumba" })).toThrow(
      "You have already shown interest in this person.",
    );
    expect(snapshot(m, USERS)).toEqual(before);
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "INTERESTED" }]);
  });

  test("a pass prevents a later match from the other direction", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "ana", to: "bumba" });
    m.pass({ from: "bumba", to: "ana" });
    expect(() => m.showInterest({ from: "bumba", to: "ana" })).toThrow(InterestAlreadyDecided);
    expect(m._getMatches({ user: "ana" })).toEqual([]);
  });
});

describe("unmatch", () => {
  test("removes the match, sets both decisions to PASSED, and prevents rematching", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    m.showInterest({ from: "bumba", to: "keti" });
    expect(m.unmatch({ user: "bumba", other: "keti" })).toEqual({});
    expect(m._getMatches({ user: "keti" })).toEqual([]);
    expect(m._getMatches({ user: "bumba" })).toEqual([]);
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "PASSED" }]);
    expect(m._decision({ from: "bumba", to: "keti" })).toEqual([{ status: "PASSED" }]);
    expect(m._getInterestedInYou({ user: "keti" })).toEqual([]);
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([]);
    expect(() => m.showInterest({ from: "keti", to: "bumba" })).toThrow(InterestAlreadyDecided);
    expect(() => m.showInterest({ from: "bumba", to: "keti" })).toThrow(InterestAlreadyDecided);
    expect(m.pass({ from: "keti", to: "bumba" })).toEqual({});
  });

  test("refuses when no match exists, including a repeated unmatch, without changing state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    m.showInterest({ from: "bumba", to: "keti" });
    m.showInterest({ from: "ana", to: "bumba" });
    const before = snapshot(m, USERS);
    expect(() => m.unmatch({ user: "ana", other: "bumba" })).toThrow(NotMatched);
    expect(() => m.unmatch({ user: "dato", other: "keti" })).toThrow(
      "You do not have an active match with this person.",
    );
    expect(() => m.unmatch({ user: "keti", other: "keti" })).toThrow(NotMatched);
    expect(() => m.unmatch({ user: "nobody", other: "ghost" })).toThrow(NotMatched);
    expect(snapshot(m, USERS)).toEqual(before);

    m.unmatch({ user: "keti", other: "bumba" });
    const after = snapshot(m, USERS);
    expect(() => m.unmatch({ user: "keti", other: "bumba" })).toThrow(NotMatched);
    expect(() => m.unmatch({ user: "bumba", other: "keti" })).toThrow(NotMatched);
    expect(snapshot(m, USERS)).toEqual(after);
  });

  test("only removes the named pair's match", () => {
    const m = new MutualMatchingConcept();
    for (const other of ["bumba", "ana", "dato"]) {
      m.showInterest({ from: "keti", to: other });
      m.showInterest({ from: other, to: "keti" });
    }
    m.unmatch({ user: "keti", other: "ana" });
    expect(m._getMatches({ user: "keti" })).toEqual([{ other: "bumba" }, { other: "dato" }]);
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "INTERESTED" }]);
  });
});

describe("queries", () => {
  test("_getInterestedInYou orders by decision position and excludes passed and matched users", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "dato", to: "bumba" });
    m.showInterest({ from: "keti", to: "bumba" });
    m.showInterest({ from: "ana", to: "bumba" });
    m.showInterest({ from: "zura", to: "bumba" });
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([
      { from: "dato" },
      { from: "keti" },
      { from: "ana" },
      { from: "zura" },
    ]);

    m.pass({ from: "bumba", to: "ana" });
    m.showInterest({ from: "bumba", to: "keti" });
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([{ from: "dato" }, { from: "zura" }]);
    // A pass by the viewer does not hide anyone from the passed user's own list.
    expect(m._getInterestedInYou({ user: "ana" })).toEqual([]);
  });

  test("_getInterestedInYou excludes passes and is empty for unknown users", () => {
    const m = new MutualMatchingConcept();
    m.pass({ from: "keti", to: "bumba" });
    expect(m._getInterestedInYou({ user: "bumba" })).toEqual([]);
    expect(m._getInterestedInYou({ user: "unknown" })).toEqual([]);
  });

  test("_getMatches orders by match creation, oldest first, regardless of who was first", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "ana", to: "keti" });
    m.showInterest({ from: "keti", to: "bumba" });
    m.showInterest({ from: "dato", to: "keti" });
    m.showInterest({ from: "bumba", to: "keti" }); // match keti-bumba first
    m.showInterest({ from: "keti", to: "dato" }); // match keti-dato second
    m.showInterest({ from: "keti", to: "ana" }); // match keti-ana third
    expect(m._getMatches({ user: "keti" })).toEqual([
      { other: "bumba" },
      { other: "dato" },
      { other: "ana" },
    ]);
    expect(m._getMatches({ user: "ana" })).toEqual([{ other: "keti" }]);
    expect(m._getMatches({ user: "unknown" })).toEqual([]);
  });

  test("_decision answers zero or one row with only the status", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    m.pass({ from: "bumba", to: "ana" });
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "INTERESTED" }]);
    expect(m._decision({ from: "bumba", to: "ana" })).toEqual([{ status: "PASSED" }]);
    expect(m._decision({ from: "bumba", to: "keti" })).toEqual([]);
    expect(m._decision({ from: "ghost", to: "phantom" })).toEqual([]);
    const [row] = m._decision({ from: "keti", to: "bumba" });
    expect(Object.keys(row)).toEqual(["status"]);
  });

  test("returned rows do not expose internal state", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "keti", to: "bumba" });
    const [row] = m._decision({ from: "keti", to: "bumba" });
    (row as { status: string }).status = "PASSED";
    expect(m._decision({ from: "keti", to: "bumba" })).toEqual([{ status: "INTERESTED" }]);
  });

  test("identities are opaque strings, including ones with separators", () => {
    const m = new MutualMatchingConcept();
    m.showInterest({ from: "a,b", to: "c" });
    expect(m._decision({ from: "a", to: "b,c" })).toEqual([]);
    expect(m._decision({ from: "a,b", to: "c" })).toEqual([{ status: "INTERESTED" }]);
  });
});

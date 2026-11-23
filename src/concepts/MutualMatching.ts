export type User = string;
export type DecisionStatus = "INTERESTED" | "PASSED";

export interface DecisionRow {
  from: User;
  to: User;
  status: DecisionStatus;
}

export interface MatchRow {
  first: User;
  second: User;
}

export const INTEREST_IN_SELF_DETAIL = "You cannot show interest in yourself.";
export const INTEREST_ALREADY_MATCHED_DETAIL = "You are already matched with this person.";
export const INTEREST_ALREADY_DECIDED_DETAIL = "You have already decided about this person.";
export const PASS_ON_SELF_DETAIL = "You cannot pass on yourself.";
export const PASS_ALREADY_MATCHED_DETAIL = "You are matched with this person; unmatch instead.";
export const PASS_AFTER_INTEREST_DETAIL = "You have already shown interest in this person.";
export const NOT_MATCHED_DETAIL = "You do not have an active match with this person.";

/** Refusal INTEREST_IN_SELF. */
export class InterestInSelf extends Error {}
/** Refusal INTEREST_ALREADY_MATCHED. */
export class InterestAlreadyMatched extends Error {}
/** Refusal INTEREST_ALREADY_DECIDED. */
export class InterestAlreadyDecided extends Error {}
/** Refusal PASS_ON_SELF. */
export class PassOnSelf extends Error {}
/** Refusal PASS_ALREADY_MATCHED. */
export class PassAlreadyMatched extends Error {}
/** Refusal PASS_AFTER_INTEREST. */
export class PassAfterInterest extends Error {}
/** Refusal NOT_MATCHED. */
export class NotMatched extends Error {}

/** Unambiguous key for an ordered pair of opaque identities. */
function orderedKey(from: User, to: User): string {
  return JSON.stringify([from, to]);
}

/** Unambiguous key for an unordered pair of opaque identities. */
function unorderedKey(a: User, b: User): string {
  return a < b ? JSON.stringify([a, b]) : JSON.stringify([b, a]);
}

export interface MutualMatchingInitialState {
  decisions?: Iterable<DecisionRow>;
  matches?: Iterable<MatchRow>;
}

export class MutualMatchingConcept {
  /** Decisions in first-recorded order. */
  #decisions: DecisionRow[] = [];
  #decisionsByPair = new Map<string, DecisionRow>();
  /** Matches in creation order. */
  #matches: MatchRow[] = [];
  #matchesByPair = new Map<string, MatchRow>();

  constructor({ decisions = [], matches = [] }: MutualMatchingInitialState = {}) {
    for (const { from, to, status } of decisions) {
      const decision: DecisionRow = { from, to, status };
      this.#decisions.push(decision);
      this.#decisionsByPair.set(orderedKey(from, to), decision);
    }
    for (const { first, second } of matches) {
      const match: MatchRow = { first, second };
      this.#matches.push(match);
      this.#matchesByPair.set(unorderedKey(first, second), match);
    }
  }

  showInterest({ from, to }: { from: User; to: User }): { matched: boolean } {
    if (from === to) throw new InterestInSelf(INTEREST_IN_SELF_DETAIL);
    if (this.#matchesByPair.has(unorderedKey(from, to))) {
      throw new InterestAlreadyMatched(INTEREST_ALREADY_MATCHED_DETAIL);
    }
    if (this.#decisionsByPair.has(orderedKey(from, to))) {
      throw new InterestAlreadyDecided(INTEREST_ALREADY_DECIDED_DETAIL);
    }
    const reverse = this.#decisionsByPair.get(orderedKey(to, from));
    this.#appendDecision(from, to, "INTERESTED");
    if (reverse?.status === "INTERESTED") {
      const match: MatchRow = { first: from, second: to };
      this.#matches.push(match);
      this.#matchesByPair.set(unorderedKey(from, to), match);
      return { matched: true };
    }
    return { matched: false };
  }

  pass({ from, to }: { from: User; to: User }): Record<string, never> {
    if (from === to) throw new PassOnSelf(PASS_ON_SELF_DETAIL);
    if (this.#matchesByPair.has(unorderedKey(from, to))) {
      throw new PassAlreadyMatched(PASS_ALREADY_MATCHED_DETAIL);
    }
    const existing = this.#decisionsByPair.get(orderedKey(from, to));
    if (existing?.status === "INTERESTED") {
      throw new PassAfterInterest(PASS_AFTER_INTEREST_DETAIL);
    }
    if (existing === undefined) this.#appendDecision(from, to, "PASSED");
    return {};
  }

  unmatch({ user, other }: { user: User; other: User }): Record<string, never> {
    const key = unorderedKey(user, other);
    const match = this.#matchesByPair.get(key);
    if (match === undefined) throw new NotMatched(NOT_MATCHED_DETAIL);
    this.#matchesByPair.delete(key);
    this.#matches = this.#matches.filter((candidate) => candidate !== match);
    this.#setPassed(user, other);
    this.#setPassed(other, user);
    return {};
  }

  _getInterestedInYou({ user }: { user: User }): Array<{ from: User }> {
    const rows: Array<{ from: User }> = [];
    for (const decision of this.#decisions) {
      if (decision.to !== user || decision.status !== "INTERESTED") continue;
      const from = decision.from;
      if (this.#decisionsByPair.get(orderedKey(user, from))?.status === "PASSED") continue;
      if (this.#matchesByPair.has(unorderedKey(user, from))) continue;
      rows.push({ from });
    }
    return rows;
  }

  _getMatches({ user }: { user: User }): Array<{ other: User }> {
    const rows: Array<{ other: User }> = [];
    for (const { first, second } of this.#matches) {
      if (first === user) rows.push({ other: second });
      else if (second === user) rows.push({ other: first });
    }
    return rows;
  }

  _decision({ from, to }: { from: User; to: User }): Array<{ status: DecisionStatus }> {
    const decision = this.#decisionsByPair.get(orderedKey(from, to));
    return decision === undefined ? [] : [{ status: decision.status }];
  }

  #appendDecision(from: User, to: User, status: DecisionStatus): void {
    const decision: DecisionRow = { from, to, status };
    this.#decisions.push(decision);
    this.#decisionsByPair.set(orderedKey(from, to), decision);
  }

  #setPassed(from: User, to: User): void {
    const decision = this.#decisionsByPair.get(orderedKey(from, to));
    if (decision !== undefined) decision.status = "PASSED";
  }
}

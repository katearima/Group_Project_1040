import { type Persistence, plain } from "../persistence.ts";

export type User = string;
export type Entries = string[];
export type RecommendationStatus = "AVAILABLE" | "SEE_LATER" | "PASSED" | "INTERESTED";

export interface PreferencesRow {
  owner: User;
  preferredSkills: Entries;
  preferredInterests: Entries;
  preferredUniversities: Entries;
  preferredDistance?: number;
  preferredAvailability?: number;
}

export interface RecommendationRow {
  viewer: User;
  candidate: User;
  score: number;
  status: RecommendationStatus;
  eligible: boolean;
}

/** One person's recommendation data, supplied by the caller and never stored. */
export interface RecommendationData {
  skills: Entries;
  interests: Entries;
  university: string;
  latitude: number;
  longitude: number;
  availability: number;
}

export interface PreferencesQueryRow {
  skills: Entries;
  interests: Entries;
  universities: Entries;
  distance?: number;
  availability?: number;
}

export const INVALID_PREFERENCES_DETAIL =
  "Preferred distance and availability must be nonnegative, and preferred entries must not be empty.";
export const SELF_RECOMMENDATION_DETAIL = "A person cannot be recommended to themselves.";
export const INVALID_RECOMMENDATION_DATA_DETAIL =
  "Recommendation data must have nonempty entries, valid coordinates, and nonnegative availability.";
export const NOT_IN_FEED_DETAIL = "This person is not in your current feed.";
export const PASS_RECOMMENDATION_NOT_FOUND_DETAIL = "There is no recommendation of this person.";
export const INTEREST_RECOMMENDATION_NOT_FOUND_DETAIL = "There is no recommendation of this person.";
export const RECOMMENDATION_ALREADY_DECIDED_DETAIL =
  "You have already decided about this recommendation.";
export const DEACTIVATE_RECOMMENDATION_NOT_FOUND_DETAIL =
  "There is no recommendation of this person.";

/** Refusal INVALID_PREFERENCES. */
export class InvalidPreferences extends Error {}
/** Refusal SELF_RECOMMENDATION. */
export class SelfRecommendation extends Error {}
/** Refusal INVALID_RECOMMENDATION_DATA. */
export class InvalidRecommendationData extends Error {}
/** Refusal NOT_IN_FEED. */
export class NotInFeed extends Error {}
/** Refusal PASS_RECOMMENDATION_NOT_FOUND. */
export class PassRecommendationNotFound extends Error {}
/** Refusal INTEREST_RECOMMENDATION_NOT_FOUND. */
export class InterestRecommendationNotFound extends Error {}
/** Refusal RECOMMENDATION_ALREADY_DECIDED. */
export class RecommendationAlreadyDecided extends Error {}
/** Refusal DEACTIVATE_RECOMMENDATION_NOT_FOUND. */
export class DeactivateRecommendationNotFound extends Error {}

const EARTH_RADIUS_KM = 6371;

function isBlank(text: string): boolean {
  return text.trim().length === 0;
}

function validEntries(entries: unknown): entries is Entries {
  return (
    Array.isArray(entries) &&
    entries.every((entry) => typeof entry === "string" && !isBlank(entry))
  );
}

/** An omitted optional number arrives as undefined or null. */
function supplied(value: number | null | undefined): value is number {
  return value !== undefined && value !== null;
}

function validData(data: RecommendationData): boolean {
  return (
    validEntries(data.skills) &&
    validEntries(data.interests) &&
    typeof data.university === "string" &&
    Number.isFinite(data.latitude) &&
    data.latitude >= -90 &&
    data.latitude <= 90 &&
    Number.isFinite(data.longitude) &&
    data.longitude >= -180 &&
    data.longitude <= 180 &&
    Number.isFinite(data.availability) &&
    data.availability >= 0
  );
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

/** Normalized entries, each counted once. */
function normalizedSet(entries: Entries): Set<string> {
  return new Set(entries.map(normalize));
}

/** Fraction of `wanted` found in `have`; an empty `wanted` gives 1. */
function fractionFound(wanted: Set<string>, have: Set<string>): number {
  if (wanted.size === 0) return 1;
  let found = 0;
  for (const entry of wanted) if (have.has(entry)) found += 1;
  return found / wanted.size;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle (haversine) distance in kilometers on a 6371 km sphere. */
export function greatCircleKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  if (latitudeA === latitudeB && longitudeA === longitudeB) return 0;
  const dLat = toRadians(latitudeB - latitudeA);
  const dLon = toRadians(longitudeB - longitudeA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) * Math.cos(toRadians(latitudeB)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

const NO_PREFERENCES: Omit<PreferencesRow, "owner"> = {
  preferredSkills: [],
  preferredInterests: [],
  preferredUniversities: [],
};

/** The five-factor score from the viewer's perspective. */
function score(
  viewerPreferences: Omit<PreferencesRow, "owner">,
  candidatePreferences: Omit<PreferencesRow, "owner">,
  viewer: RecommendationData,
  candidate: RecommendationData,
): number {
  const viewerSkills = normalizedSet(viewer.skills);
  const candidateSkills = normalizedSet(candidate.skills);
  const skills =
    (fractionFound(normalizedSet(viewerPreferences.preferredSkills), candidateSkills) +
      fractionFound(normalizedSet(candidatePreferences.preferredSkills), viewerSkills)) /
    2;

  const preferredInterests = normalizedSet(viewerPreferences.preferredInterests);
  const wantedInterests =
    preferredInterests.size > 0 ? preferredInterests : normalizedSet(viewer.interests);
  const interests = fractionFound(wantedInterests, normalizedSet(candidate.interests));

  const universities = normalizedSet(viewerPreferences.preferredUniversities);
  const university =
    universities.size === 0 || universities.has(normalize(candidate.university)) ? 1 : 0;

  const minimum = viewerPreferences.preferredAvailability;
  const availability =
    !supplied(minimum) || minimum === 0 ? 1 : Math.min(1, candidate.availability / minimum);

  const maximum = viewerPreferences.preferredDistance;
  let proximity = 1;
  if (supplied(maximum)) {
    const distance = greatCircleKm(
      viewer.latitude,
      viewer.longitude,
      candidate.latitude,
      candidate.longitude,
    );
    proximity = maximum === 0 ? (distance === 0 ? 1 : 0) : Math.max(0, 1 - distance / maximum);
  }

  return (skills + interests + university + availability + proximity) / 5;
}

function pairKey(viewer: User, candidate: User): string {
  return JSON.stringify([viewer, candidate]);
}

export interface RecommendingInitialState {
  preferences?: Iterable<PreferencesRow>;
  recommendations?: Iterable<RecommendationRow>;
  /** Keeps preferences and recommendations across restarts; its saved state replaces the two lists above. */
  persistence?: Persistence<{ preferences: PreferencesRow[]; recommendations: RecommendationRow[] }>;
}

export interface RefreshInput {
  viewer: User;
  candidate: User;
  viewerSkills: Entries;
  viewerInterests: Entries;
  viewerUniversity: string;
  viewerLatitude: number;
  viewerLongitude: number;
  viewerAvailability: number;
  candidateSkills: Entries;
  candidateInterests: Entries;
  candidateUniversity: string;
  candidateLatitude: number;
  candidateLongitude: number;
  candidateAvailability: number;
}

export class RecommendingConcept {
  #preferences = new Map<User, PreferencesRow>();
  /** Recommendations in creation order. */
  #recommendations: RecommendationRow[] = [];
  #byPair = new Map<string, RecommendationRow>();

  readonly #persistence:
    | Persistence<{ preferences: PreferencesRow[]; recommendations: RecommendationRow[] }>
    | undefined;

  constructor({ preferences = [], recommendations = [], persistence }: RecommendingInitialState = {}) {
    this.#persistence = persistence;
    preferences = persistence?.initial?.preferences ?? preferences;
    recommendations = persistence?.initial?.recommendations ?? recommendations;
    for (const row of preferences) this.#preferences.set(row.owner, { ...row });
    for (const row of recommendations) {
      const copy = { ...row };
      this.#recommendations.push(copy);
      this.#byPair.set(pairKey(copy.viewer, copy.candidate), copy);
    }
  }

  setPreferences({
    user,
    skills,
    interests,
    universities,
    distance,
    availability,
  }: {
    user: User;
    skills: Entries;
    interests: Entries;
    universities: Entries;
    distance?: number | null;
    availability?: number | null;
  }): Record<string, never> {
    const numberInvalid = (value: number | null | undefined) =>
      supplied(value) && (!Number.isFinite(value) || value < 0);
    if (
      numberInvalid(distance) ||
      numberInvalid(availability) ||
      !validEntries(skills) ||
      !validEntries(interests) ||
      !validEntries(universities)
    ) {
      throw new InvalidPreferences(INVALID_PREFERENCES_DETAIL);
    }
    const row: PreferencesRow = {
      owner: user,
      preferredSkills: [...skills],
      preferredInterests: [...interests],
      preferredUniversities: [...universities],
    };
    if (supplied(distance)) row.preferredDistance = distance;
    if (supplied(availability)) row.preferredAvailability = availability;
    this.#preferences.set(user, row);
    this.#changed();
    return {};
  }

  refreshRecommendation(input: RefreshInput): { score: number } {
    const { viewer, candidate } = input;
    if (viewer === candidate) throw new SelfRecommendation(SELF_RECOMMENDATION_DETAIL);
    const viewerData: RecommendationData = {
      skills: input.viewerSkills,
      interests: input.viewerInterests,
      university: input.viewerUniversity,
      latitude: input.viewerLatitude,
      longitude: input.viewerLongitude,
      availability: input.viewerAvailability,
    };
    const candidateData: RecommendationData = {
      skills: input.candidateSkills,
      interests: input.candidateInterests,
      university: input.candidateUniversity,
      latitude: input.candidateLatitude,
      longitude: input.candidateLongitude,
      availability: input.candidateAvailability,
    };
    if (!validData(viewerData) || !validData(candidateData)) {
      throw new InvalidRecommendationData(INVALID_RECOMMENDATION_DATA_DETAIL);
    }
    const value = score(
      this.#preferences.get(viewer) ?? NO_PREFERENCES,
      this.#preferences.get(candidate) ?? NO_PREFERENCES,
      viewerData,
      candidateData,
    );
    const key = pairKey(viewer, candidate);
    const existing = this.#byPair.get(key);
    if (existing === undefined) {
      const row: RecommendationRow = {
        viewer,
        candidate,
        score: value,
        status: "AVAILABLE",
        eligible: true,
      };
      this.#recommendations.push(row);
      this.#byPair.set(key, row);
    } else {
      existing.score = value;
      existing.eligible = true;
    }
    this.#changed();
    return { score: value };
  }

  seeLater({ viewer, candidate }: { viewer: User; candidate: User }): Record<string, never> {
    const row = this.#byPair.get(pairKey(viewer, candidate));
    if (row === undefined || !row.eligible || row.status !== "AVAILABLE") {
      throw new NotInFeed(NOT_IN_FEED_DETAIL);
    }
    row.status = "SEE_LATER";
    this.#changed();
    return {};
  }

  markPassed({ viewer, candidate }: { viewer: User; candidate: User }): Record<string, never> {
    const row = this.#byPair.get(pairKey(viewer, candidate));
    if (row === undefined) throw new PassRecommendationNotFound(PASS_RECOMMENDATION_NOT_FOUND_DETAIL);
    row.status = "PASSED";
    this.#changed();
    return {};
  }

  markInterested({ viewer, candidate }: { viewer: User; candidate: User }): Record<string, never> {
    const row = this.#byPair.get(pairKey(viewer, candidate));
    if (row === undefined) {
      throw new InterestRecommendationNotFound(INTEREST_RECOMMENDATION_NOT_FOUND_DETAIL);
    }
    if (row.status === "PASSED" || row.status === "INTERESTED") {
      throw new RecommendationAlreadyDecided(RECOMMENDATION_ALREADY_DECIDED_DETAIL);
    }
    row.status = "INTERESTED";
    this.#changed();
    return {};
  }

  startNewSession({ viewer }: { viewer: User }): Record<string, never> {
    for (const row of this.#recommendations) {
      if (row.viewer === viewer && row.status === "SEE_LATER") row.status = "AVAILABLE";
    }
    this.#changed();
    return {};
  }

  deactivateRecommendation({
    viewer,
    candidate,
  }: {
    viewer: User;
    candidate: User;
  }): Record<string, never> {
    const row = this.#byPair.get(pairKey(viewer, candidate));
    if (row === undefined) {
      throw new DeactivateRecommendationNotFound(DEACTIVATE_RECOMMENDATION_NOT_FOUND_DETAIL);
    }
    row.eligible = false;
    this.#changed();
    return {};
  }

  #changed(): void {
    this.#persistence?.save({
      preferences: plain(this.#preferences.values()),
      recommendations: plain(this.#recommendations),
    });
  }

  _getFeed({ viewer }: { viewer: User }): Array<{ candidate: User; score: number }> {
    // Array.prototype.sort is stable, so equal scores keep creation order.
    return this.#recommendations
      .filter((row) => row.viewer === viewer && row.eligible && row.status === "AVAILABLE")
      .map((row) => ({ candidate: row.candidate, score: row.score }))
      .sort((a, b) => b.score - a.score);
  }

  _getPreferences({ user }: { user: User }): PreferencesQueryRow[] {
    const row = this.#preferences.get(user);
    if (row === undefined) return [];
    const result: PreferencesQueryRow = {
      skills: [...row.preferredSkills],
      interests: [...row.preferredInterests],
      universities: [...row.preferredUniversities],
    };
    if (row.preferredDistance !== undefined) result.distance = row.preferredDistance;
    if (row.preferredAvailability !== undefined) result.availability = row.preferredAvailability;
    return [result];
  }

  _recommendation({
    viewer,
    candidate,
  }: {
    viewer: User;
    candidate: User;
  }): Array<{ score: number; status: RecommendationStatus; eligible: boolean }> {
    const row = this.#byPair.get(pairKey(viewer, candidate));
    return row === undefined ? [] : [{ score: row.score, status: row.status, eligible: row.eligible }];
  }
}

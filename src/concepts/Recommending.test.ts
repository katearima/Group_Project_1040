import { describe, expect, test } from "bun:test";
import {
  DeactivateRecommendationNotFound,
  greatCircleKm,
  InterestRecommendationNotFound,
  InvalidPreferences,
  InvalidRecommendationData,
  NotInFeed,
  PassRecommendationNotFound,
  RecommendationAlreadyDecided,
  RecommendingConcept,
  SelfRecommendation,
  type RecommendationData,
} from "./Recommending.ts";

const MIT = { latitude: 42.3601, longitude: -71.0942 };
const BU = { latitude: 42.3505, longitude: -71.1054 };

function data(overrides: Partial<RecommendationData> = {}): RecommendationData {
  return {
    skills: [],
    interests: [],
    university: "MIT",
    ...MIT,
    availability: 10,
    ...overrides,
  };
}

function refresh(
  c: RecommendingConcept,
  viewer: string,
  candidate: string,
  viewerData: RecommendationData = data(),
  candidateData: RecommendationData = data(),
) {
  return c.refreshRecommendation({
    viewer,
    candidate,
    viewerSkills: viewerData.skills,
    viewerInterests: viewerData.interests,
    viewerUniversity: viewerData.university,
    viewerLatitude: viewerData.latitude,
    viewerLongitude: viewerData.longitude,
    viewerAvailability: viewerData.availability,
    candidateSkills: candidateData.skills,
    candidateInterests: candidateData.interests,
    candidateUniversity: candidateData.university,
    candidateLatitude: candidateData.latitude,
    candidateLongitude: candidateData.longitude,
    candidateAvailability: candidateData.availability,
  });
}

function prefs(
  c: RecommendingConcept,
  user: string,
  p: {
    skills?: string[];
    interests?: string[];
    universities?: string[];
    distance?: number | null;
    availability?: number | null;
  } = {},
) {
  return c.setPreferences({
    user,
    skills: p.skills ?? [],
    interests: p.interests ?? [],
    universities: p.universities ?? [],
    distance: p.distance,
    availability: p.availability,
  });
}

describe("RecommendingConcept construction", () => {
  test("constructs with no arguments and has zero runtime arity", () => {
    expect(RecommendingConcept.length).toBe(0);
    expect(new RecommendingConcept()._getFeed({ viewer: "keti" })).toEqual([]);
  });
});

describe("setPreferences", () => {
  test("creates, replaces, and clears omitted numbers", () => {
    const c = new RecommendingConcept();
    expect(c._getPreferences({ user: "keti" })).toEqual([]);
    expect(prefs(c, "keti", { skills: ["Go"], distance: 5, availability: 10 })).toEqual({});
    expect(c._getPreferences({ user: "keti" })).toEqual([
      { skills: ["Go"], interests: [], universities: [], distance: 5, availability: 10 },
    ]);
    prefs(c, "keti", { interests: ["travel"], distance: null });
    expect(c._getPreferences({ user: "keti" })).toEqual([
      { skills: [], interests: ["travel"], universities: [] },
    ]);
  });

  test("accepts zero numbers", () => {
    const c = new RecommendingConcept();
    prefs(c, "keti", { distance: 0, availability: 0 });
    expect(c._getPreferences({ user: "keti" })[0]).toMatchObject({ distance: 0, availability: 0 });
  });

  test.each([
    ["negative distance", { distance: -1 }],
    ["negative availability", { availability: -0.5 }],
    ["blank skill", { skills: ["  "] }],
    ["empty interest", { interests: [""] }],
    ["blank university", { universities: ["MIT", " "] }],
  ])("refuses %s without changes", (_label, p) => {
    const c = new RecommendingConcept();
    prefs(c, "keti", { skills: ["Go"] });
    expect(() => prefs(c, "keti", p)).toThrow(InvalidPreferences);
    expect(c._getPreferences({ user: "keti" })).toEqual([
      { skills: ["Go"], interests: [], universities: [] },
    ]);
  });
});

describe("refreshRecommendation", () => {
  test("creates an AVAILABLE eligible recommendation with full score by default", () => {
    const c = new RecommendingConcept();
    expect(refresh(c, "keti", "bumba")).toEqual({ score: 1 });
    expect(c._recommendation({ viewer: "keti", candidate: "bumba" })).toEqual([
      { score: 1, status: "AVAILABLE", eligible: true },
    ]);
    expect(c._recommendation({ viewer: "bumba", candidate: "keti" })).toEqual([]);
  });

  test("refuses self-recommendation and invalid data without changes", () => {
    const c = new RecommendingConcept();
    expect(() => refresh(c, "keti", "keti")).toThrow(SelfRecommendation);
    expect(() => refresh(c, "keti", "bumba", data({ latitude: 91 }))).toThrow(
      InvalidRecommendationData,
    );
    expect(() => refresh(c, "keti", "bumba", data(), data({ skills: [" "] }))).toThrow(
      InvalidRecommendationData,
    );
    expect(() => refresh(c, "keti", "bumba", data(), data({ availability: -1 }))).toThrow(
      InvalidRecommendationData,
    );
    expect(c._recommendation({ viewer: "keti", candidate: "bumba" })).toEqual([]);
  });

  test("an empty university is valid data", () => {
    const c = new RecommendingConcept();
    expect(refresh(c, "keti", "bumba", data(), data({ university: "" }))).toEqual({ score: 1 });
  });

  test("updates the score, keeps the status, and re-enables eligibility", () => {
    const c = new RecommendingConcept();
    refresh(c, "keti", "bumba");
    c.markPassed({ viewer: "keti", candidate: "bumba" });
    c.deactivateRecommendation({ viewer: "keti", candidate: "bumba" });
    prefs(c, "keti", { universities: ["BU"] });
    expect(refresh(c, "keti", "bumba")).toEqual({ score: 0.8 });
    expect(c._recommendation({ viewer: "keti", candidate: "bumba" })).toEqual([
      { score: 0.8, status: "PASSED", eligible: true },
    ]);
    expect(c._getFeed({ viewer: "keti" })).toEqual([]);
  });
});

describe("score factors", () => {
  test("prose example: factors 1, 0.5, 1, 1, 0.5 average to 0.8", () => {
    const c = new RecommendingConcept();
    // interests 0.5: one of two preferred interests found.
    // proximity 0.5: preferred distance is twice the actual distance.
    const distance = greatCircleKm(MIT.latitude, MIT.longitude, BU.latitude, BU.longitude);
    prefs(c, "keti", { interests: ["travel", "data"], distance: distance * 2 });
    const { score } = refresh(
      c,
      "keti",
      "bumba",
      data(),
      data({ interests: ["Travel"], ...BU }),
    );
    expect(score).toBeCloseTo(0.8, 10);
  });

  test("skills average both directions; empty preference gives 1", () => {
    const c = new RecommendingConcept();
    prefs(c, "bumba", { skills: ["software engineering", "design"] });
    // keti→bumba: keti prefers none (1); bumba prefers 2, keti has 1 (0.5) → 0.75.
    const { score } = refresh(
      c,
      "keti",
      "bumba",
      data({ skills: [" Software Engineering "] }),
      data(),
    );
    expect(score).toBeCloseTo((0.75 + 4) / 5, 10);
  });

  test("normalization trims, ignores case, and counts duplicates once", () => {
    const c = new RecommendingConcept();
    prefs(c, "keti", { skills: ["Go", " go ", "Rust"] });
    // Preferred {go, rust}; candidate has go → 0.5 one way, 1 the other → 0.75.
    const { score } = refresh(c, "keti", "bumba", data(), data({ skills: ["GO", "go"] }));
    expect(score).toBeCloseTo((0.75 + 4) / 5, 10);
  });

  test("interests fall back to the viewer's own interests, then to 1", () => {
    const c = new RecommendingConcept();
    let { score } = refresh(
      c,
      "keti",
      "bumba",
      data({ interests: ["travel", "music"] }),
      data({ interests: ["travel"] }),
    );
    expect(score).toBeCloseTo((0.5 + 4) / 5, 10);
    ({ score } = refresh(c, "keti", "ana", data({ interests: [] }), data({ interests: ["x"] })));
    expect(score).toBe(1);
  });

  test("university matches only a preferred one, normalized", () => {
    const c = new RecommendingConcept();
    prefs(c, "keti", { universities: ["MIT", "Harvard"] });
    expect(refresh(c, "keti", "a", data(), data({ university: " mit " })).score).toBe(1);
    expect(refresh(c, "keti", "b", data(), data({ university: "BU" })).score).toBeCloseTo(0.8, 10);
  });

  test("availability is a capped ratio; zero minimum gives 1", () => {
    const c = new RecommendingConcept();
    prefs(c, "keti", { availability: 20 });
    expect(refresh(c, "keti", "a", data(), data({ availability: 5 })).score).toBeCloseTo(
      (0.25 + 4) / 5,
      10,
    );
    expect(refresh(c, "keti", "b", data(), data({ availability: 40 })).score).toBe(1);
    prefs(c, "keti", { availability: 0 });
    expect(refresh(c, "keti", "a", data(), data({ availability: 0 })).score).toBe(1);
  });

  test("proximity decays linearly and floors at 0; zero distance preference is exact", () => {
    const c = new RecommendingConcept();
    prefs(c, "keti", { distance: 1 });
    expect(refresh(c, "keti", "far", data(), data({ latitude: 0, longitude: 0 })).score).toBeCloseTo(
      0.8,
      10,
    );
    prefs(c, "keti", { distance: 0 });
    expect(refresh(c, "keti", "same", data(), data()).score).toBe(1);
    expect(refresh(c, "keti", "near", data(), data(BU)).score).toBeCloseTo(0.8, 10);
  });

  test("great-circle distance on a 6371 km sphere", () => {
    expect(greatCircleKm(0, 0, 0, 0)).toBe(0);
    // A quarter of the equator.
    expect(greatCircleKm(0, 0, 0, 90)).toBeCloseTo((Math.PI / 2) * 6371, 6);
    // Pole to pole.
    expect(greatCircleKm(90, 0, -90, 0)).toBeCloseTo(Math.PI * 6371, 6);
  });
});

describe("status actions and feed", () => {
  test("feed lists eligible AVAILABLE recommendations, highest score first, ties oldest first", () => {
    const c = new RecommendingConcept();
    prefs(c, "keti", { universities: ["MIT"] });
    refresh(c, "keti", "low", data(), data({ university: "BU" }));
    refresh(c, "keti", "first", data(), data());
    refresh(c, "keti", "second", data(), data());
    refresh(c, "bumba", "keti");
    expect(c._getFeed({ viewer: "keti" })).toEqual([
      { candidate: "first", score: 1 },
      { candidate: "second", score: 1 },
      { candidate: "low", score: 0.8 },
    ]);
    expect(c._getFeed({ viewer: "nobody" })).toEqual([]);
  });

  test("seeLater hides until a new session; refused when not in the feed", () => {
    const c = new RecommendingConcept();
    refresh(c, "keti", "bumba");
    expect(c.seeLater({ viewer: "keti", candidate: "bumba" })).toEqual({});
    expect(c._getFeed({ viewer: "keti" })).toEqual([]);
    expect(() => c.seeLater({ viewer: "keti", candidate: "bumba" })).toThrow(NotInFeed);
    expect(() => c.seeLater({ viewer: "keti", candidate: "nobody" })).toThrow(NotInFeed);
    expect(c.startNewSession({ viewer: "keti" })).toEqual({});
    expect(c._getFeed({ viewer: "keti" })).toEqual([{ candidate: "bumba", score: 1 }]);
    c.deactivateRecommendation({ viewer: "keti", candidate: "bumba" });
    expect(() => c.seeLater({ viewer: "keti", candidate: "bumba" })).toThrow(NotInFeed);
  });

  test("startNewSession only restores SEE_LATER for that viewer", () => {
    const c = new RecommendingConcept();
    refresh(c, "keti", "a");
    refresh(c, "keti", "b");
    refresh(c, "ana", "a");
    c.seeLater({ viewer: "keti", candidate: "a" });
    c.seeLater({ viewer: "ana", candidate: "a" });
    c.markPassed({ viewer: "keti", candidate: "b" });
    c.startNewSession({ viewer: "keti" });
    expect(c._recommendation({ viewer: "keti", candidate: "a" })[0]!.status).toBe("AVAILABLE");
    expect(c._recommendation({ viewer: "keti", candidate: "b" })[0]!.status).toBe("PASSED");
    expect(c._recommendation({ viewer: "ana", candidate: "a" })[0]!.status).toBe("SEE_LATER");
    expect(c.startNewSession({ viewer: "nobody" })).toEqual({});
  });

  test("markPassed works from any status and repeats", () => {
    const c = new RecommendingConcept();
    expect(() => c.markPassed({ viewer: "keti", candidate: "bumba" })).toThrow(
      PassRecommendationNotFound,
    );
    refresh(c, "keti", "bumba");
    c.markInterested({ viewer: "keti", candidate: "bumba" });
    expect(c.markPassed({ viewer: "keti", candidate: "bumba" })).toEqual({});
    expect(c.markPassed({ viewer: "keti", candidate: "bumba" })).toEqual({});
    expect(c._recommendation({ viewer: "keti", candidate: "bumba" })[0]!.status).toBe("PASSED");
  });

  test("markInterested from AVAILABLE or SEE_LATER only", () => {
    const c = new RecommendingConcept();
    expect(() => c.markInterested({ viewer: "keti", candidate: "bumba" })).toThrow(
      InterestRecommendationNotFound,
    );
    refresh(c, "keti", "bumba");
    refresh(c, "keti", "ana");
    c.seeLater({ viewer: "keti", candidate: "ana" });
    expect(c.markInterested({ viewer: "keti", candidate: "bumba" })).toEqual({});
    expect(c.markInterested({ viewer: "keti", candidate: "ana" })).toEqual({});
    expect(() => c.markInterested({ viewer: "keti", candidate: "bumba" })).toThrow(
      RecommendationAlreadyDecided,
    );
    refresh(c, "keti", "dato");
    c.markPassed({ viewer: "keti", candidate: "dato" });
    expect(() => c.markInterested({ viewer: "keti", candidate: "dato" })).toThrow(
      RecommendationAlreadyDecided,
    );
    expect(c._getFeed({ viewer: "keti" })).toEqual([]);
  });

  test("deactivateRecommendation hides from the feed and repeats", () => {
    const c = new RecommendingConcept();
    expect(() => c.deactivateRecommendation({ viewer: "keti", candidate: "bumba" })).toThrow(
      DeactivateRecommendationNotFound,
    );
    refresh(c, "keti", "bumba");
    expect(c.deactivateRecommendation({ viewer: "keti", candidate: "bumba" })).toEqual({});
    expect(c.deactivateRecommendation({ viewer: "keti", candidate: "bumba" })).toEqual({});
    expect(c._getFeed({ viewer: "keti" })).toEqual([]);
    expect(c._recommendation({ viewer: "keti", candidate: "bumba" })[0]!.eligible).toBe(false);
  });
});

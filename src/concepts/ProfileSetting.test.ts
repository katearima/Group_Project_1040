import { describe, expect, test } from "bun:test";
import {
  EmptyPitch,
  InvalidProfile,
  InvalidProfileUpdate,
  PitchNotFounder,
  PitchProfileNotFound,
  ProfileAlreadyExists,
  ProfileIncomplete,
  ProfileNotVisible,
  ProfileSettingConcept,
  PublishProfileNotFound,
  UpdateProfileNotFound,
  UpdateWouldUnpublish,
  type ProfileFields,
  type Role,
} from "./ProfileSetting.ts";

function fields(overrides: Partial<ProfileFields> = {}): ProfileFields {
  return {
    name: "Keti A",
    university: "MIT",
    major: "Computer Science",
    graduationYear: 2027,
    skills: ["software engineering"],
    experience: "",
    interests: ["data tools"],
    location: "MIT campus",
    latitude: 42.36,
    longitude: -71.09,
    availability: 10,
    ...overrides,
  };
}

function fresh() {
  let next = 0;
  return new ProfileSettingConcept({ freshProfile: () => `p${++next}` });
}

function create(c: ProfileSettingConcept, user: string, role: Role, overrides: Partial<ProfileFields> = {}) {
  return c.createProfile({ user, role, ...fields(overrides) });
}

describe("ProfileSettingConcept construction", () => {
  test("constructs with no arguments and has zero runtime arity", () => {
    expect(ProfileSettingConcept.length).toBe(0);
    const c = new ProfileSettingConcept();
    expect(c._getVisibleProfiles()).toEqual([]);
  });
});

describe("createProfile", () => {
  test("creates a hidden profile without a pitch and returns its identity", () => {
    const c = fresh();
    expect(create(c, "keti", "BUILDER")).toEqual({ profile: "p1" });
    expect(c._getProfile({ user: "keti" })).toEqual([
      { profile: "p1", role: "BUILDER", ...fields(), visible: false },
    ]);
    expect(c._getVisibleProfiles()).toEqual([]);
  });

  test("refuses a second profile for the same user without changes", () => {
    const c = fresh();
    create(c, "keti", "BUILDER");
    const before = c._getProfile({ user: "keti" });
    expect(() => create(c, "keti", "FOUNDER", { name: "Other" })).toThrow(ProfileAlreadyExists);
    expect(c._getProfile({ user: "keti" })).toEqual(before);
  });

  test.each([
    ["zero graduation year", { graduationYear: 0 }],
    ["fractional graduation year", { graduationYear: 2027.5 }],
    ["latitude out of range", { latitude: 91 }],
    ["longitude out of range", { longitude: -181 }],
    ["negative availability", { availability: -1 }],
    ["whitespace skill", { skills: ["ok", "  "] }],
    ["empty interest", { interests: [""] }],
  ])("refuses invalid data: %s", (_label, overrides) => {
    const c = fresh();
    expect(() => create(c, "keti", "BUILDER", overrides as Partial<ProfileFields>)).toThrow(
      InvalidProfile,
    );
    expect(c._getProfile({ user: "keti" })).toEqual([]);
  });

  test("allows draft profiles with empty text and empty sets", () => {
    const c = fresh();
    create(c, "keti", "BUILDER", { name: " ", location: "", skills: [], interests: [] });
    expect(c._getProfile({ user: "keti" })).toHaveLength(1);
  });

  test("accepts boundary coordinates", () => {
    const c = fresh();
    create(c, "keti", "BUILDER", { latitude: -90, longitude: 180 });
    expect(c._getProfile({ user: "keti" })[0]!.latitude).toBe(-90);
  });
});

describe("setStartupPitch", () => {
  test("sets a founder's pitch and repeats successfully", () => {
    const c = fresh();
    create(c, "bumba", "FOUNDER");
    expect(c.setStartupPitch({ user: "bumba", pitch: "A data tool" })).toEqual({});
    expect(c.setStartupPitch({ user: "bumba", pitch: "A data tool" })).toEqual({});
    expect(c._getProfile({ user: "bumba" })[0]!.startupPitch).toBe("A data tool");
  });

  test("refuses missing profile, builders, and empty pitches", () => {
    const c = fresh();
    expect(() => c.setStartupPitch({ user: "nobody", pitch: "x" })).toThrow(PitchProfileNotFound);
    create(c, "keti", "BUILDER");
    expect(() => c.setStartupPitch({ user: "keti", pitch: "x" })).toThrow(PitchNotFounder);
    create(c, "bumba", "FOUNDER");
    expect(() => c.setStartupPitch({ user: "bumba", pitch: "   " })).toThrow(EmptyPitch);
    expect(c._getProfile({ user: "keti" })[0]!.startupPitch).toBeUndefined();
    expect(c._getProfile({ user: "bumba" })[0]!.startupPitch).toBeUndefined();
  });
});

describe("publishProfile and hideProfile", () => {
  test("publishes a complete builder profile; repeat succeeds", () => {
    const c = fresh();
    create(c, "keti", "BUILDER");
    expect(c.publishProfile({ user: "keti" })).toEqual({});
    expect(c.publishProfile({ user: "keti" })).toEqual({});
    expect(c._getVisibleProfiles()).toEqual([{ profile: "p1", owner: "keti" }]);
  });

  test("refuses a founder without a pitch, then publishes after the pitch", () => {
    const c = fresh();
    create(c, "bumba", "FOUNDER");
    expect(() => c.publishProfile({ user: "bumba" })).toThrow(ProfileIncomplete);
    expect(c._getProfile({ user: "bumba" })[0]!.visible).toBe(false);
    c.setStartupPitch({ user: "bumba", pitch: "Travel app" });
    c.publishProfile({ user: "bumba" });
    expect(c._getProfile({ user: "bumba" })[0]!.visible).toBe(true);
  });

  test.each([
    ["blank name", { name: "  " }],
    ["blank location", { location: "" }],
    ["no skills", { skills: [] }],
    ["no interests", { interests: [] }],
  ])("refuses an incomplete profile: %s", (_label, overrides) => {
    const c = fresh();
    create(c, "keti", "BUILDER", overrides as Partial<ProfileFields>);
    expect(() => c.publishProfile({ user: "keti" })).toThrow(ProfileIncomplete);
    expect(c._getVisibleProfiles()).toEqual([]);
  });

  test("refuses publishing without a profile", () => {
    expect(() => fresh().publishProfile({ user: "nobody" })).toThrow(PublishProfileNotFound);
  });

  test("hides a visible profile and refuses hiding again", () => {
    const c = fresh();
    create(c, "keti", "BUILDER");
    expect(() => c.hideProfile({ user: "keti" })).toThrow(ProfileNotVisible);
    c.publishProfile({ user: "keti" });
    expect(c.hideProfile({ user: "keti" })).toEqual({});
    expect(c._getVisibleProfiles()).toEqual([]);
    expect(() => c.hideProfile({ user: "keti" })).toThrow(ProfileNotVisible);
    expect(() => c.hideProfile({ user: "nobody" })).toThrow(ProfileNotVisible);
  });
});

describe("updateProfile", () => {
  test("replaces editable fields and keeps role, pitch, and visibility", () => {
    const c = fresh();
    create(c, "bumba", "FOUNDER");
    c.setStartupPitch({ user: "bumba", pitch: "Pitch" });
    c.publishProfile({ user: "bumba" });
    const next = fields({ name: "Bumba B", skills: ["sales", "design"], availability: 20 });
    expect(c.updateProfile({ user: "bumba", ...next })).toEqual({});
    expect(c._getProfile({ user: "bumba" })).toEqual([
      { profile: "p1", role: "FOUNDER", ...next, startupPitch: "Pitch", visible: true },
    ]);
  });

  test("refuses a missing profile and invalid data without changes", () => {
    const c = fresh();
    expect(() => c.updateProfile({ user: "nobody", ...fields() })).toThrow(UpdateProfileNotFound);
    create(c, "keti", "BUILDER");
    const before = c._getProfile({ user: "keti" });
    expect(() => c.updateProfile({ user: "keti", ...fields({ latitude: 100 }) })).toThrow(
      InvalidProfileUpdate,
    );
    expect(c._getProfile({ user: "keti" })).toEqual(before);
  });

  test("refuses making a visible profile incomplete, allows it while hidden", () => {
    const c = fresh();
    create(c, "keti", "BUILDER");
    c.publishProfile({ user: "keti" });
    const before = c._getProfile({ user: "keti" });
    expect(() => c.updateProfile({ user: "keti", ...fields({ skills: [] }) })).toThrow(
      UpdateWouldUnpublish,
    );
    expect(c._getProfile({ user: "keti" })).toEqual(before);
    c.hideProfile({ user: "keti" });
    expect(c.updateProfile({ user: "keti", ...fields({ skills: [] }) })).toEqual({});
    expect(c._getProfile({ user: "keti" })[0]!.skills).toEqual([]);
  });
});

describe("reads", () => {
  test("_getProfile answers no row for an unknown user", () => {
    expect(fresh()._getProfile({ user: "nobody" })).toEqual([]);
  });

  test("_recommendationData returns role, visibility, and data", () => {
    const c = fresh();
    create(c, "keti", "BUILDER");
    expect(c._recommendationData({ user: "keti" })).toEqual([
      {
        role: "BUILDER",
        visible: false,
        skills: ["software engineering"],
        interests: ["data tools"],
        university: "MIT",
        latitude: 42.36,
        longitude: -71.09,
        availability: 10,
      },
    ]);
    expect(c._recommendationData({ user: "nobody" })).toEqual([]);
  });

  test("_visibleCandidates returns visible opposite-role profiles in creation order", () => {
    const c = fresh();
    create(c, "keti", "BUILDER");
    create(c, "bumba", "FOUNDER");
    create(c, "ana", "BUILDER");
    create(c, "dato", "FOUNDER");
    create(c, "eka", "FOUNDER");
    c.setStartupPitch({ user: "bumba", pitch: "x" });
    c.setStartupPitch({ user: "dato", pitch: "y" });
    c.publishProfile({ user: "dato" });
    c.publishProfile({ user: "bumba" });
    c.publishProfile({ user: "ana" });
    expect(c._visibleCandidates({ user: "keti" }).map((row) => row.candidate)).toEqual([
      "bumba",
      "dato",
    ]);
    expect(c._visibleCandidates({ user: "bumba" }).map((row) => row.candidate)).toEqual(["ana"]);
    expect(c._visibleCandidates({ user: "nobody" })).toEqual([]);
    expect(c._visibleCandidates({ user: "keti" })[0]).toEqual({
      candidate: "bumba",
      skills: ["software engineering"],
      interests: ["data tools"],
      university: "MIT",
      latitude: 42.36,
      longitude: -71.09,
      availability: 10,
    });
  });
});

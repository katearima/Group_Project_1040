import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { no, now, reaction, when, whether, where } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const { ProfileSetting, Recommending, Sessioning } = concepts;

/** Logic variables taken from a binding bag. */
export type Vars = Record<string, any>;

/**
 * Reads each named logic variable from a binding bag exactly once. Every bag read declares
 * a fresh logic variable, so helpers share these plain-object references instead of
 * re-reading the bag.
 */
export function take(bag: Vars, names: readonly string[]): Vars {
  const vars: Vars = {};
  for (const name of names) vars[name] = bag[name];
  return vars;
}

/** Resolves the session to the acting user at the flow's instant. */
export function sessionUser(v: Vars) {
  return where(now(v.time)).then(
    Sessioning.current({ session: v.session, now: v.time }).responds({ subject: v.user }),
  );
}

// ---------------------------------------------------------------------------------------
// Recommendation refresh (Reactions 1 and 2)
// ---------------------------------------------------------------------------------------

const DATA_FIELDS = ["Skills", "Interests", "University", "Latitude", "Longitude", "Availability"];

/** Variables the refresh binds: the user's and each candidate's data, per direction. */
const REFRESH_VARIABLES: readonly string[] = ["Forward", "Back"].flatMap((stage) => [
  `candidate${stage}`,
  ...DATA_FIELDS.flatMap((field) => [`user${field}${stage}`, `candidate${field}${stage}`]),
]);

/**
 * A fresh read of the user's recommendation data, only while the profile is visible, and
 * one row per visible opposite-role candidate.
 */
function visibleUserAndCandidates(v: Vars, stage: string) {
  return [
    ProfileSetting._recommendationData({ user: v.user }).is({
      visible: true,
      skills: v[`userSkills${stage}`],
      interests: v[`userInterests${stage}`],
      university: v[`userUniversity${stage}`],
      latitude: v[`userLatitude${stage}`],
      longitude: v[`userLongitude${stage}`],
      availability: v[`userAvailability${stage}`],
    }),
    ProfileSetting._visibleCandidates({ user: v.user }).is({
      candidate: v[`candidate${stage}`],
      skills: v[`candidateSkills${stage}`],
      interests: v[`candidateInterests${stage}`],
      university: v[`candidateUniversity${stage}`],
      latitude: v[`candidateLatitude${stage}`],
      longitude: v[`candidateLongitude${stage}`],
      availability: v[`candidateAvailability${stage}`],
    }),
  ] as const;
}

type Side = "user" | "candidate";

/** refreshRecommendation input with `viewerSide` as viewer and `candidateSide` as candidate. */
function refreshInput(v: Vars, stage: string, viewerSide: Side, candidateSide: Side) {
  const who = (side: Side) => (side === "user" ? v.user : v[`candidate${stage}`]);
  const field = (side: Side, name: string) => v[`${side}${name}${stage}`];
  return {
    viewer: who(viewerSide),
    candidate: who(candidateSide),
    viewerSkills: field(viewerSide, "Skills"),
    viewerInterests: field(viewerSide, "Interests"),
    viewerUniversity: field(viewerSide, "University"),
    viewerLatitude: field(viewerSide, "Latitude"),
    viewerLongitude: field(viewerSide, "Longitude"),
    viewerAvailability: field(viewerSide, "Availability"),
    candidateSkills: field(candidateSide, "Skills"),
    candidateInterests: field(candidateSide, "Interests"),
    candidateUniversity: field(candidateSide, "University"),
    candidateLatitude: field(candidateSide, "Latitude"),
    candidateLongitude: field(candidateSide, "Longitude"),
    candidateAvailability: field(candidateSide, "Availability"),
  };
}

/**
 * Builds the refresh reaction for one trigger: after the trigger succeeds, for every visible
 * opposite-role candidate of the (visible) user, refresh user→candidate, then re-read and
 * refresh candidate→user, so no read binding crosses an action. A hidden profile or an
 * empty candidate list refreshes nothing.
 */
export function refreshAfter(trigger: (user: unknown) => any) {
  return reaction((bag) => {
    const v = take(bag, ["user", ...REFRESH_VARIABLES]);
    return when(trigger(v.user))
      .where(...visibleUserAndCandidates(v, "Forward"))
      .then(
        Recommending.refreshRecommendation(refreshInput(v, "Forward", "user", "candidate")).responds(
          {},
        ),
      )
      .then(
        where(...visibleUserAndCandidates(v, "Back")).then(
          Recommending.refreshRecommendation(refreshInput(v, "Back", "candidate", "user")).responds(
            {},
          ),
        ),
      );
  });
}

/** Reaction 1: publishing refreshes the user's recommendations in both directions. */
const RefreshOnPublish = refreshAfter((user) =>
  ProfileSetting.publishProfile({ user } as any).responds({}),
);

/** Reaction 2: a profile update refreshes the user's recommendations while visible. */
const RefreshOnUpdate = refreshAfter((user) =>
  ProfileSetting.updateProfile({ user } as any).responds({}),
);

/** Reaction 2: a new startup pitch refreshes the user's recommendations while visible. */
const RefreshOnPitch = refreshAfter((user) =>
  ProfileSetting.setStartupPitch({ user } as any).responds({}),
);

// ---------------------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------------------

const PROFILE_FIELDS = [
  "name",
  "university",
  "major",
  "graduationYear",
  "skills",
  "experience",
  "interests",
  "location",
  "latitude",
  "longitude",
  "availability",
] as const;

function profileFields(v: Vars) {
  return Object.fromEntries(PROFILE_FIELDS.map((field) => [field, v[field]]));
}

const Create = endpoint(
  "/profiles/create",
  (bag) => {
    const v = take(bag, ["session", "user", "time", "role", "profile", ...PROFILE_FIELDS]);
    return receive({ session: v.session, role: v.role, ...profileFields(v) })
      .then(sessionUser(v))
      .then(
        ProfileSetting.createProfile({ user: v.user, role: v.role, ...profileFields(v) } as any).responds(
          { profile: v.profile },
        ),
      )
      .then(respond({ profile: v.profile }));
  },
  { input: { required: ["role", ...PROFILE_FIELDS], defaults: { session: "" } } },
);

// The refresh reactions run inside the same flow; `afterFlowSettles` answers only after
// every refresh the change caused has completed.

const Update = endpoint(
  "/profiles/update",
  (bag) => {
    const v = take(bag, ["session", "user", "time", ...PROFILE_FIELDS]);
    return receive({ session: v.session, ...profileFields(v) })
      .then(sessionUser(v))
      .then(ProfileSetting.updateProfile({ user: v.user, ...profileFields(v) } as any).responds({}))
      .afterFlowSettles()
      .then(respond({ updated: true }));
  },
  { input: { required: [...PROFILE_FIELDS], defaults: { session: "" } } },
);

const SetPitch = endpoint(
  "/profiles/set-pitch",
  (bag) => {
    const v = take(bag, ["session", "user", "time", "pitch"]);
    return receive({ session: v.session, pitch: v.pitch })
      .then(sessionUser(v))
      .then(ProfileSetting.setStartupPitch({ user: v.user, pitch: v.pitch }).responds({}))
      .afterFlowSettles()
      .then(respond({ pitchSet: true }));
  },
  { input: { required: ["pitch"], defaults: { session: "" } } },
);

const Publish = endpoint(
  "/profiles/publish",
  (bag) => {
    const v = take(bag, ["session", "user", "time"]);
    return receive({ session: v.session })
      .then(sessionUser(v))
      .then(ProfileSetting.publishProfile({ user: v.user }).responds({}))
      .afterFlowSettles()
      .then(respond({ published: true }));
  },
  { input: { defaults: { session: "" } } },
);

const PROFILE_ROW = ["profile", "role", ...PROFILE_FIELDS, "visible"] as const;

const Mine = endpoint(
  "/profiles/mine",
  (bag) => {
    const v = take(bag, ["session", "user", "time", "startupPitch", ...PROFILE_ROW]);
    const row = Object.fromEntries(PROFILE_ROW.map((field) => [field, v[field]]));
    return receive({ session: v.session })
      .then(sessionUser(v))
      .then(
        where(
          ProfileSetting._getProfile({ user: v.user }).is(row as any),
          whether(ProfileSetting._getProfile({ user: v.user }).is({ startupPitch: v.startupPitch })),
        )
          .then(respond({ ...row, startupPitch: v.startupPitch }))
          .named("has-profile"),
        where(no(ProfileSetting._getProfile({ user: v.user })))
          .then(respond({ error: "NO_PROFILE" }))
          .named("no-profile"),
      );
  },
  { input: { defaults: { session: "" } } },
);

export const composition = {
  Requests: { Create, Update, SetPitch, Publish },
  Reads: { Mine },
  Refreshing: { RefreshOnPublish, RefreshOnUpdate, RefreshOnPitch },
};

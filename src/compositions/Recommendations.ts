import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { compute, each, former, is, no, reaction, when, whether, where } from "@mit-sdg/sync-engine/language";
import { applicationConceptSet, concepts } from "../concepts.ts";
import { refreshAfter, sessionUser, take } from "./Profiles.ts";

const { MutualMatching, ProfileSetting, Recommending } = concepts;
const { numberSupplied } = applicationConceptSet.computations;

/** Reaction 2: saved preferences refresh the user's recommendations while visible. */
const RefreshOnPreferences = refreshAfter((user) =>
  Recommending.setPreferences({ user } as any).responds({}),
);

/**
 * Set preferences. The guard reads ProfileSetting before the change; the refresh reaction
 * reads it again after `setPreferences`. Each optional number is passed only when supplied,
 * so the four branches below are disjoint on the two `numberSupplied` flags.
 */
const SetPreferences = endpoint(
  "/recommendations/set-preferences",
  (bag) => {
    const v = take(bag, [
      "session",
      "user",
      "time",
      "skills",
      "interests",
      "universities",
      "distance",
      "availability",
      "hasDistance",
      "hasAvailability",
    ]);
    const hasProfile = ProfileSetting._recommendationData({ user: v.user });
    const lists = { skills: v.skills, interests: v.interests, universities: v.universities };
    const flags = (distance: boolean, availability: boolean) => [
      compute(numberSupplied, { value: v.distance }, v.hasDistance),
      is.among(v.hasDistance, [distance]),
      compute(numberSupplied, { value: v.availability }, v.hasAvailability),
      is.among(v.hasAvailability, [availability]),
    ];
    const save = (input: Record<string, unknown>) =>
      Recommending.setPreferences({ user: v.user, ...lists, ...input } as any).responds({});
    return receive({
      session: v.session,
      ...lists,
      distance: v.distance,
      availability: v.availability,
    })
      .then(sessionUser(v))
      .then(
        where(hasProfile, ...flags(true, true))
          .then(save({ distance: v.distance, availability: v.availability }))
          .named("distance-and-availability"),
        where(hasProfile, ...flags(true, false))
          .then(save({ distance: v.distance }))
          .named("distance-only"),
        where(hasProfile, ...flags(false, true))
          .then(save({ availability: v.availability }))
          .named("availability-only"),
        where(hasProfile, ...flags(false, false))
          .then(save({}))
          .named("no-numbers"),
        where(no(ProfileSetting._recommendationData({ user: v.user })))
          .then(respond({ error: "PREFERENCES_NEED_PROFILE" }))
          .named("no-profile"),
      )
      // Answer only after the refresh reaction the save caused has completed. The condition
      // keeps this answer disjoint from the no-profile refusal.
      .afterFlowSettles()
      .where(ProfileSetting._recommendationData({ user: v.user }))
      .then(respond({ saved: true }));
  },
  {
    input: {
      required: ["skills", "interests", "universities"],
      defaults: { session: "", distance: null, availability: null },
    },
  },
);

const Preferences = endpoint(
  "/recommendations/preferences",
  (bag) => {
    const v = take(bag, [
      "session",
      "user",
      "time",
      "skills",
      "interests",
      "universities",
      "distance",
      "availability",
    ]);
    return receive({ session: v.session })
      .then(sessionUser(v))
      .then(
        where(
          Recommending._getPreferences({ user: v.user }).is({
            skills: v.skills,
            interests: v.interests,
            universities: v.universities,
          }),
          whether(Recommending._getPreferences({ user: v.user }).is({ distance: v.distance })),
          whether(Recommending._getPreferences({ user: v.user }).is({ availability: v.availability })),
        )
          .then(
            respond({
              skills: v.skills,
              interests: v.interests,
              universities: v.universities,
              distance: v.distance,
              availability: v.availability,
            }),
          )
          .named("saved"),
        where(no(Recommending._getPreferences({ user: v.user })))
          .then(
            respond({ skills: [], interests: [], universities: [], distance: null, availability: null }),
          )
          .named("defaults"),
      );
  },
  { input: { defaults: { session: "" } } },
);

// ---------------------------------------------------------------------------------------
// Reaction 10 (Recommending half): an unmatched pair leaves each other's feeds
// ---------------------------------------------------------------------------------------

/** Statuses that still need marking; an already PASSED recommendation is left alone. */
const NOT_YET_PASSED = ["AVAILABLE", "SEE_LATER", "INTERESTED"];

/** After an unmatch, user's recommendation of other is marked PASSED when one exists. */
const PassForward = reaction(({ user, other, status }) =>
  when(MutualMatching.unmatch({ user, other }).responds({}))
    .where(
      Recommending._recommendation({ viewer: user, candidate: other }).is({ status }),
      is.among(status, NOT_YET_PASSED),
    )
    .then(Recommending.markPassed({ viewer: user, candidate: other }).responds({})),
);

/** After an unmatch, other's recommendation of user is marked PASSED when one exists. */
const PassBack = reaction(({ user, other, status }) =>
  when(MutualMatching.unmatch({ user, other }).responds({}))
    .where(
      Recommending._recommendation({ viewer: other, candidate: user }).is({ status }),
      is.among(status, NOT_YET_PASSED),
    )
    .then(Recommending.markPassed({ viewer: other, candidate: user }).responds({})),
);

const FeedRows = former("the feed of (viewer)", ({ viewer }, { candidate, score }) =>
  each(Recommending._getFeed({ viewer }).is({ candidate, score })).form({ user: candidate, score }),
);

const Feed = endpoint(
  "/recommendations/feed",
  (bag) => {
    const v = take(bag, ["session", "user", "time"]);
    return receive({ session: v.session })
      .then(sessionUser(v))
      .then(respond({ feed: FeedRows({ viewer: v.user }) }));
  },
  { input: { defaults: { session: "" } } },
);

export const composition = {
  Requests: { SetPreferences },
  Reads: { Preferences, Feed },
  Refreshing: { RefreshOnPreferences },
  Unmatching: { PassForward, PassBack },
};

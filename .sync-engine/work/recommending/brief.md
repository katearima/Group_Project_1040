# Recommending with profile-driven Reactions 1 and 2

## Goal

Signed-in users can create and publish a profile, set matching preferences, and see a
ranked recommendation feed of visible people with the opposite role. Recommendations are
created when a profile is published (Reaction 1) and recalculated when a profile, startup
pitch, or preferences change (Reaction 2). Source of truth for product behavior:
`documentation/concept-design.md` sections 1 (ProfileSetting), 2 (Recommending) and 6
(Reactions 1 and 2).

## Scope

Included:

- Concept `Recommending [User]` as designed: Preferences, Recommendations
  (AVAILABLE/SEE_LATER/PASSED/INTERESTED, eligible flag), actions `setPreferences`,
  `refreshRecommendation`, `seeLater`, `markPassed`, `markInterested`, `startNewSession`,
  `deactivateRecommendation`; queries `_getFeed`, `_getPreferences`, plus a narrow read of
  one pair's recommendation for later guards. Five-factor score computed inside the concept.
- Concept `ProfileSetting [User]` as designed (needed because Reactions 1 and 2 are
  triggered by its actions and read its data; no teammate branch has it): actions
  `createProfile`, `setStartupPitch`, `updateProfile`, `publishProfile`, `hideProfile`;
  queries `_getProfile`, `_getVisibleProfiles`, plus narrow reads the reactions need
  (a user's recommendation data, visible opposite-role candidates).
- Endpoints (session user acts; caller never supplies its own identity): create profile,
  update profile, set startup pitch, publish profile, read own profile, set preferences,
  read own preferences, read own feed.
- Reaction 1 (publish → refresh both directions for every visible opposite-role user).
- Reaction 2 (setPreferences, updateProfile, setStartupPitch → same refresh, only while the
  user's profile is visible).

Excluded (deferred, documented, not linked):

- Hide profile endpoint and Reaction 3 (deactivate on hide). The `hideProfile` action exists
  in the concept but no endpoint calls it, so hidden users cannot linger in feeds.
- Reactions 4, 5 and the Recommending half of 10; See Later and Begin Browsing endpoints;
  passing from the feed. Recommending actions exist so these can be wired later.
- ProfileSetting guard on Show Interest and sender name in interest notifications.
- Persistence (in memory), frontend.

## Requirements

- Create profile: one per user; role FOUNDER or BUILDER fixed at creation; graduation year a
  positive whole number; latitude in [-90, 90], longitude in [-180, 180]; availability
  nonnegative; every skill/interest entry nonempty. Starts hidden, without a pitch.
- Set startup pitch: founders only, nonempty pitch.
- Update profile: replaces editable fields with the same validation; owner, role, pitch,
  visibility unchanged; a visible profile must still meet publication requirements.
- Publish: requires nonempty name and location, at least one skill and one interest, and,
  for founders, a nonempty pitch.
- Set preferences: requires the session user to have a profile; sets/clears preferred skills,
  interests, universities, distance (km) and availability; nonnegative numbers, nonempty entries.
- Refresh recommendation: refused for the same user; creates AVAILABLE + eligible, or updates
  score and sets eligible while preserving status.
- Score: average of five factors in [0, 1] exactly as concept-design §2 specifies (skills
  two-way, interests with own-interest fallback, university, availability ratio capped at 1,
  great-circle proximity on a 6371 km sphere). Text compared trimmed and case-insensitive,
  duplicates counted once.
- Feed: the viewer's eligible AVAILABLE recommendations, highest score first.
- Reactions 1 and 2 refresh both directions for every visible opposite-role candidate, using
  the latest profile data and stored preferences. Same-role users never get recommendations
  for each other. Changes made while hidden take effect on the next publish.
- A missing, ended, expired or invented session is refused `UNKNOWN_SESSION` with no change.
- Whitespace-only text counts as empty (team convention).

## Active decisions

- Scope: Fidan's sprint items (Recommending concept, Reactions 1 and 2, Authenticating).
  Authenticating was already delivered by work item `matching-notifying` (catalog concept,
  register/sign-in/sign-out); this item only keeps it passing (user direction).
- ProfileSetting is implemented here because Reactions 1 and 2 depend on it and no teammate
  branch has it (user-approved plan).
- Availability: the prose design scores availability but ProfileSetting lists no
  availability field. Profiles and RecommendationData carry `availability: Number`
  (hours per week, nonnegative) (user-approved plan assumption).
- RecommendationData fields: skills, interests, university, latitude, longitude,
  availability. University may be empty in the data (draft-friendly profiles; university is
  only "highly recommended"); an empty university simply never matches a university
  preference (assumption: prose requires nonempty university, but publication does not).
- Refreshes for different pairs are separate owner actions and are not atomic. If one faults
  after the triggering action succeeded, the endpoint reports the fault; the next publish,
  update, pitch or preference change recomputes every pair (best-effort, like notifications).
- Concurrent changes are not serialized per user (coordinator decision for review finding
  F4): when two users' profile or preference flows interleave, one pair's score can be
  computed from slightly older data and stays stale until that pair is next refreshed by
  either user's publish, update, pitch, or preference change. Statuses are never affected.
  This deviates from the prose design's "finish reactions before the next request involving
  the same users"; revisit with persistence.
- Framework stays on the team's pinned sync-engine 1.1.0 although the skill release is
  1.2.0 (team choice; continue with warning).
- Execution is mixed: designer and workers are coordinator-simulated in this session;
  contract review is delegated to an independent Claude Code subagent.
- State is in memory; persistence is a follow-up.

## Done when

- Keti (builder) and Bumba (founder) register, create profiles, (Bumba sets a pitch), and
  publish → each appears in the other's feed with the score the five-factor rule gives;
  two builders never appear in each other's feeds. (integration test)
- Keti sets preferences → her score for Bumba is recalculated (Reaction 2 via
  setPreferences); Bumba updates his skills → both directions recalculated. (integration test)
- Updates while unpublished create no recommendations until publish. (integration test)
- Refresh preserves an existing status (PASSED stays out of the feed). (concept test)
- Scoring: each factor and the prose example (1, 0.5, 1, 1, 0.5 → 0.8). (concept test)
- ProfileSetting validation and publication rules, including founder-only pitch. (concept test)
- Missing or invalid session refused with no state change; preferences without a profile
  refused. (integration test)
- Existing Authenticating, matching and notification tests still pass.
- `bun run check:design`, `bun run check`, and `bun test` pass.

## Open questions

None.

## Activity

- Work item started (review required, execution mixed, release 1.1.0 with warning).
- Designer/contracts (coordinator-simulated): ProfileSetting, Recommending, Profiles,
  Recommendations, types. Collections are `opaque Entries` (signature types are one word);
  RecommendationData is flattened into `refreshRecommendation` inputs.
- Critic/contracts (independent Claude Code subagent): Revise with F1–F6 (refresh re-read
  after setPreferences, optional-number computation, Entries definition, concurrency
  staleness, university normalization, retry wording). F4 resolved by coordinator decision
  (accepted deviation); designer repair; critic/verification approved.
- Concept worker (simulated): ProfileSetting and Recommending with 102 passing concept tests
  (including existing suites).
- Application worker (simulated): blocked on B1 — an endpoint-owned refresh fan-out cannot
  answer when no candidate row exists. Designer repair moved the refresh into four linked
  internal reactions with endpoints answering after the flow settles; critic/verification
  approved; application worker completed.
- Validation: `bun run check:design` pass (12 files), `bun run check` pass (25 advisories,
  new ones are MISSING_ENDPOINT_FALLBACK on the 8 new endpoints, same class as existing),
  `bun test` 133 pass, live HTTP smoke test (register → create → pitch → publish → feed →
  preferences → recalculated feed).
- Not verified: that a fault inside an internal refresh reaction surfaces in the endpoint's
  answer (no fault-injection test). Optional critic/implementation not run.

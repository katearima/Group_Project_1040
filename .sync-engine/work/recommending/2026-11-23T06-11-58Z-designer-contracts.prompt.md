# Role and objective

Continue work unit `recommending`; role `designer`; phase `contracts`. The prior same-phase role contract remains authoritative.

# Access

This grant replaces prior access; other rules remain.

Current grant:

```json
{"readableAreas":[{"area":"work-unit","path":"brief.md"},{"area":"design","path":"compositions/Accounts.md"},{"area":"design","path":"compositions/Matching.md"},{"area":"design","path":"compositions/Notifications.md"}],"writableAreas":[{"area":"assigned-design","path":"compositions/Profiles.md"},{"area":"assigned-design","path":"compositions/Recommendations.md"},{"area":"assigned-design","path":"concepts/ProfileSetting.md"},{"area":"assigned-design","path":"concepts/Recommending.md"},{"area":"assigned-design","path":"types.md"}],"toolKinds":["repository-read","repository-write"],"projectShell":"project-validation","network":false,"generatedOutput":false,"longRunningProcesses":false}
```

# Guidance

Unchanged from the prior same-agent context. Apply it to the task and changed context below.

# Context

## Task

**.sync-engine/work/recommending/inputs/designer-repair-task.md**

# Contract repair for critic findings F1–F6

Repair exactly these findings from the critic record; change nothing else.

- F1 (Recommendations.md): after `setPreferences` succeeds, the same endpoint reaction (no
  internal reaction) reads `_recommendationData` again and runs the Profiles refresh only
  when that fresh read shows the profile visible.
- F2 (Recommendations.md): make `numberSupplied` take an optional input; state it is applied
  once each to distance and availability and each number is passed to `setPreferences` only
  when its flag is true; skills, interests and universities are required lists that may be
  empty.
- F3 (ProfileSetting.md, Recommending.md, Profiles.md): define `Entries` identically in both
  concepts as a finite list of text entries as supplied; ProfileSetting refuses an entry
  that is empty after trimming and stores entries as supplied; compositions pass request
  lists and query values through unchanged.
- F4 (Profiles.md): document stale-until-next-refresh under concurrent flows as an accepted
  deviation (brief Active decisions already records it).
- F5 (Recommending.md): university factor compares the candidate's university after the same
  trimming and case-folding.
- F6 (Profiles.md): retry sentence includes set pitch and, by reference, set preferences.

Run check-design on all design files.

## Brief

**.sync-engine/work/recommending/brief.md**

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

## Additional directed context

**.sync-engine/work/recommending/2026-11-23T06-08-39Z-critic-contracts.response.md**

## Verdict
Revise

The contract set covers everything the brief scopes. I found no blockers: authority is present, authorization cannot be bypassed, no effect has two owners, and no required work is lost without a way to recover it. Four material findings (F1 to F4) need small contract repairs before implementation. F5 and F6 are low severity. I edited nothing.

## Assessments

| Obligation | Trigger | Closing reaction | Visible success | False interval | Ack order | Retry identity / owner accepts | Recovery | Duplicate risk |
|---|---|---|---|---|---|---|---|---|
| R1 publish refresh | `/profiles/publish` → `publishProfile` succeeds | Profiles.Requests.Publish (endpoint-owned, no internal reaction) | profile visible; both directions refreshed for every visible opposite-role user | after a refresh fault: profile visible, some pairs missing; the endpoint reports the fault | answers after all refreshes | (viewer, candidate) pair; Recommending upserts on the unique pair, and publishing again succeeds | retry publish, or any later change by either user of the pair | none (upsert keeps status) |
| R2a update refresh | `/profiles/update` → `updateProfile` succeeds | Profiles.Requests.Update | fields replaced; refreshed only while visible | as R1 | after refreshes | pair upsert; the same values are written again | as R1 | none |
| R2b pitch refresh | `/profiles/set-pitch` → `setStartupPitch` succeeds | Profiles.Requests.SetPitch | pitch set; refresh runs while visible | as R1 | after refreshes | pair upsert; the same pitch succeeds again (the contract's retry sentence does not say this, see F6) | as R1 | none |
| R2c preferences refresh | `/recommendations/set-preferences` → `setPreferences` succeeds | Recommendations.Requests.SetPreferences (owner of the refresh only implied, see F1) | preferences replaced; both directions refreshed while visible | as R1 | after refreshes | pair upsert; the same request succeeds again | as R1 | none |
| Preferences guard | set-preferences with no profile | same endpoint | `PREFERENCES_NEED_PROFILE`, no change | none (profiles cannot be deleted, so the guard cannot go stale) | before any effect | n/a | n/a | none |
| Create profile | `/profiles/create` | Profiles.Requests.Create | hidden profile, no pitch; returns its identity | none | after the single atomic action | a repeat is refused `PROFILE_ALREADY_EXISTS` | n/a | none (owner action is atomic) |
| Session authority | every endpoint | Sessioning `current` first | `UNKNOWN_SESSION`, no change | none | before any read or change | n/a | n/a | n/a |
| Reads (mine, preferences, feed) | read endpoints | the respective endpoint | own data only; feed is eligible AVAILABLE, highest score first, ties oldest first; empty list or defaults; `NO_PROFILE` | none | n/a | n/a | n/a | n/a |

Other checks I ran:

- **Concurrent first publishes cannot miss a pair.** Each publish makes its own profile visible before it reads `_visibleCandidates`, so at least one of the two sees the other, and that one refreshes both directions.
- **Same-role users and self-recommendation are excluded.** `_visibleCandidates` returns only the opposite role, which also leaves out the session user.
- **ProfileSetting's validity matches Recommending's validity** (nonempty entries, inclusive coordinate ranges, nonnegative availability). So the claim that refreshes are not expected to refuse holds.
- **Refusal branches are exclusive and complete** in `createProfile`, `setStartupPitch`, `updateProfile`, `publishProfile`, `hideProfile` and every Recommending action. A refresh keeps an existing status.
- **The score rules match the five factors in concept-design §2.** One gap is the university comparison (F5).
- **The deferred items are documented honestly** in Profiles, Recommendations and Matching. That includes "showing interest or passing does not remove someone from the feed" and "hideProfile has no endpoint".
- **No computation reads concept state.**

Inventory:

- **Instances** (`design/types.md`): Authenticating, Sessioning, MutualMatching, Notifying, plus the new ProfileSetting and Recommending, each with `User is Authenticating.Account`.
- **Endpoints:** 8, each with one `reaction:` link and one matching fence entry; module, group and path agree.

  | Endpoint | Path |
  |---|---|
  | Profiles.Requests.Create | `/profiles/create` |
  | Profiles.Requests.Update | `/profiles/update` |
  | Profiles.Requests.SetPitch | `/profiles/set-pitch` |
  | Profiles.Requests.Publish | `/profiles/publish` |
  | Profiles.Reads.Mine | `/profiles/mine` |
  | Recommendations.Requests.SetPreferences | `/recommendations/set-preferences` |
  | Recommendations.Reads.Preferences | `/recommendations/preferences` |
  | Recommendations.Reads.Feed | `/recommendations/feed` |

- **Internal reactions, views, formers:** none.
- **Computations:** `currentInstant` (`design/types.md`, linked from both compositions) and `numberSupplied` (`design/compositions/Recommendations.md`, linked).

## Findings

**F1 (material), `design/compositions/Recommendations.md`: the order and owner of the preferences refresh are unclear.**
- The reaction reads `_recommendationData` before `setPreferences`, for the profile guard. Reaction 2 then points to "the refresh described in Profiles", which re-reads "after the ProfileSetting action succeeds". It never says whether the visibility check reuses the earlier guard read or reads again after the save. It also never says that the endpoint reaction itself owns the refresh.
- If the earlier read is reused, a race loses work. A publish that runs between the guard read and the save can score with the old preferences. The preferences flow then sees the profile as hidden and skips its refresh, leaving stale scores.
- Smallest repair: state that after `setPreferences` succeeds, the same endpoint reaction (no separate internal reaction) reads `_recommendationData` again and, when the profile is visible, runs the Profiles refresh.

**F2 (material), `design/compositions/Recommendations.md`: `numberSupplied` cannot represent an omitted value.**
- Its signature is `numberSupplied(value: Number)`, but it has to accept an omitted or null field, which a `Number` input cannot hold.
- There are two independent optional numbers, so there are four ways to call `setPreferences`. The contract does not say how one computation drives both distance and availability.
- It is also unstated whether skills, interests and universities are required in the request (empty allowed) or default to empty.
- Smallest repair:
  - make the input optional (for example `value?: Number`);
  - state that it is applied once each to distance and availability, and that each number is passed only when its flag is true (or declare one computation per field);
  - state that the three sets are required and may be empty.

**F3 (material), `design/concepts/ProfileSetting.md`, `design/concepts/Recommending.md` and `design/types.md`: `Entries` is not realizable as written.**
- ProfileSetting's `Entries` is "trimmed text entries" while its state is `set of String`. Nothing says who trims, or whether a whitespace-only entry is refused or silently dropped. Dropping it would break the brief's rule that every entry is nonempty and that whitespace-only text counts as empty.
- The composition passes ProfileSetting `Entries` (from `_recommendationData` and `_visibleCandidates`) into Recommending's separately declared `opaque Entries`. No shared declaration or instance binding relates the two types.
- Smallest repair:
  - define `Entries` once, consistently, as a finite collection of text entries as supplied, either as a shared concrete type in `design/types.md` or with identical definitions in both concepts;
  - state that ProfileSetting refuses any entry that is empty after trimming, and say what it stores;
  - state that the compositions pass request arrays and query values through unchanged.

**F4 (material), `design/compositions/Profiles.md` (and Recommendations by reference): concurrent changes can leave a stale score.**
- The prose (§6) says "the app finishes the resulting reactions before handling another request involving the same users". The brief says refreshes use "the latest profile data".
- Interleaved flows break both. User A's publish reads B's old data, B's update then refreshes the pair, and A's refresh writes last. The A→B score is now stale until the next refresh of that pair.
- The contract neither serializes these flows nor admits the staleness.
- Smallest repair: either require that profile and preference changes, together with their refresh, are serialized per user, or document stale-until-next-refresh as an accepted deviation from the prose and record it under Active decisions in `.sync-engine/work/recommending/brief.md`.

**F5 (low), `design/concepts/Recommending.md`: the university comparison is not normalized.**
- The normalization rule covers `Entries`, but the candidate's university is a `String`. So it is unclear whether " mit " matches "MIT". The brief requires trimmed, case-insensitive comparison.
- Smallest repair: in the university factor rule, compare the candidate's university after the same trimming and case-folding.

**F6 (low), `design/compositions/Profiles.md`: the retry sentence leaves out set pitch.**
- It names only publish and updates as safe to retry. Setting the same pitch again also succeeds and refreshes again.
- Smallest repair: add set pitch (and, by reference, set preferences) to that sentence.

# Result

Unless the task requests another format, use these prior fields: `## Status`, `## Changed`, `## Questions`, `## Checks` (optional).

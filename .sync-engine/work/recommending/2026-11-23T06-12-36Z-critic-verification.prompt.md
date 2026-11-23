# Role and objective

Work unit `recommending`; role `critic`; phase `verification`.

# Critic verification

Verify only the supplied finding or routed-blocker IDs against the revised candidate and their direct effects. Mark each ID resolved, unresolved, or directly regressed.

Do not restart holistic review, add unrelated findings, edit the candidate, or infer missing context.

# Access

Root: "/Users/fidan10/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `work-unit:brief.md` ("/Users/fidan10/Group_Project_1040/.sync-engine/work/recommending/brief.md"), `design:compositions/Matching.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Matching.md"), `design:compositions/Profiles.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Profiles.md"), `design:compositions/Recommendations.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Recommendations.md"), `design:concepts/ProfileSetting.md` ("/Users/fidan10/Group_Project_1040/design/concepts/ProfileSetting.md"), `design:concepts/Recommending.md` ("/Users/fidan10/Group_Project_1040/design/concepts/Recommending.md"), `design:types.md` ("/Users/fidan10/Group_Project_1040/design/types.md").
- Write: none.
- Tools: `repository-read`.
- Shell: `none`; network: no; generated output: no; long-running processes: no.

Inspect only listed files or directories. In coordinator simulation, this grant binds the coordinator itself; broader coordinator access and prior discovery are unavailable to the assignment. Project checks may transitively read other project files, but do not inspect them yourself. Use supplied or task-named package-owned public documentation; do not browse package trees. Never inspect package `dist`, framework internals, caches, sibling applications, or undeclared declarations. Exclude `.git`, `.sync-engine` except this prompt, harness/skill configuration, agent traces, parent directories, and unrelated generated output. Ask for context instead of searching outside the grant. Generated files come only from granted commands. Never grantable: `git-mutation`, `dependency-installation`, `framework-internals`, `workflow-management`, `skill-cli-invocation`, `delegation-or-handoff`.

# Guidance

No additional guidance for this phase.

# Context

## Verification task

**.sync-engine/work/recommending/inputs/verify-task.md**

# Verify repairs for F1–F6

Verify only findings F1, F2, F3, F4, F5 and F6 from your contract review against the
repaired design files. Do not raise new findings. Return a Verdict of Approve, Revise, or
Blocked, with one line per finding ID saying resolved or not and why.

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

## Original finding or routed blocker IDs

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

## Revised candidate context

**design/compositions/Profiles.md**

# Profiles

Signed-in users create, edit, and publish their own profile. Every endpoint first calls
Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any profile or recommendation action,
without changing state. The session user is always the profile owner; a request never
names whose profile it changes.

ProfileSetting checks and changes each profile atomically and owns every validation and
publication rule. The composition forwards its refusals without separate checks.

## Recommendation refresh

Publishing (Reaction 1), updating a profile, and setting a startup pitch (Reaction 2) end
with the same recommendation refresh, owned by the endpoint reaction itself; there is no
separate internal reaction. After the ProfileSetting action succeeds, the reaction reads
ProfileSetting `_recommendationData` for the session user. Only when that profile is
visible does it read ProfileSetting `_visibleCandidates` for the session user: every
visible profile with the opposite role, oldest first. For each candidate it calls
Recommending `refreshRecommendation` twice, once with the session user as viewer and once
with the candidate as viewer, each time passing the viewer's data first and the
candidate's data second. Recommending scores the pair from that data and its own stored
preferences, creating an AVAILABLE recommendation or updating the score while keeping an
existing status.

The endpoint answers only after every refresh has completed. A hidden profile refreshes
nothing; its changes take effect when it is next published. Same-role users never receive
recommendations for each other because `_visibleCandidates` returns only the opposite role.
Profile data that ProfileSetting accepted is always valid recommendation data, and the
candidates exclude the session user, so the refreshes are not expected to refuse.

Skills and interests lists travel unchanged: the endpoints pass the request lists to
ProfileSetting as supplied, and the refresh passes the lists returned by ProfileSetting
queries to Recommending as returned.

Refreshes for different pairs are separate Recommending actions and are not atomic with
the profile change or with each other. If a refresh faults, the endpoint reports the fault;
the profile change and any refreshes already made remain. Retrying the same request is safe
for publish (publishing a visible profile succeeds again), updates and set pitch (the same
values are written again), and set preferences (see Recommendations), and any later
publish, update, pitch, or preference change recomputes every pair of that user.

Flows for different users are not serialized against each other. When two users' changes
interleave, a pair's score can be computed from the other user's slightly older data and
stays stale until either user's next publish, update, pitch, or preference change refreshes
that pair. Statuses are never affected. This is an accepted deviation from the prose
design's rule that reactions finish before the next request involving the same users.

## Create profile

A signed-in user may [create their profile](reaction:Profiles.Requests.Create) with a
role, name, university, major, graduation year, skills, experience, interests, location
with latitude and longitude, and weekly availability. ProfileSetting `createProfile`
refuses a second profile (`PROFILE_ALREADY_EXISTS`) and invalid data (`INVALID_PROFILE`).
On success the profile is hidden, has no startup pitch, and the endpoint returns its
identity. No recommendations are created until it is published.

```endpoints
Profiles.Requests.Create at /profiles/create
```

## Update profile

A signed-in user may [update their profile](reaction:Profiles.Requests.Update), supplying
every editable field. ProfileSetting `updateProfile` refuses a missing profile
(`UPDATE_PROFILE_NOT_FOUND`), invalid data (`INVALID_PROFILE_UPDATE`), and changes that
would leave a visible profile incomplete (`UPDATE_WOULD_UNPUBLISH`). Refusals change
nothing and refresh nothing. On success the role, startup pitch, and visibility are
unchanged, the recommendation refresh runs, and the endpoint returns success.

```endpoints
Profiles.Requests.Update at /profiles/update
```

## Set startup pitch

A signed-in founder may [set their startup pitch](reaction:Profiles.Requests.SetPitch).
ProfileSetting `setStartupPitch` refuses a missing profile (`PITCH_PROFILE_NOT_FOUND`), a
builder (`PITCH_NOT_FOUNDER`), and an empty pitch (`EMPTY_PITCH`). On success the
recommendation refresh runs and the endpoint returns success. Pitch text adds no points to
any score.

```endpoints
Profiles.Requests.SetPitch at /profiles/set-pitch
```

## Publish profile

A signed-in user may [publish their profile](reaction:Profiles.Requests.Publish).
ProfileSetting `publishProfile` refuses a missing profile (`PUBLISH_PROFILE_NOT_FOUND`)
and an incomplete one (`PROFILE_INCOMPLETE`) without changes. On success the profile is
visible, the recommendation refresh runs (Reaction 1), and the endpoint returns success.
Publishing an already visible profile succeeds again and refreshes again. Publishing a
previously hidden profile keeps every earlier recommendation status.

```endpoints
Profiles.Requests.Publish at /profiles/publish
```

## Read own profile

A signed-in user may [read their own profile](reaction:Profiles.Reads.Mine). ProfileSetting
`_getProfile` supplies every field, including the coordinates, which only the owner sees.
When the session user has no profile, the endpoint returns `NO_PROFILE`. Reading changes
no state. Reading other people's profiles is deferred.

```endpoints
Profiles.Reads.Mine at /profiles/mine
```

## Deferred

- Hiding a profile and Reaction 3 (deactivating its recommendations). ProfileSetting
  `hideProfile` exists, but no endpoint calls it, so a published profile stays visible.
- Viewing another person's visible or matched profile.
- The ProfileSetting guard on Show Interest and the sender's name in interest
  notifications (see Matching).

**design/compositions/Recommendations.md**

# Recommendations

Signed-in users set their matching preferences and read their ranked feed. Every endpoint
first calls Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any read or change, without changing state.
Preferences and feeds belong only to the session user.

Recommendations are created and recalculated only by the refresh described in Profiles
(Reactions 1 and 2), never by a direct request.

## Set preferences

A signed-in user may [set their preferences](reaction:Recommendations.Requests.SetPreferences):
preferred skills, interests, and universities, and optionally a maximum distance in
kilometers and a minimum weekly availability. The three lists are required and may be
empty; they are passed to Recommending unchanged. An omitted or null number means no
preference for that factor and clears any earlier one. The endpoint applies
[a supplied-number test](computation:numberSupplied) once to distance and once to
availability, and passes each number to `setPreferences` only when its test is true.

The reaction first reads ProfileSetting `_recommendationData` for the session user. When
the user has no profile it returns `PREFERENCES_NEED_PROFILE` without changes. Otherwise
Recommending `setPreferences` replaces all of the user's preferences, refusing negative
numbers or empty entries (`INVALID_PREFERENCES`) without changes. Repeating the same
request succeeds again.

After the preferences are saved, Reaction 2 runs inside the same endpoint reaction; there
is no separate internal reaction. It reads ProfileSetting `_recommendationData` again,
rather than reusing the guard read, and only when that fresh read shows the profile visible
does it run the recommendation refresh described in Profiles: both directions for every
visible candidate with the opposite role, so the new preferences change the user's scores
for others and others' scores for the user (through the skills factor). A hidden profile
refreshes nothing until it is published. The endpoint answers after every refresh has
completed, with the same best-effort failure and concurrency behavior as the Profiles
refresh: saved preferences stay saved, and any later change or publish recomputes every
pair.

```endpoints
Recommendations.Requests.SetPreferences at /recommendations/set-preferences
```

```computations
numberSupplied(value?: Number) : Flag
  Produces true when an optional numeric request field holds a number, and false when it was omitted or null.
```

## Read preferences

A signed-in user may [read their preferences](reaction:Recommendations.Reads.Preferences).
Recommending `_getPreferences` returns the saved skills, interests, universities, and any
distance and availability. A user who never saved preferences receives empty sets and no
numbers, the same defaults scoring uses. Reading changes no state.

```endpoints
Recommendations.Reads.Preferences at /recommendations/preferences
```

## Feed

A signed-in user may [read their feed](reaction:Recommendations.Reads.Feed). Recommending
`_getFeed` returns account identities with scores for the session user's eligible
AVAILABLE recommendations, highest score first and ties oldest first. It returns an empty
list when there are none. Passed, interested, and see-later recommendations are excluded.
Reading changes no state.

```endpoints
Recommendations.Reads.Feed at /recommendations/feed
```

## Deferred

- Reaction 4 (`markInterested` after Show Interest), Reaction 5 (`markPassed` after a pass),
  passing from the feed, and the Recommending half of Reaction 10 (unmatch).
- See Later and Begin Browsing (`seeLater`, `startNewSession`) endpoints.
- Reaction 3 (deactivating recommendations on hide), awaiting a hide endpoint.

These integrations are not linked. Until Reactions 4 and 5 exist, showing interest in or
passing on someone does not remove them from the feed.

**design/concepts/ProfileSetting.md**

# ProfileSetting

## Purpose

Let each person present one profile, as a founder or as a builder, that others can
discover once it is complete and published. A profile is a self-description that its owner
controls, not a record that other people edit, rate, or annotate.

## Principle

Keti creates a builder profile with her name "Keti A", university MIT, skill "software
engineering", interest "data tools", location "MIT campus" at 42.36, -71.09, and 10 hours a
week of availability. It starts hidden. She publishes it, and it becomes visible. Bumba
creates a founder profile, but publishing it is refused until he sets the startup pitch
"A data tool for solo travelers". After that he publishes. Later Keti adds the skill
"data engineering" with an update; her role, visibility, and lack of a pitch stay as they
were. An update that would empty the skills of her visible profile is refused.

## Types

```types
external User
  The opaque identity of the person who owns a profile.
opaque Entries
  A finite list of text entries, such as skills or interests, exactly as supplied.
Role is FOUNDER or BUILDER
  Whether the person is a founder seeking teammates or a builder seeking a startup.
```

## State

```state
a seq of Profiles with
  a unique owner User
  a Role
  a name String
  a university String
  a major String
  a graduationYear Number
  a skills set of String
  an experience String
  an interests set of String
  a location String
  a latitude Number
  a longitude Number
  an availability Number
  an optional startupPitch String
  a visible Flag

Rule: A User has at most one Profile, and its role never changes after creation.
Rule: Only a Profile whose role is FOUNDER has a startupPitch, and a present startupPitch is nonempty.
Rule: graduationYear is a positive whole number; availability, in hours per week, is a nonnegative number.
Rule: latitude is between -90 and 90 and longitude is between -180 and 180, inclusive, in degrees, even while the Profile is hidden.
Rule: Every skills and interests entry is nonempty after trimming leading and trailing whitespace; entries are stored exactly as supplied, without trimming or removing duplicates.
Rule: Text containing only whitespace counts as empty.
Rule: A Profile is complete when its name and location are nonempty, its skills and its interests each have at least one entry, and, when its role is FOUNDER, its startupPitch is present.
Rule: Every visible Profile is complete.
Rule: Profiles are kept in creation order.
Rule: The profile data is invalid when graduationYear is not a positive whole number, latitude or longitude is out of range, availability is negative, or any skills or interests entry is empty after trimming.
Rule: Each action checks and changes a Profile atomically, so concurrent requests cannot create two Profiles for one User or leave a visible Profile incomplete.
```

## Actions

```actions
createProfile (user: User, role: Role, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number) : returns (profile: Profile)
  where a Profile with owner user exists
  then
    refuses PROFILE_ALREADY_EXISTS "You already have a profile."
  where no Profile with owner user exists and the profile data is invalid
  then
    refuses INVALID_PROFILE "Graduation year, coordinates, availability, skills, and interests must be valid."
  where no Profile with owner user exists and the profile data is valid
  then
    append a Profile with owner user and the supplied role, name, university, major, graduationYear, skills, experience, interests, location, latitude, longitude, and availability, no startupPitch, and visible false
    bind profile to that Profile
    returns profile

setStartupPitch (user: User, pitch: String) : returns ()
  where no Profile with owner user exists
  then
    refuses PITCH_PROFILE_NOT_FOUND "Create a profile first."
  where the Profile with owner user has role BUILDER
  then
    refuses PITCH_NOT_FOUNDER "Only founders can have a startup pitch."
  where the Profile with owner user has role FOUNDER and pitch is empty
  then
    refuses EMPTY_PITCH "A startup pitch must not be empty."
  where the Profile with owner user has role FOUNDER and pitch is not empty
  then
    set that Profile's startupPitch to pitch
    returns

updateProfile (user: User, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number) : returns ()
  where no Profile with owner user exists
  then
    refuses UPDATE_PROFILE_NOT_FOUND "Create a profile first."
  where a Profile with owner user exists and the supplied profile data is invalid
  then
    refuses INVALID_PROFILE_UPDATE "Graduation year, coordinates, availability, skills, and interests must be valid."
  where a Profile with owner user exists, the supplied profile data is valid, the Profile is visible, and the Profile with the supplied fields would not be complete
  then
    refuses UPDATE_WOULD_UNPUBLISH "A visible profile must stay complete; hide it before removing required details."
  where a Profile with owner user exists, the supplied profile data is valid, and the Profile is hidden or would stay complete
  then
    replace that Profile's name, university, major, graduationYear, skills, experience, interests, location, latitude, longitude, and availability with the supplied values
    keep its owner, role, startupPitch, and visible unchanged
    returns

publishProfile (user: User) : returns ()
  where no Profile with owner user exists
  then
    refuses PUBLISH_PROFILE_NOT_FOUND "Create a profile first."
  where the Profile with owner user is not complete
  then
    refuses PROFILE_INCOMPLETE "Add a name, location, at least one skill and interest, and, for founders, a startup pitch before publishing."
  where the Profile with owner user is complete
  then
    set that Profile's visible to true
    returns

hideProfile (user: User) : returns ()
  where no Profile with owner user is visible
  then
    refuses PROFILE_NOT_VISIBLE "You do not have a visible profile."
  where the Profile with owner user is visible
  then
    set that Profile's visible to false
    returns
```

## Queries

```queries
_getProfile (user: User) : optional (profile: Profile, role: Role, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number, startupPitch?: String, visible: Flag)
  answers the Profile whose owner is user, with all its fields
  answers no row when user has no Profile, including for an unknown user

_getVisibleProfiles () : many (profile: Profile, owner: User)
  answers each visible Profile with its owner
  answers no rows when no Profile is visible
  orders rows by Profile creation order, oldest first

_recommendationData (user: User) : optional (role: Role, visible: Flag, skills: Entries, interests: Entries, university: String, latitude: Number, longitude: Number, availability: Number)
  answers the role, visibility, and recommendation data of the Profile whose owner is user
  answers no row when user has no Profile, including for an unknown user

_visibleCandidates (user: User) : many (candidate: User, skills: Entries, interests: Entries, university: String, latitude: Number, longitude: Number, availability: Number)
  answers the owner and recommendation data of each visible Profile whose role differs from the role of user's Profile
  answers no rows when user has no Profile, including for an unknown user, or when no such Profile is visible
  orders rows by Profile creation order, oldest first
```

**design/concepts/Recommending.md**

# Recommending

## Purpose

Rank the people a viewer could work with by a compatibility score built from preferences
and supplied profile data, and remember what the viewer decided about each person, so the
feed shows likely fits first and never re-shows someone the viewer set aside. It ranks; it
does not decide who may appear, and it never reads profiles itself.

## Principle

Keti prefers the interest "data tools"; Bumba prefers the skill "software engineering".
When both profiles are refreshed as a pair, Keti's recommendation of Bumba is created as
AVAILABLE with score 1 because every factor is satisfied, and it tops her feed. She chooses
See Later, so Bumba leaves her feed until she starts a new browsing session, when he
returns. Later Bumba's data changes and the pair is refreshed again: the score is
recalculated, but a recommendation Keti had marked PASSED stays PASSED and out of her feed.
Deactivating a recommendation hides it from the feed until the next refresh makes it
eligible again.

## Types

```types
external User
  The opaque identity of a person who views or is recommended.
opaque Entries
  A finite list of text entries, such as skills, interests, or universities, exactly as supplied.
RecommendationStatus is AVAILABLE or SEE_LATER or PASSED or INTERESTED
  What the viewer decided about a recommended candidate.
```

## State

```state
a set of Preferences with
  a unique owner User
  a preferredSkills set of String
  a preferredInterests set of String
  a preferredUniversities set of String
  an optional preferredDistance Number
  an optional preferredAvailability Number

a seq of Recommendations with
  a viewer User
  a candidate User
  a score Number
  a status RecommendationStatus
  an eligible Flag
  unique viewer and candidate

Rule: No Recommendation has the same User as viewer and candidate.
Rule: Each viewer and candidate pair has at most one Recommendation.
Rule: A present preferredDistance (kilometers) or preferredAvailability (hours per week) is nonnegative, and every preferred entry is nonempty after trimming; preferred entries are stored exactly as supplied.
Rule: A User without Preferences, or with empty preferred sets or absent numbers, has no preference for that factor.
Rule: Every score is between 0 and 1 inclusive.
Rule: Text containing only whitespace counts as empty.
Rule: Entries are compared after trimming leading and trailing whitespace and ignoring letter case; entries equal after this normalization count once.
Rule: Recommendation data is one person's skills, interests, university, latitude, longitude, and availability, supplied by the caller; Recommending never stores it.
Rule: Recommendation data is invalid when a skills or interests entry is empty, latitude is outside -90 to 90, longitude is outside -180 to 180, or availability is negative; an empty university is valid and matches no university preference.
Rule: The skills factor is the average of two directions: the fraction of the viewer's preferred skills found in the candidate's skills, and the fraction of the candidate's preferred skills found in the viewer's skills; a direction whose preferred set is empty is 1.
Rule: The interests factor is the fraction of the viewer's preferred interests found in the candidate's interests; when the viewer prefers none, the viewer's own interests are used instead; when that set is also empty, the factor is 1.
Rule: The university factor is 1 when the viewer prefers no university or the candidate's university, trimmed and compared ignoring letter case, is among the preferred universities, and 0 otherwise.
Rule: The availability factor is 1 when the viewer has no preferred availability or it is 0, and otherwise the candidate's availability divided by the preferred availability, capped at 1.
Rule: The proximity factor is 1 when the viewer has no preferred distance; when the preferred distance is 0 it is 1 at distance 0 and 0 otherwise; otherwise it is max(0, 1 - distance / preferredDistance).
Rule: Distance is the great-circle distance between the two coordinates on a sphere of radius 6371 kilometers; equal coordinates are distance 0.
Rule: A score is the average of the skills, interests, university, availability, and proximity factors, each between 0 and 1.
Rule: Recommendations are kept in creation order; refreshing or changing status keeps a Recommendation's position.
Rule: Each action checks and changes these facts atomically, so concurrent refreshes cannot create two Recommendations for one pair.
```

## Actions

```actions
setPreferences (user: User, skills: Entries, interests: Entries, universities: Entries, distance?: Number, availability?: Number) : returns ()
  where a supplied number is negative or any skills, interests, or universities entry is empty
  then
    refuses INVALID_PREFERENCES "Preferred distance and availability must be nonnegative, and preferred entries must not be empty."
  where every supplied number is nonnegative and every entry is nonempty
  then
    create Preferences with owner user when none exist
    replace its preferredSkills, preferredInterests, and preferredUniversities with skills, interests, and universities
    set its preferredDistance to distance and its preferredAvailability to availability, clearing each one that is omitted
    returns

refreshRecommendation (viewer: User, candidate: User, viewerSkills: Entries, viewerInterests: Entries, viewerUniversity: String, viewerLatitude: Number, viewerLongitude: Number, viewerAvailability: Number, candidateSkills: Entries, candidateInterests: Entries, candidateUniversity: String, candidateLatitude: Number, candidateLongitude: Number, candidateAvailability: Number) : returns (score: Number)
  where viewer is candidate
  then
    refuses SELF_RECOMMENDATION "A person cannot be recommended to themselves."
  where viewer is not candidate and the viewer data or the candidate data is invalid
  then
    refuses INVALID_RECOMMENDATION_DATA "Recommendation data must have nonempty entries, valid coordinates, and nonnegative availability."
  where viewer is not candidate, both data are valid, and no Recommendation has viewer viewer and candidate candidate
  then
    calculate score from the supplied data and the Preferences of viewer and candidate, or their defaults
    append a Recommendation with viewer, candidate, score, status AVAILABLE, and eligible true
    returns score
  where viewer is not candidate, both data are valid, and a Recommendation has viewer viewer and candidate candidate
  then
    calculate score from the supplied data and the Preferences of viewer and candidate, or their defaults
    set that Recommendation's score to score and its eligible to true, keeping its status
    returns score

seeLater (viewer: User, candidate: User) : returns ()
  where no eligible Recommendation with viewer viewer and candidate candidate has status AVAILABLE
  then
    refuses NOT_IN_FEED "This person is not in your current feed."
  where the Recommendation with viewer viewer and candidate candidate is eligible and has status AVAILABLE
  then
    set its status to SEE_LATER
    returns

markPassed (viewer: User, candidate: User) : returns ()
  where no Recommendation has viewer viewer and candidate candidate
  then
    refuses PASS_RECOMMENDATION_NOT_FOUND "There is no recommendation of this person."
  where a Recommendation has viewer viewer and candidate candidate
  then
    set its status to PASSED
    returns

markInterested (viewer: User, candidate: User) : returns ()
  where no Recommendation has viewer viewer and candidate candidate
  then
    refuses INTEREST_RECOMMENDATION_NOT_FOUND "There is no recommendation of this person."
  where the Recommendation with viewer viewer and candidate candidate has status PASSED or INTERESTED
  then
    refuses RECOMMENDATION_ALREADY_DECIDED "You have already decided about this recommendation."
  where the Recommendation with viewer viewer and candidate candidate has status AVAILABLE or SEE_LATER
  then
    set its status to INTERESTED
    returns

startNewSession (viewer: User) : returns ()
  where true
  then
    set the status of every Recommendation with viewer viewer and status SEE_LATER to AVAILABLE
    returns

deactivateRecommendation (viewer: User, candidate: User) : returns ()
  where no Recommendation has viewer viewer and candidate candidate
  then
    refuses DEACTIVATE_RECOMMENDATION_NOT_FOUND "There is no recommendation of this person."
  where a Recommendation has viewer viewer and candidate candidate
  then
    set its eligible to false
    returns
```

## Queries

```queries
_getFeed (viewer: User) : many (candidate: User, score: Number)
  answers the candidate and score of each eligible Recommendation with viewer viewer and status AVAILABLE
  answers no rows when there are none, including for an unknown viewer
  orders rows by score highest first, and equal scores by Recommendation creation order oldest first

_getPreferences (user: User) : optional (skills: Entries, interests: Entries, universities: Entries, distance?: Number, availability?: Number)
  answers the preferred skills, interests, universities, distance, and availability of the Preferences with owner user
  answers no row when user has never set preferences, including for an unknown user

_recommendation (viewer: User, candidate: User) : optional (score: Number, status: RecommendationStatus, eligible: Flag)
  answers the score, status, and eligibility of the Recommendation with viewer viewer and candidate candidate
  answers no row when there is none, including for unknown users
```

## Retained review guidance

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/design/boundary.md**

# What a design says about its boundary

An endpoint takes one request and produces one answer. Endpoints are the only way into
the application, and every caller reaches them the same way, regardless of caller.

Say what a caller supplies, what comes back, and every refusal with a stable code and its
meaning. Each selected endpoint separately declares its exact `endpoint(...)` pathname in
an `endpoints` fence. Do not put transport rendering in behavioral prose or that fence: no
methods, status codes, headers, exit codes, or projected external routes.

When two refusals have to be indistinguishable to a caller, say that as behaviour.

A concept needing the current time or a generated identifier says so in its prose and
takes it as an action input; it never reaches for a clock. Composition binds one instant
per flow and passes it in, so no concept reports the time.

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/design/contracts.md**

# Contract design and review

Use the supplied decomposition as boundary authority; without one, use the brief and affected approved contracts. Preserve accepted obligation IDs and their trigger, closing reaction, false interval, retry identity, and recovery.

## Concepts own complete mechanisms

Purpose names one mechanism and rules out a plausible alternative. Principle gives a short event-ordered story with real actors and values. State describes observable identity, relations, lifecycle, order, multiplicity, and invariants—not storage. External identities remain opaque and peer facts are never interpreted locally.

For every action, settle:

- inputs and returned identity;
- successful state transition;
- each expected refusal and the unchanged post-refusal state;
- repetition or deduplication behavior;
- lifecycle stage, deletion, expiry, and repair when applicable; and
- the owner action that enforces each race-sensitive or security-critical invariant.

A refusal has no partial effect. Repetition must succeed again, return the prior result, or refuse. Deduplication requires an operation identity accepted and checked atomically by the owner; a trace correlation ID is not enough.

Queries have no effects. State `one`, `optional`, or `many`, the empty or unknown case, and stable ordering for `many`. Do not invent CRUD symmetry or expose storage operations that are not part of the mechanism.

## Composition coordinates without stealing authority

Composition owns cross-concept policy, coordination, boundary adaptation, and recovery—not concept invariants. For each visible flow, state:

- actor and authenticated authority;
- requested resource and authorization condition;
- enforcement point;
- visible success and refusals;
- effect owner;
- ordering of required effects relative to acknowledgement; and
- material partial-failure and recovery behavior.

Request data is a claim, not authentication. Reject bypassable authorization, duplicate effect ownership, required work deferred after visible success when it can be lost, compensation without an available owner action, and claims of atomic or exactly-once behavior across independent owners.

For each obligation, verify that the trigger can occur, the closing reaction owns the intended effect, the owner accepts the retry identity, the false interval matches visible behavior, and recovery can run from an available action. This applies to synchronously awaited endpoint steps as well as deferred reactions. Never assume rollback between owners or exactly-once network delivery. Choose and state a realizable server-side acknowledgement boundary rather than adding protocol state solely to model whether a client received bytes.

## Select every executable explicitly

Inventory each selected static instance, endpoint, internal reaction, view, former, and computation. Give every executable declaration one exact typed link, and put all concrete types and instances needed by a new application in `design/types.md`. Each endpoint additionally needs exactly one matching `Declaration.Identity at /path` entry. The module, group, declaration, and pathname must agree.

A computation is a pure derivation of its declared inputs, such as normalization, a generated identifier, the current instant, or deciding whether an optional input was supplied. Anything read from concept state belongs in a query, view, or former, never a computation. Declare every computation the composition prose implies before review, including one for each optional-input branch. Implementation blocks on a missing declaration rather than inventing one.

An endpoint-linked reaction may own the full coordination required before its answer. Add a separate internal reaction only for intentionally distinct deferred or independently triggered behavior. Do not duplicate one effect in both declarations.

Contracts specify behavior, ownership, acknowledgement, and failure—not framework stages, trigger syntax, binding flow, host methods, status codes, or storage layout.

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/design/ssf-reading.md**

# Reading Simple State Form

State fences are declarations, not storage. Read them for what they promise:

- `a set of Items` and `a seq of Items` introduce identities; a `seq` also fixes order.
- A plain set holds every individual of its type in the state: with `a set of Users with
  a reputation Number`, every User anywhere in the concept has a reputation, whether
  User is owned or external. An external type's set introduces no identity.
- `a set of Completed Items` classifies members of `Items`, and `a set of Late Completed
  Items` members of `Completed Items`. A subset declares no second collection and no
  identity, subsets may overlap, and `a reviewer Verified User` holds only members of
  `Verified Users`.
- `an Author` is the field `author`; the type names a field written without a name.
- `an optional owner Person` may be absent. Collections never carry `optional`; empty
  means absent, so a set that must reject duplicates cannot also promise to detect them.
- `a Settings` has exactly one member.
- `alias WorkItem for Items` renames one declaration; it adds nothing.
- A `Rule:` line is prose the checker keeps verbatim and proves nothing.

Which side declares a relation implies no storage, navigation, or ownership.

# Result

Unless the task requests another format, return these headings in order. Omit progress narration.

- `## Verdict` — required. First line is exactly `Approve`, `Revise`, or `Blocked`.
- `## Findings` — required. Stable findings or routed blockers resolved/unresolved; direct regressions or none.

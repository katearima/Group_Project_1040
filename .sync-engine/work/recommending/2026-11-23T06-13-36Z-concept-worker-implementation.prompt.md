# Role and objective

Work unit `recommending`; role `concept-worker`; phase `implementation`.

# Concept worker

Implement and test the assigned concepts from their approved contracts. Keep each concept independent and limit changes to assigned concept and test paths. Authored design is read-only.

Honor the supplied guidance's exact query row shapes and per-action refusal codes. Concept source agreement is proved only by the project check at integration; report a wider row or different code as a design blocker, not a convenience.

Repair in-scope implementation diagnostics. Report a design blocker for required behavior absent from the contract, a context blocker for missing supplied API or project context, or an environment blocker when checks cannot run. Do not absorb composition, host, frontend, or evidence work.

# Access

Root: "/Users/fidan10/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `application:design/concepts/ProfileSetting.md` ("/Users/fidan10/Group_Project_1040/design/concepts/ProfileSetting.md"), `application:design/concepts/Recommending.md` ("/Users/fidan10/Group_Project_1040/design/concepts/Recommending.md"), `application:src/concepts/MutualMatching.test.ts` ("/Users/fidan10/Group_Project_1040/src/concepts/MutualMatching.test.ts"), `application:src/concepts/MutualMatching.ts` ("/Users/fidan10/Group_Project_1040/src/concepts/MutualMatching.ts"), `application:tsconfig.json` ("/Users/fidan10/Group_Project_1040/tsconfig.json").
- Write: `owned-concept:src/concepts/ProfileSetting.ts` ("/Users/fidan10/Group_Project_1040/src/concepts/ProfileSetting.ts"), `owned-concept:src/concepts/Recommending.ts` ("/Users/fidan10/Group_Project_1040/src/concepts/Recommending.ts"), `owned-test:src/concepts/ProfileSetting.test.ts` ("/Users/fidan10/Group_Project_1040/src/concepts/ProfileSetting.test.ts"), `owned-test:src/concepts/Recommending.test.ts` ("/Users/fidan10/Group_Project_1040/src/concepts/Recommending.test.ts").
- Tools: `repository-read`, `repository-write`.
- Shell: `project-local`; network: no; generated output: no; long-running processes: no.

Inspect only listed files or directories. In coordinator simulation, this grant binds the coordinator itself; broader coordinator access and prior discovery are unavailable to the assignment. Project checks may transitively read other project files, but do not inspect them yourself. Use supplied or task-named package-owned public documentation; do not browse package trees. Never inspect package `dist`, framework internals, caches, sibling applications, or undeclared declarations. Exclude `.git`, `.sync-engine` except this prompt, harness/skill configuration, agent traces, parent directories, and unrelated generated output. Ask for context instead of searching outside the grant. Generated files come only from granted commands. Never grantable: `git-mutation`, `dependency-installation`, `framework-internals`, `workflow-management`, `skill-cli-invocation`, `delegation-or-handoff`.

# Guidance

# Framework use

Implement from supplied public references, named package-owned public documentation or examples, generated caller contracts, and ordinary project diagnostics. Do not browse package trees for alternatives.

Never inspect package `dist`, framework internals, runtime exports, caches, sibling applications, or declarations not explicitly supplied as public context. Never import from `node_modules/` or `dist/` paths. A diagnostic may name an internal file; use the diagnostic without opening it.

Repair ordinary diagnostics through the project checks. When supplied material does not determine the next API shape, try at most one directly supported repair, then report a context or design blocker instead of trying speculative variants.

---

# Concept implementation

Implement each concept as a plain TypeScript class. Actions take one named input object and return the exact object-shaped result:

- `returns (item: Item)` becomes `{ item }`;
- `returns ()` becomes `{}`;
- `one` returns one row object;
- `optional` is annotated `Row[]` or `Array<Row>` and returns zero or one row; and
- `many` returns an array in its promised stable ordering.

Return each query's exact declared row shape. Do not add fields, including an identity merely because the caller supplied it. A query or action declared with no inputs takes no parameter at all. Raise only the exact refusal codes declared for each action.

Registration reads the prototype. Keep undeclared helpers `#private` or module-level; TypeScript `private` still emits a prototype method. Provide an explicit constructor whose parameters have real defaults so runtime arity is zero:

```ts
constructor(initial: Iterable<Row> = []) {
  this.#rows = new Map(Array.from(initial, (row) => [row.id, row]));
}
```

Test no-argument construction and `ConceptClass.length === 0`.

Export the raw class and one stable error class per declared refusal. Production registration belongs to application integration. A refusal must leave the requested transition unapplied. Enforce race-sensitive and security-critical invariants in the owner action and, for persistence, in the same transaction or constraint.

Keep peer identities opaque; never import, call, or inspect peer concept facts. Implement only approved behavior even when an example shows more.

Test exact result objects, success, refusals, repetition, lifecycle, query cardinality/order, and contracted persistence. Test public behavior rather than layout or framework internals.

# Context

## Task

**.sync-engine/work/recommending/inputs/concept-task.md**

# Concept implementation: ProfileSetting and Recommending

Implement `src/concepts/ProfileSetting.ts` and `src/concepts/Recommending.ts` as plain
classes exactly matching the approved contracts, with `ProfileSetting.test.ts` and
`Recommending.test.ts`. Follow `src/concepts/MutualMatching.ts` style: exported row types,
one error class and detail constant per refusal code, zero-arity constructor with optional
initial state, `#private` helpers, no clock reads, no peer imports. `Entries` is `string[]`;
`User` is `string`. Optional numeric inputs may arrive as `undefined` or `null`; both mean
omitted. Whitespace-only text counts as empty.

Tests: exact result objects; every refusal leaves state unchanged; repetition; query
cardinality and order; each score factor including the prose example (1, 0.5, 1, 1, 0.5 →
0.8), normalization and duplicate entries, zero preferred distance, great-circle distance;
refresh preserves status and re-enables eligibility; feed filtering/order;
`Class.length === 0`.

Checks: `bun test src/concepts` and `bunx tsc --noEmit` pass.

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

## Concept specifications

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

## Exact starting paths

**.sync-engine/work/recommending/inputs/concept-starting-paths.md**

- src/concepts/MutualMatching.ts (style reference)
- src/concepts/MutualMatching.test.ts (test style reference)
- src/concepts/ProfileSetting.ts, src/concepts/Recommending.ts and their tests (new)

# Result

Unless the task requests another format, return these headings in order. Omit progress narration.

- `## Status` — required. First line is exactly `Complete` or `Blocked`; explanation goes below.
- `## Changed` — required. Paths changed, or none.
- `## Checks` — required. Exact command and pass/fail outcome.
- `## Blockers` — required. Categorize as design, context, or environment.
- `## Concerns` — optional. Material non-blocking uncertainty only.

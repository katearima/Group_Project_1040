# Role and objective

Work unit `recommending`; role `critic`; phase `contracts`.

# Contract critic

Independently review the complete changed contract set after authored syntax validation. Use the brief, affected approved contracts, and supplied decomposition as authority.

Check scope, sole mechanism ownership, opaque peer identities, action success and refusal state, repetition, lifecycle, query cardinality and ordering, authorization enforcement, effect ownership, acknowledgement order, and recoverable obligations.

Record one compact assessment row per affected obligation covering trigger, closing reaction, visible success, false interval, acknowledgement order, retry identity, whether the owner accepts that identity, recovery action, and duplicate-effect risk. Inventory selected endpoints, internal reactions, views, formers, computations, links, and endpoint paths. Check that every derived value or optional-input branch implied by the prose has exactly one declared computation and that no computation depends on concept state.

Missing authority, bypassable authorization, duplicate ownership, unrecoverable required work, or behavior required for visible success/refusal is a blocker. When the brief or decomposition requires endpoints, links, or cross-concept behavior, the absence of an application contract in supplied or granted design is a blocker. Return a `Blocked` verdict for that absence, not `Approve` with a note. Give other consequential mismatches stable material-finding IDs. Ignore naming polish, parser mechanics, implementation staging, and unrelated pre-existing issues.

Do not edit design, prescribe implementation, or infer missing context.

# Access

Root: "/Users/fidan10/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `work-unit:brief.md` ("/Users/fidan10/Group_Project_1040/.sync-engine/work/recommending/brief.md"), `design:compositions/Matching.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Matching.md"), `design:compositions/Profiles.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Profiles.md"), `design:compositions/Recommendations.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Recommendations.md"), `design:concepts/ProfileSetting.md` ("/Users/fidan10/Group_Project_1040/design/concepts/ProfileSetting.md"), `design:concepts/Recommending.md` ("/Users/fidan10/Group_Project_1040/design/concepts/Recommending.md"), `design:types.md` ("/Users/fidan10/Group_Project_1040/design/types.md").
- Write: none.
- Tools: `repository-read`.
- Shell: `none`; network: no; generated output: no; long-running processes: no.

Inspect only listed files or directories. In coordinator simulation, this grant binds the coordinator itself; broader coordinator access and prior discovery are unavailable to the assignment. Project checks may transitively read other project files, but do not inspect them yourself. Use supplied or task-named package-owned public documentation; do not browse package trees. Never inspect package `dist`, framework internals, caches, sibling applications, or undeclared declarations. Exclude `.git`, `.sync-engine` except this prompt, harness/skill configuration, agent traces, parent directories, and unrelated generated output. Ask for context instead of searching outside the grant. Generated files come only from granted commands. Never grantable: `git-mutation`, `dependency-installation`, `framework-internals`, `workflow-management`, `skill-cli-invocation`, `delegation-or-handoff`.

# Guidance

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

---

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

---

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

# Context

## Review task

**.sync-engine/work/recommending/inputs/critic-task.md**

# Contract review: ProfileSetting, Recommending, Profiles, Recommendations

Review the new and changed contracts against the brief and the team's prose design
(context excerpt). Focus on: fidelity to the prose (validation, publication rules, the
five-factor score, status preservation on refresh); refusal completeness and branch
exclusivity; authorization (session user only); ordering of the refresh fan-out relative to
the answer; partial-failure and retry behavior of the best-effort refresh; whether
Reactions 1 and 2 are fully covered for publish, update, set pitch, and set preferences;
realizability of the optional preference numbers and opaque `Entries` collections; and
whether deferred items are documented honestly.

Return a Verdict of Approve, Revise, or Blocked with numbered findings (F1, F2, ...), each
naming the file, the problem, and the smallest repair.

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

## Changed candidate contracts

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

Refreshes for different pairs are separate Recommending actions and are not atomic with
the profile change or with each other. If a refresh faults, the endpoint reports the fault;
the profile change and any refreshes already made remain. Retrying the same request is safe
for publish (publishing a visible profile succeeds again) and for updates (the same values
are written again), and any later publish, update, pitch, or preference change recomputes
every pair of that user.

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
kilometers and a minimum weekly availability. An omitted or null number means no
preference for that factor and clears any earlier one; the endpoint decides which numbers
were supplied with [a supplied-number test](computation:numberSupplied).

The reaction first reads ProfileSetting `_recommendationData` for the session user. When
the user has no profile it returns `PREFERENCES_NEED_PROFILE` without changes. Otherwise
Recommending `setPreferences` replaces all of the user's preferences, refusing negative
numbers or empty entries (`INVALID_PREFERENCES`) without changes. Repeating the same
request succeeds again.

After the preferences are saved, Reaction 2 runs: when the user's profile is visible, the
recommendation refresh described in Profiles recomputes both directions for every visible
candidate with the opposite role, so the new preferences change the user's scores for
others and others' scores for the user (through the skills factor). A hidden profile
refreshes nothing until it is published. The endpoint answers after every refresh has
completed, with the same best-effort failure behavior as the Profiles refresh: saved
preferences stay saved, and any later change or publish recomputes every pair.

```endpoints
Recommendations.Requests.SetPreferences at /recommendations/set-preferences
```

```computations
numberSupplied(value: Number) : Flag
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
  A finite set of trimmed text entries, such as skills or interests.
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
Rule: Every skills and interests entry is nonempty.
Rule: Text containing only whitespace counts as empty.
Rule: A Profile is complete when its name and location are nonempty, its skills and its interests each have at least one entry, and, when its role is FOUNDER, its startupPitch is present.
Rule: Every visible Profile is complete.
Rule: Profiles are kept in creation order.
Rule: The profile data is invalid when graduationYear is not a positive whole number, latitude or longitude is out of range, availability is negative, or any skills or interests entry is empty.
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
  A finite set of text entries, such as skills, interests, or universities.
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
Rule: A present preferredDistance (kilometers) or preferredAvailability (hours per week) is nonnegative, and every preferred entry is nonempty.
Rule: A User without Preferences, or with empty preferred sets or absent numbers, has no preference for that factor.
Rule: Every score is between 0 and 1 inclusive.
Rule: Text containing only whitespace counts as empty.
Rule: Entries are compared after trimming leading and trailing whitespace and ignoring letter case; entries equal after this normalization count once.
Rule: Recommendation data is one person's skills, interests, university, latitude, longitude, and availability, supplied by the caller; Recommending never stores it.
Rule: Recommendation data is invalid when a skills or interests entry is empty, latitude is outside -90 to 90, longitude is outside -180 to 180, or availability is negative; an empty university is valid and matches no university preference.
Rule: The skills factor is the average of two directions: the fraction of the viewer's preferred skills found in the candidate's skills, and the fraction of the candidate's preferred skills found in the viewer's skills; a direction whose preferred set is empty is 1.
Rule: The interests factor is the fraction of the viewer's preferred interests found in the candidate's interests; when the viewer prefers none, the viewer's own interests are used instead; when that set is also empty, the factor is 1.
Rule: The university factor is 1 when the viewer prefers no university or the candidate's university is among the preferred universities, and 0 otherwise.
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

**design/types.md**

# Application types and instances

Every person in the application is identified by the Account that Authenticating
established. A session's subject, the users of MutualMatching, and the recipients of
Notifying are all that same Account identity, so the signed-in user resolved from a session
is directly the user who decides, matches, and receives notifications. Callers never supply
their own identity.

```instances
instantiate Authenticating

instantiate Sessioning with
  Subject is Authenticating.Account

instantiate MutualMatching with
  User is Authenticating.Account

instantiate Notifying with
  User is Authenticating.Account

instantiate ProfileSetting with
  User is Authenticating.Account

instantiate Recommending with
  User is Authenticating.Account
```

Profile owners and the viewers and candidates of recommendations are the same Account
identity, so the session user's profile, preferences, and feed all key on one identity.

Every flow binds one instant when it enters the application and passes that same instant
to each session check, session start or end, and notification it causes.

```computations
currentInstant() : DateTime
  Produces the instant at which the current flow entered the application; it is read once per flow and reused for every step of that flow.
```

## Additional directed context

**.sync-engine/work/recommending/inputs/concept-design-excerpt.md**

# Startup Matching App — Concept Design

## 1. ProfileSetting

### Purpose

To help people present their skills, interests, and what they are looking for, so potential collaborators can understand whether they would be a good fit without having to reach out to everyone individually.

### Operational Principle

When someone joins the platform, they create a profile and choose whether they are a founder looking for teammates or a student looking to join a startup. A user can only choose one role.

Both founders and builders enter their name, university, major, graduation year, skills, experience, interests, location, and availability.

Founders also describe their startup idea and what kind of teammates they need.

Both sides can also enter their matching preferences during the same setup process. These preferences belong to Recommending, which uses them to decide which people to show first.

For example, Keti is an MIT student interested in working at an early-stage startup. She creates a profile, adds her software engineering skills, and indicates that she is interested in data tools.

Bumba is a BU student with a startup idea. He creates a founder profile describing his idea and the skills he needs in a co-founder.

Both can update their profiles as their interests change. They can publish their profiles when they are ready for other people to discover them, and hide them when they want to stop appearing in recommendations.

### State

```text
concept ProfileSetting [User]

types
  Role is FOUNDER or BUILDER

state
  a set of Profiles with
    a unique owner User
    a role Role
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
    an optional startupPitch String
    a visible Flag

  Rule: A user has at most one profile.
  Rule: A user can have only one role.
  Rule: Only founders can have startup pitches.
  Rule: Availability cannot be negative.
  Rule: Graduation year is a positive whole number.
  Rule: Latitude is between -90 and 90 and longitude is between -180 and 180.
  Rule: A visible profile meets the publication requirements below.
```

The user's name will be in the form \[First] \[Last initial]. We deliberately obfuscate last names to prevent race/ethnicity based discrimination.

The location is a named place, such as a campus or neighborhood, with latitude and longitude in degrees. It does not need to be a home address. Coordinates must be valid even while a profile is hidden. Coordiates are not shared publicly for security but used on the backend to determine proximity.

For a profile to be published, its name and location must contain nonempty text, and its skills and interests must each contain at least one nonempty entry. Users will be highly recommended to include university, major, and graduation year information. Experience can be empty. Founders must also have a nonempty startup pitch.

Here and below, text containing only spaces counts as empty. Skill and interest entries cannot be empty. Draft profiles can have empty text fields or empty sets until they are ready to be published.

### Actions

**createProfile**

```text
createProfile(
  user: User,
  role: Role,
  name: String,
  university: String,
  major: String,
  graduationYear: Number,
  skills: set of String,
  experience: String,
  interests: set of String,
  location: String,
  latitude: Number,
  longitude: Number,
)
  where user does not already have a profile
  and graduationYear is a positive whole number
  and latitude and longitude are within their allowed ranges
  and every supplied skill and interest entry is nonempty
  then
    create a profile with the given information and owner user
    leave startupPitch absent
    set visible to false
```

**setStartupPitch**

```text
setStartupPitch(user: User, pitch: String)
  where user has a profile with role FOUNDER
  and pitch is nonempty
  then
    set startupPitch to pitch
```

**updateProfile**

```text
updateProfile(user: User, information: ProfileData)
  where user has a profile
  and information has a positive whole-number graduationYear
  and its latitude and longitude are within their allowed ranges
  and every supplied skill and interest entry is nonempty
  and, if the profile is visible, the updated profile still
      meets all publication requirements
  then
    replace the editable profile fields with information
    keep the owner, role, startupPitch, and visibility unchanged
```

Here, `ProfileData` is a value containing `name: String`, `university: String`, `major: String`, `graduationYear: Number`, `skills: set of String`, `experience: String`, `interests: set of String`, `location: String`, `latitude: Number`, and `longitude: Number`. All these fields are supplied when updating a profile. It does not include owner, role, startup pitch, preferences, or visibility. Startup pitches are changed only through `setStartupPitch`.

**publishProfile**

```text
publishProfile(user: User)
  where user has a profile
  and the profile meets all publication requirements above
  then
    set visible to true
```

**hideProfile**

```text
hideProfile(user: User)
  where user has a visible profile
  then
    set visible to false
```

### Queries

**\_getProfile**

```text
_getProfile(user: User): optional (profile: Profile)
```

Returns the user's profile, or no result if it does not exist.

**\_getVisibleProfiles**

```text
_getVisibleProfiles(): many (profile: Profile)
```

Returns all profiles currently visible on the platform, or no results if there are none. Their order is unspecified.

---

## 2. Recommending

### Purpose

To reduce choice overload by prioritizing people who are likely to be a good fit, so users don't have to go through hundreds of unrelated startup listings and potentially miss someone compatible.

### Operational Principle

Instead of showing everyone in one long list, the platform recommends people based on their compatibility. Users can choose the skills, interests, universities, distance, and availability they prefer, and change these preferences later.

Recommendations consider shared interests, complementary skills, university preferences, availability, and physical proximity. All five factors have equal weight in the ranking. A factor with no stated preference does not lower the score; for interests, the user's own interests are used instead.

For example, Keti has software engineering experience and is interested in data tools. Bumba is building a data tool and needs a technical co-founder. Even though they attend different universities, Bumba appears high in Keti's recommendations because their interests and skills align.

When Keti sees a profile, she can choose:

- **Show Interest:** She wants to connect with that person.
- **Pass:** She is not interested and doesn't want to see that profile again.
- **See Later:** She is not sure yet, so the profile is removed from her current feed but may be recommended again in a future browsing session.

The feed changes as users update their preferences, new people join, and users make decisions about the profiles they see.

### State

```text
concept Recommending [User]

types
  RecommendationStatus is AVAILABLE or SEE_LATER or PASSED or INTERESTED

state
  a set of Preferences with
    a unique owner User
    a preferredSkills set of String
    a preferredInterests set of String
    a preferredUniversities set of String
    an optional preferredDistance Number
    an optional preferredAvailability Number

  a set of Recommendations with
    a viewer User
    a candidate User
    a score Number
    a status RecommendationStatus
    an eligible Flag
    unique viewer and candidate

  Rule: A user cannot be recommended to themselves.
  Rule: Each viewer-candidate pair has at most one recommendation.
  Rule: Preferred distance and availability, when present, cannot be negative.
  Rule: Scores are between 0 and 1.
```

Empty preference sets mean that the user has not selected a preference. An absent preferred distance means there is no distance preference, and an absent preferred availability means there is no minimum time commitment. Distance is measured in kilometers. A user who has never saved preferences uses these same defaults.

`RecommendationData` is a value containing `skills: set of String`, `interests: set of String`, `university: String`, `latitude: Number`, and `longitude: Number`. Its sets contain nonempty entries, its university is nonempty, latitude is between -90 and 90, longitude is between -180 and 180, and availability is nonnegative. These are copies of relevant information supplied to an action, not profile objects that Recommending can look inside or change.

### How the Score Is Calculated

For the initial version, each of the five factors gets a score between 0 and 1. The final score is their average. Skills, interests, and university names are compared after removing spaces at the beginning and end and ignoring capitalization. Entries that become the same after this step count only once.

- **Skills:** First, find the fraction of the viewer's preferred skills that the candidate has. Then find the fraction of the candidate's preferred skills that the viewer has. Average these two numbers. An empty set of preferred skills gives 1 for that direction. This means Bumba's preference for software engineering can help him match with Keti even if Keti has not selected any preferred skills herself.
- **Interests:** Find the fraction of the viewer's preferred interests that the candidate has. If the viewer has not chosen preferred interests, use the viewer's own interests instead. If that set is also empty, this factor is 1.
- **University:** Give 1 if the viewer has no university preference or the candidate attends one of the selected universities. Otherwise, give 0. No university gets extra points because of its name or reputation.
- **Availability:** Give 1 if the viewer has no preferred minimum or the minimum is zero. Otherwise, divide the candidate's availability by the viewer's preferred minimum, with a maximum of 1.
- **Proximity:** Give 1 if the viewer has no preferred distance. Otherwise, the score is `max(0, 1 - distance / preferredDistance)`. If preferred distance is zero, give 1 only when the distance is zero, and 0 otherwise.

Distance is the shortest distance between the two coordinates along the Earth's surface, in kilometers, without following roads or transit routes. Use the great-circle distance on a sphere with radius 6,371 kilometers. Two locations with the same coordinates have distance zero, even if their names differ.

For example, if the five factor scores are 1, 0.5, 1, 1, and 0.5, the final score is 0.8. A preference affects ranking, not whether a visible person with the opposite role can appear at all. Scores in the two directions can differ because the users may have different preferences.

### Actions

**setPreferences**

```text
setPreferences(
  user: User,
  skills: set of String,
  interests: set of String,
  universities: set of String,
  distance?: Number,
  availability?: Number
)
  where distance and availability, when supplied, are nonnegative
  and every supplied skill, interest, and university entry is nonempty
  then
    create a preference record with owner user if one does not exist
    replace preferredSkills, preferredInterests, and
      preferredUniversities with the supplied sets
    set preferredDistance and preferredAvailability to
      the supplied numbers, clearing either if omitted
```

**refreshRecommendation**

```text
refreshRecommendation(
  viewer: User,
  candidate: User,
  viewerData: RecommendationData,
  candidateData: RecommendationData
)
  where viewer and candidate are different users
  and both data values meet the requirements described above
  then
    calculate the score using the five-factor rule,
      the supplied data, and the preferences stored here
      for viewer and candidate, or their defaults
    if no recommendation exists for this viewer-candidate pair:
      create one with the given viewer and candidate,
        the calculated score, status AVAILABLE, and eligible true
    otherwise:
      update its score and set eligible true
      preserve its existing status
```

**seeLater**

```text
seeLater(viewer: User, candidate: User)
  where a recommendation exists for this viewer-candidate pair
  and it is eligible
  and its status is AVAILABLE
  then
    change its status to SEE_LATER
```

**markPassed**

```text
markPassed(viewer: User, candidate: User)
  where a recommendation exists for this viewer-candidate pair
  then
    change its status to PASSED
```

**markInterested**

```text
markInterested(viewer: User, candidate: User)
  where a recommendation exists for this viewer-candidate pair
  and its status is AVAILABLE or SEE_LATER
  then
    change its status to INTERESTED
```

**startNewSession**

```text
startNewSession(viewer: User)
  then
    change all SEE_LATER recommendations
    belonging to viewer back to AVAILABLE
```

**deactivateRecommendation**

```text
deactivateRecommendation(
  viewer: User,
  candidate: User
)
  where a recommendation exists for this viewer-candidate pair
  then
    set eligible to false
```

### Queries

**\_getFeed**

```text
_getFeed(viewer: User):
  many (candidate: User, score: Number)
```

Returns only recommendations whose viewer is the supplied viewer, where `eligible` is true and status is `AVAILABLE`, ordered from highest to lowest score. Equal scores may appear in any order. If the viewer has no available recommendations, including an unknown viewer, the query returns no results.

Profiles marked `PASSED` or `INTERESTED` are excluded from the feed. Profiles marked `SEE_LATER` are excluded until a new browsing session. A new browsing session begins when the user opens discovery after leaving it; refreshing the current feed does not start a new session.

**\_getPreferences**

```text
_getPreferences(user: User): optional (preferences: Preference)
```

Returns the user's saved preferences, or no result if they have never saved any, including an unknown user. An absent numeric value means no preference. The same defaults apply when there is no preference record.


# 6. Reactions (excerpt)
Reactions define how the five concepts work together. Each concept has its own state and actions, and reactions connect their behaviors without requiring the concepts to call one another directly.

### Requests from Users

The five concepts do not call each other or check each other's state. The app accepts requests from signed-in users and uses reactions to decide which concept actions can happen. `Requesting` below represents this application boundary, not a sixth main feature concept. The signed-in user comes from the authenticated session; someone cannot supply another person's identity to act as them.

Only the requests listed below are available to users. Recommendation refreshes, feed-status updates, notification creation, and conversation creation and closing happen only through reactions. A request that does not meet its conditions does not cause the concept action to happen. The app finishes the resulting reactions before handling another request involving the same users or conversation.

| Request                          | Conditions and resulting action                                                                                                                                                                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create a profile                 | `Requesting.createProfile(user, ...)` triggers `ProfileSetting.createProfile` through a reaction for the signed-in user with the supplied fields. The action's validation still applies.                                                                                           |
| Edit, publish, or hide a profile | `Requesting.updateProfile`, `setStartupPitch`, `publishProfile`, and `hideProfile` act only on the signed-in user's profile. Each triggers the corresponding ProfileSetting action when its preconditions hold.                                                                    |
| Set preferences                  | `Requesting.setPreferences(user, ...)` requires that the signed-in user has a profile, then triggers `Recommending.setPreferences` for that user. Preferences belong only to that user.                                                                                            |
| Show Interest                    | `Requesting.showInterest(user, other)` follows the guarded reaction below.                                                                                                                                                                                                         |
| Pass                             | `Requesting.pass(user, other)` requires an existing recommendation from user to other, or an incoming INTERESTED decision from other to user. It triggers `MutualMatching.pass` only if its preconditions hold. A hidden profile does not prevent dismissing an existing interest. |
| See Later                        | `Requesting.seeLater(user, other)` requires an eligible AVAILABLE recommendation for the signed-in viewer, then triggers `Recommending.seeLater`.                                                                                                                                  |
| Begin browsing                   | `Requesting.startNewSession(user)` requires a visible profile and the beginning of a new browsing session, then triggers `Recommending.startNewSession` for that user.                                                                                                             |
| Unmatch                          | `Requesting.unmatch(user, other)` requires an active match involving the signed-in user, then triggers `MutualMatching.unmatch`.                                                                                                                                                   |
| Send a message                   | `Requesting.sendMessage(user, conversation, content)` follows the guarded reaction below.                                                                                                                                                                                          |
| Read or dismiss a notification   | `Requesting.markAsRead` and `dismissNotification` require that the notification belongs to the signed-in user, then trigger the corresponding Notifying action when its preconditions hold.                                                                                        |

```text
when Requesting.showInterest(user, other)

where ProfileSetting:
  user and other have visible profiles with opposite roles
and MutualMatching:
  user and other are different and are not already matched
  user has not already made a decision about other

then
  MutualMatching.showInterest(user, other)
```

```text
when Requesting.sendMessage(user, conversation, content)

where Chatting:
  conversation exists and is OPEN
  user is a participant and other is the other participant
  content is nonempty
and MutualMatching:
  user and other have an active match

then
  Chatting.sendMessage(conversation, user, content)
```

The app also limits reading to the signed-in user's own feed, preferences, incoming interests, matches, conversations, and notifications. Message history is available only to the two conversation participants, including after unmatching. A user can view their own profile, visible profiles, and the profile of someone with whom they already have a match or conversation. Hiding a profile removes it from discovery but does not end existing connections. Incoming interests from hidden users can still be passed on, but Show Interest requires both profiles to be visible.

Queries that return a Profile, Preference, Conversation, Message, or Notification return its identity. To display its details, the app reads the relevant fields through the owning concept under the same access rules; it does not treat the identity as an object containing fields from other concepts.

`profileLink`, `matchesLink`, and `conversationLink` below produce navigation links to the relevant profile, the recipient's own matches, or the conversation. Having a link does not bypass these access rules.

## Reaction 1: Creating Recommendations

When someone publishes their profile, the platform generates recommendations between that user and other visible users with the opposite role.

```text
when ProfileSetting.publishProfile(user)

where ProfileSetting:
  user and candidate have visible profiles with opposite roles
  userData and candidateData contain their skills, interests,
    university, latitude, and longitude

then
  Recommending.refreshRecommendation(
    user, candidate, userData, candidateData
  )

  Recommending.refreshRecommendation(
    candidate, user, candidateData, userData
  )
```

This reaction runs for each eligible candidate.

The reaction supplies the two `RecommendationData` values. Recommending calculates the score using its own preferences and the five equally weighted factors. This also applies when a hidden profile is published again; existing decisions are preserved.

## Reaction 2: Updating Recommendations

When someone changes their profile or preferences, their recommendations are recalculated.

```text
when Recommending.setPreferences(user, ...)

where ProfileSetting:
  user and candidate have visible profiles with opposite roles
  userData and candidateData contain their skills, interests,
    university, latitude, and longitude

then
  Recommending.refreshRecommendation(
    user, candidate, userData, candidateData
  )

  Recommending.refreshRecommendation(
    candidate, user, candidateData, userData
  )
```

Two more reactions have exactly the same conditions and effects, triggered separately by `ProfileSetting.updateProfile(user, information)` and `ProfileSetting.setStartupPitch(user, pitch)`. Each reaction runs for every eligible candidate and uses the latest profile information. Startup pitch text does not itself add points. Changes made while hidden take effect when the profile is published again.

Previously passed profiles stay passed even if their compatibility score changes.

# Result

Unless the task requests another format, return these headings in order. Omit progress narration.

- `## Verdict` — required. First line is exactly `Approve`, `Revise`, or `Blocked`.
- `## Assessments` — required. Compact obligation-by-obligation semantic assessment; do not restate contracts.
- `## Findings` — required. Stable-ID blocker or material findings, or none.

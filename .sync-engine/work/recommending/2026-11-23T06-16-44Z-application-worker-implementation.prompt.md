# Role and objective

Work unit `recommending`; role `application-worker`; phase `implementation`.

# Application worker

Implement and test the assigned registration, composition, assembly, configuration, boundary, host, and integration work from approved design and concept surfaces. Keep concept implementations, frontend behavior, and authored design read-only unless the task explicitly expands ownership.

Before editing, inventory every selected endpoint, internal reaction, view, former, computation, module/group placement, and endpoint path against the supplied design. Register raw concept classes, refusals, computations, and static instances exactly once. Implement each approved obligation, acknowledgement order, and recovery path through documented composition declarations.

Use the selected transport end to end. Do not invent missing declarations, duplicate owner invariants or effects, bypass the boundary, call concepts directly from a host, or create a parallel product router. Generate artifacts only through project commands.

Repair in-scope wiring and test diagnostics. Do not edit authored design, concept implementation, audit records, or tests outside the write grant, and do not replace required scenarios with skipped or TODO tests. Report a design blocker when every documented realization changes approved behavior, a context blocker when one documented repair leaves the API undetermined, or an environment blocker when checks cannot run.

# Access

Root: "/Users/fidan10/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `application:design` ("/Users/fidan10/Group_Project_1040/design"), `application:generated.config.ts` ("/Users/fidan10/Group_Project_1040/generated.config.ts"), `application:package.json` ("/Users/fidan10/Group_Project_1040/package.json"), `application:src` ("/Users/fidan10/Group_Project_1040/src"), `application:tsconfig.json` ("/Users/fidan10/Group_Project_1040/tsconfig.json").
- Write: `owned-integration:src/assembly.ts` ("/Users/fidan10/Group_Project_1040/src/assembly.ts"), `owned-integration:src/composition.ts` ("/Users/fidan10/Group_Project_1040/src/composition.ts"), `owned-integration:src/compositions/Profiles.ts` ("/Users/fidan10/Group_Project_1040/src/compositions/Profiles.ts"), `owned-integration:src/compositions/Recommendations.ts` ("/Users/fidan10/Group_Project_1040/src/compositions/Recommendations.ts"), `owned-integration:src/concepts.ts` ("/Users/fidan10/Group_Project_1040/src/concepts.ts"), `owned-configuration:generated` ("/Users/fidan10/Group_Project_1040/generated"), `owned-configuration:generated.config.ts` ("/Users/fidan10/Group_Project_1040/generated.config.ts"), `owned-test:src/recommendations.integration.test.ts` ("/Users/fidan10/Group_Project_1040/src/recommendations.integration.test.ts").
- Tools: `repository-read`, `repository-write`.
- Shell: `project-local`; network: no; generated output: yes; long-running processes: no.

Inspect only listed files or directories. In coordinator simulation, this grant binds the coordinator itself; broader coordinator access and prior discovery are unavailable to the assignment. Project checks may transitively read other project files, but do not inspect them yourself. Use supplied or task-named package-owned public documentation; do not browse package trees. Never inspect package `dist`, framework internals, caches, sibling applications, or undeclared declarations. Exclude `.git`, `.sync-engine` except this prompt, harness/skill configuration, agent traces, parent directories, and unrelated generated output. Ask for context instead of searching outside the grant. Generated files come only from granted commands. Never grantable: `git-mutation`, `dependency-installation`, `framework-internals`, `workflow-management`, `skill-cli-invocation`, `delegation-or-handoff`.

# Guidance

# Framework use

Implement from supplied public references, named package-owned public documentation or examples, generated caller contracts, and ordinary project diagnostics. Do not browse package trees for alternatives.

Never inspect package `dist`, framework internals, runtime exports, caches, sibling applications, or declarations not explicitly supplied as public context. Never import from `node_modules/` or `dist/` paths. A diagnostic may name an internal file; use the diagnostic without opening it.

Repair ordinary diagnostics through the project checks. When supplied material does not determine the next API shape, try at most one directly supported repair, then report a context or design blocker instead of trying speculative variants.

---

# Application integration

Own assigned concept registration, instance construction, composition, assembly, configuration, boundary projection, hosting, generated-artifact commands, and integration tests. Use public package subpaths and the supplied declarations.

## Register concepts and instances

Import each approved Markdown specification as text. Register the raw implementation class and map every declared refusal code to its stable error class:

```ts
import { conceptSet, registerConcept } from "@mit-sdg/sync-engine/assembly";
import spec from "@design/concepts/Posting.md" with { type: "text" };
import { InvalidContent, PostingConcept } from "./concepts/Posting.ts";

const posting = registerConcept({
  class: PostingConcept,
  spec,
  refusals: { INVALID_CONTENT: InvalidContent },
});

export const applicationConceptSet = conceptSet({ Posting: posting });
```

Do not wrap, adapt, or subclass a concept merely for registration. When specializing a generic class, preserve the application-specific class name and authored external-type binding. Register each selected static instance once under its authored identity; do not reuse one raw instance under two identities or invent an undeclared instance. Register computations as pure functions of their input record; a computation that would need concept state is a design blocker.

For default-constructible concepts, assemble with fresh registered implementations:

```ts
import { assemble } from "@mit-sdg/sync-engine/assembly";
import { applicationConceptSet } from "./concepts.ts";
import { composition } from "./composition.ts";

assemble({
  conceptSet: applicationConceptSet,
  instances: applicationConceptSet.implementations(),
  composition,
});
```

## Realize selected declarations

Implement only declarations selected by exact authored links. An endpoint is the reaction named by its `reaction:` link and uses the pathname from its matching endpoint entry. A separate internal reaction requires its own link. Keep module, group, declaration, computation, and path identities aligned.

Composition coordinates owners but does not absorb their invariants or make them atomic. Implement required effects before acknowledgement unless approved failure semantics say otherwise. Give retries a stable identity accepted by the effect owner and implement the designed recovery action.

Hosts project the boundary and contain no product policy. Never build a request router outside the `@mit-sdg/sync-engine-http` handler and policy. A host may wrap the handler in `Bun.serve` but must not match paths itself. A supplied transport owns its routing, wire, and error policy; do not duplicate it with a hand-written router or direct concept calls.

Treat source-agreement diagnostics as contract mismatches rather than hiding them with alternate wiring. Run generation through the project command and never edit generated files. Use the generated core wire for gateways; transport projections are caller contracts, not assembly input.

---

# Composition declarations

`@mit-sdg/sync-engine/language` declares reactions, views, formers and computations;
`@mit-sdg/sync-engine/boundary` declares endpoints. Declaration does not execute:
`assemble` from `@mit-sdg/sync-engine/assembly` registers what these produce.

Import an approved specification through the `@design` alias, which the installed
`tsconfig.json` maps to the design root: `import spec from "@design/concepts/Name.md" with
{ type: "text" }`. `generated.config.ts` lists only the application documents,
`design/types.md` and `design/compositions/*.md`, as URLs written
`new URL("./design/types.md", import.meta.url)`. Concept specifications enter through
`registerConcept({ spec })` and are never listed there; the application-design loader
rejects a concept file with "types fence accepts only `concrete Name` declarations".

## Reactions

`reaction`, `when`, `where`, `returned`, `refused`, `no`, `whether`, `earlier`, `now` and
`is` come from `@mit-sdg/sync-engine/language`.

```ts
reaction(({ author, post }) =>
  when(Posting.publish({ author }).responds({ post })).then(Indexing.add({ item: post })),
);
```

- A trigger is one callable action line or one outcome channel, followed by optional
  `.where(...)` conditions and `.then(...)` consequences. `action(input)` alone matches the
  request; `.responds(output?)` and `.refuses(output?)` match the outcome.
- `returned(pattern?, { by?, except?, exceptBy? }?)` and `refused(...)` match an action's
  outcome and may be the trigger themselves, as in
  `when(returned({ post }, { by: "Posting.publish" }))`. `where(...)` takes conditions;
  `no(readLine)` and `whether(readLine)` test one.
- `earlier(action, input, output?)` refers to a prior occurrence.
- `now(variable)` binds the instant stamped on this flow's outermost occurrence, so every
  reaction in one flow reads one time and a caller can author none. Pass that variable to
  each action needing the instant; never model a clock as a concept.
- `is.lt`, `is.le`, `is.gt`, `is.ge`, `is.among` compare.
- `.afterFlowSettles()` may follow `when(trigger)` or a completed stage, then `.then(step)`
  or `.where(...).then(step)`. A chained deferred stage accepts condition lines only.

Each composition module exports one `composition` record of named groups, and `assemble`
receives those records keyed by module:

```ts
export const composition = { Publishing: { PublishPost, IndexOnPublish } };
```

An authored link names the same three parts: `reaction:Board.Publishing.IndexOnPublish`
requires module `Board`, group `Publishing` and declaration `IndexOnPublish`. Read the
approved design's links and use those exact names; `MISSING_COVERAGE` reports a selected
declaration no link names.

## Views, formers and computations

`view`, `former`, `form`, `each`, `count` and `compute` come from the same subpath.

```ts
view(name, (input, output, free) => where(...)).holds();
view(name, (input, output, free) => where(...)).one();
former(name, (input, free) => form({ ...shape }));
former(name, (input, free) => where(...).form({ ...shape }));
```

- A view's `.holds()`, `.one()`, `.optional()`, or `.many()` follows the closing
  `view(...)`; it is never called on `where(...)`.
- Builders receive binding bags. Reading a property, including by destructuring, declares a
  stable logic variable in that partition. Bind query outputs with `.is({ ... })`; do not
  destructure the query call itself:

  ```ts
  const targetFor = view("target for (code)", ({ code }, { target }, _free) =>
    where(Shortening._resolve({ code }).is({ target })),
  ).one();
  ```

  Completed views and formers take one object-shaped input mapping.

- A view with no output binding is a predicate and ends in `.holds()`. A view that binds
  output rows returns `.many()` by default and may state `.one()` or `.optional()` instead.
  Stacked `where` blocks are alternatives, and local bindings do not escape the view.
- `each(readLine).where(...).arranged(...)` then a consumer:

| Consumer           | Result                                     | Empty selection |
| ------------------ | ------------------------------------------ | --------------- |
| `.form({ ... })`   | one record per row                         | `[]`            |
| `.count()`         | number of rows                             | `0`             |
| `.first(value)`    | value from the first row after arrangement | `null`          |
| `.distinct(value)` | first-seen distinct values                 | `[]`            |

- A `form({ ...shape })` entry may be a bound variable, another formed node, or portable
  JSON literal data. Use literals directly for constant fields and structures; do not add a
  computation solely to produce a constant. Functions, symbols, `undefined`, non-finite
  numbers, class instances, and cyclic values are not portable literals.
- `form({ ...shape }).splicing(...formerUses)` merges record-rooted fragments into a host
  record. Every variable a fragment input references must already be bound, and fragment
  keys must not collide with host or earlier-fragment keys. A plain optional fragment drops
  the host row when absent; `whether(...)` keeps it and fills its leaves with `null`.
- `count(query, input, outputVariable)` requires one non-union query reference and its
  complete input mapping; undeclared fields are rejected recursively.
- `compute(named, input, output)` is a condition line inside `where(...)`. It runs a pure
  function supplied as `conceptSet`'s optional second argument and exposed as
  `set.computations`; it never takes a bare function. The function receives only its input
  record and must not read concept instances, `implementations()` results, or module-level
  mutable state. A computation that needs state is a design error to block on. A variable
  output binds the complete result. For a record-shaped, non-array result, an object output pattern binds or tests
  several fields, including nested fields, and each variable remains wire-traceable through
  its return-type path. Write
  `conceptSet({ ... }, { describe: ({ value }) => ({ label: String(value), rank: 1 }) })`,
  then `compute(set.computations.describe, { value }, { label, rank })`. A no-input
  computation uses `{}`. `is` exposes `.lt`, `.le`, `.gt`, `.ge`, and `.among`; test a
  computed boolean with `is.among(live, [true])` or `is.among(live, [false])`. Build the
  computation record before the set; references from separate sets do not mix.
- A query's `"one" | "optional" | "many"` promise links to a record return for `"one"` and
  an array of records otherwise, at type level and at runtime.

## Endpoints

`endpoint`, `receive` and `respond` come from `@mit-sdg/sync-engine/boundary`.

An endpoint is itself a selected reaction. Its design carries both a `reaction:` link and
an `endpoints` entry with the same module, group, and declaration name:

```text
Publishing a post [enters the application](reaction:Board.Publishing.PublishPost).
```

```endpoints
Board.Publishing.PublishPost at /board/post
```

Use that exact identity and path in the declaration and placement:

```ts
const PublishPost = endpoint(
  "/board/post",
  ({ author, content, post }) =>
    receive({ author, content })
      .then(Posting.publish({ author, content }).responds({ post }))
      .then(respond({ post })),
  { input: { required: ["author", "content"] } },
);

export const composition = { Publishing: { PublishPost } };
```

and register that composition under its linked module:

```ts
assemble({
  conceptSet: applicationConceptSet,
  instances: applicationConceptSet.implementations(),
  composition: { Board: composition },
});
```

Do not wrap the endpoint in another reaction. Do not declare an endpoint unless its exact
reaction link and endpoint entry exist in approved design. Conversely, every selected
public endpoint must have both before implementation begins.

- Paths must be canonical absolute URL pathnames that survive WHATWG pathname handling
  unchanged. Queries, fragments, scheme-relative paths, dot segments, malformed percent
  escapes, literal spaces and literal Unicode are rejected.
- `receive(...)` cannot author `path` or `requestId`; `respond(...)` cannot author
  `requestId` or `errorKind`.
- A stage may state `.afterFlowSettles()` to form its response at a settlement frontier; add
  conditions identifying the terminal state the endpoint requires.
- Sibling answers are alternatives, not ordered fall-through: an unconditional sibling
  overlaps every conditional one, and an endpoint records at most one answer. Give each
  branch a condition that excludes the others. Branching on whether an optional input was
  supplied needs a declared computation; if the design declares none, block rather than
  invent one.
- A binding produced by a state read belongs to the stage that consumes it. It does not
  safely cross an intervening action. Consume it before the action, return it from an
  owning action, or read it again in the later stage.
- Validators are explicit: `input`, `output` and `domainError`, each returning
  `{ ok: true } | { ok: false; detail?: string }` synchronously, at most once per path. The
  domain-error validator receives the response's top-level `error`. Generated types carry no
  runtime schema semantics.
- `InputContractDecl` takes `required` (a missing listed key returns `INVALID_INPUT`) and
  `defaults` (filled only when a key is absent). Without one, assembly intersects the keys
  every exported `receive(...)` for that path mentions. An explicit contract replaces that
  rather than merging, and only one may declare it per path. It must leave one `receive`
  alternative reachable: every key that alternative mentions is `required` or carries a
  matching default, or assembly refuses the path. A second alternative differing only by
  an omitted key is the invention the sibling rule forbids.

# Context

## Task

**.sync-engine/work/recommending/inputs/app-task.md**

# Application integration: Profiles and Recommendations

Register ProfileSetting and Recommending in `src/concepts.ts` (refusal maps for every code,
plus the `numberSupplied` computation), add `src/compositions/Profiles.ts` and
`src/compositions/Recommendations.ts` realizing exactly the linked endpoints, add them to
`src/composition.ts` and `generated.config.ts`, map every new refusal code and the
composition-level `NO_PROFILE` and `PREFERENCES_NEED_PROFILE` in `appHttpPolicy`, run
`bun run generate`, and add HTTP integration tests in
`src/recommendations.integration.test.ts` covering the brief's Done-when outcomes.

The recommendation refresh (publish, update, set pitch, set preferences) runs inside each
endpoint reaction after the triggering action, only when a fresh `_recommendationData` read
shows the profile visible, calling `refreshRecommendation` in both directions for every
`_visibleCandidates` row, and answers only after all refreshes. A hidden profile or no
candidates still answers success. Follow `src/compositions/Matching.ts` style (session via
`Sessioning.current` with `now(time)`, `defaults: { session: "" }`).

Checks: `bun run generate`, `bun run check`, `bun test`.

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

## Authored types

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

## Compositions

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

## Concept public surfaces

**src/concepts/ProfileSetting.ts**

import { randomUUID } from "node:crypto";

export type User = string;
export type Profile = string;
export type Role = "FOUNDER" | "BUILDER";
export type Entries = string[];

export interface ProfileRow {
  profile: Profile;
  owner: User;
  role: Role;
  name: string;
  university: string;
  major: string;
  graduationYear: number;
  skills: Entries;
  experience: string;
  interests: Entries;
  location: string;
  latitude: number;
  longitude: number;
  availability: number;
  startupPitch?: string;
  visible: boolean;
}

/** The editable fields shared by createProfile and updateProfile. */
export interface ProfileFields {
  name: string;
  university: string;
  major: string;
  graduationYear: number;
  skills: Entries;
  experience: string;
  interests: Entries;
  location: string;
  latitude: number;
  longitude: number;
  availability: number;
}

export type GetProfileRow = Omit<ProfileRow, "owner">;

export interface RecommendationDataRow {
  role: Role;
  visible: boolean;
  skills: Entries;
  interests: Entries;
  university: string;
  latitude: number;
  longitude: number;
  availability: number;
}

export interface CandidateRow {
  candidate: User;
  skills: Entries;
  interests: Entries;
  university: string;
  latitude: number;
  longitude: number;
  availability: number;
}

export const PROFILE_ALREADY_EXISTS_DETAIL = "You already have a profile.";
export const INVALID_PROFILE_DETAIL =
  "Graduation year, coordinates, availability, skills, and interests must be valid.";
export const PITCH_PROFILE_NOT_FOUND_DETAIL = "Create a profile first.";
export const PITCH_NOT_FOUNDER_DETAIL = "Only founders can have a startup pitch.";
export const EMPTY_PITCH_DETAIL = "A startup pitch must not be empty.";
export const UPDATE_PROFILE_NOT_FOUND_DETAIL = "Create a profile first.";
export const INVALID_PROFILE_UPDATE_DETAIL =
  "Graduation year, coordinates, availability, skills, and interests must be valid.";
export const UPDATE_WOULD_UNPUBLISH_DETAIL =
  "A visible profile must stay complete; hide it before removing required details.";
export const PUBLISH_PROFILE_NOT_FOUND_DETAIL = "Create a profile first.";
export const PROFILE_INCOMPLETE_DETAIL =
  "Add a name, location, at least one skill and interest, and, for founders, a startup pitch before publishing.";
export const PROFILE_NOT_VISIBLE_DETAIL = "You do not have a visible profile.";

/** Refusal PROFILE_ALREADY_EXISTS. */
export class ProfileAlreadyExists extends Error {}
/** Refusal INVALID_PROFILE. */
export class InvalidProfile extends Error {}
/** Refusal PITCH_PROFILE_NOT_FOUND. */
export class PitchProfileNotFound extends Error {}
/** Refusal PITCH_NOT_FOUNDER. */
export class PitchNotFounder extends Error {}
/** Refusal EMPTY_PITCH. */
export class EmptyPitch extends Error {}
/** Refusal UPDATE_PROFILE_NOT_FOUND. */
export class UpdateProfileNotFound extends Error {}
/** Refusal INVALID_PROFILE_UPDATE. */
export class InvalidProfileUpdate extends Error {}
/** Refusal UPDATE_WOULD_UNPUBLISH. */
export class UpdateWouldUnpublish extends Error {}
/** Refusal PUBLISH_PROFILE_NOT_FOUND. */
export class PublishProfileNotFound extends Error {}
/** Refusal PROFILE_INCOMPLETE. */
export class ProfileIncomplete extends Error {}
/** Refusal PROFILE_NOT_VISIBLE. */
export class ProfileNotVisible extends Error {}

function isBlank(text: string): boolean {
  return text.trim().length === 0;
}

function validEntries(entries: unknown): entries is Entries {
  return (
    Array.isArray(entries) &&
    entries.every((entry) => typeof entry === "string" && !isBlank(entry))
  );
}

/** The profile data is valid (State rule: graduation year, coordinates, availability, entries). */
function validData(fields: ProfileFields): boolean {
  return (
    Number.isInteger(fields.graduationYear) &&
    fields.graduationYear > 0 &&
    Number.isFinite(fields.latitude) &&
    fields.latitude >= -90 &&
    fields.latitude <= 90 &&
    Number.isFinite(fields.longitude) &&
    fields.longitude >= -180 &&
    fields.longitude <= 180 &&
    Number.isFinite(fields.availability) &&
    fields.availability >= 0 &&
    validEntries(fields.skills) &&
    validEntries(fields.interests)
  );
}

/** The profile is complete enough to be visible. */
function complete(row: {
  role: Role;
  name: string;
  location: string;
  skills: Entries;
  interests: Entries;
  startupPitch?: string;
}): boolean {
  return (
    !isBlank(row.name) &&
    !isBlank(row.location) &&
    row.skills.length > 0 &&
    row.interests.length > 0 &&
    (row.role !== "FOUNDER" || row.startupPitch !== undefined)
  );
}

function pickFields(fields: ProfileFields): ProfileFields {
  return {
    name: fields.name,
    university: fields.university,
    major: fields.major,
    graduationYear: fields.graduationYear,
    skills: [...fields.skills],
    experience: fields.experience,
    interests: [...fields.interests],
    location: fields.location,
    latitude: fields.latitude,
    longitude: fields.longitude,
    availability: fields.availability,
  };
}

export interface ProfileSettingDependencies {
  /** Source of fresh opaque Profile identities. */
  freshProfile?: () => Profile;
  initial?: Iterable<ProfileRow>;
}

export class ProfileSettingConcept {
  readonly #freshProfile: () => Profile;
  /** Profiles in creation order. */
  #profiles: ProfileRow[] = [];
  #byOwner = new Map<User, ProfileRow>();

  constructor({ freshProfile = randomUUID, initial = [] }: ProfileSettingDependencies = {}) {
    this.#freshProfile = freshProfile;
    for (const row of initial) {
      const copy: ProfileRow = { ...row, skills: [...row.skills], interests: [...row.interests] };
      this.#profiles.push(copy);
      this.#byOwner.set(copy.owner, copy);
    }
  }

  createProfile(
    input: { user: User; role: Role } & ProfileFields,
  ): { profile: Profile } {
    if (this.#byOwner.has(input.user)) {
      throw new ProfileAlreadyExists(PROFILE_ALREADY_EXISTS_DETAIL);
    }
    if ((input.role !== "FOUNDER" && input.role !== "BUILDER") || !validData(input)) {
      throw new InvalidProfile(INVALID_PROFILE_DETAIL);
    }
    const row: ProfileRow = {
      profile: this.#freshProfile(),
      owner: input.user,
      role: input.role,
      ...pickFields(input),
      visible: false,
    };
    this.#profiles.push(row);
    this.#byOwner.set(row.owner, row);
    return { profile: row.profile };
  }

  setStartupPitch({ user, pitch }: { user: User; pitch: string }): Record<string, never> {
    const row = this.#byOwner.get(user);
    if (row === undefined) throw new PitchProfileNotFound(PITCH_PROFILE_NOT_FOUND_DETAIL);
    if (row.role !== "FOUNDER") throw new PitchNotFounder(PITCH_NOT_FOUNDER_DETAIL);
    if (typeof pitch !== "string" || isBlank(pitch)) throw new EmptyPitch(EMPTY_PITCH_DETAIL);
    row.startupPitch = pitch;
    return {};
  }

  updateProfile(input: { user: User } & ProfileFields): Record<string, never> {
    const row = this.#byOwner.get(input.user);
    if (row === undefined) throw new UpdateProfileNotFound(UPDATE_PROFILE_NOT_FOUND_DETAIL);
    if (!validData(input)) throw new InvalidProfileUpdate(INVALID_PROFILE_UPDATE_DETAIL);
    const fields = pickFields(input);
    if (row.visible && !complete({ ...fields, role: row.role, startupPitch: row.startupPitch })) {
      throw new UpdateWouldUnpublish(UPDATE_WOULD_UNPUBLISH_DETAIL);
    }
    Object.assign(row, fields);
    return {};
  }

  publishProfile({ user }: { user: User }): Record<string, never> {
    const row = this.#byOwner.get(user);
    if (row === undefined) throw new PublishProfileNotFound(PUBLISH_PROFILE_NOT_FOUND_DETAIL);
    if (!complete(row)) throw new ProfileIncomplete(PROFILE_INCOMPLETE_DETAIL);
    row.visible = true;
    return {};
  }

  hideProfile({ user }: { user: User }): Record<string, never> {
    const row = this.#byOwner.get(user);
    if (row === undefined || !row.visible) throw new ProfileNotVisible(PROFILE_NOT_VISIBLE_DETAIL);
    row.visible = false;
    return {};
  }

  _getProfile({ user }: { user: User }): GetProfileRow[] {
    const row = this.#byOwner.get(user);
    if (row === undefined) return [];
    const { owner: _owner, ...rest } = row;
    const result: GetProfileRow = {
      ...rest,
      skills: [...row.skills],
      interests: [...row.interests],
    };
    if (row.startupPitch === undefined) delete result.startupPitch;
    return [result];
  }

  _getVisibleProfiles(): Array<{ profile: Profile; owner: User }> {
    return this.#profiles
      .filter((row) => row.visible)
      .map((row) => ({ profile: row.profile, owner: row.owner }));
  }

  _recommendationData({ user }: { user: User }): RecommendationDataRow[] {
    const row = this.#byOwner.get(user);
    if (row === undefined) return [];
    return [
      {
        role: row.role,
        visible: row.visible,
        skills: [...row.skills],
        interests: [...row.interests],
        university: row.university,
        latitude: row.latitude,
        longitude: row.longitude,
        availability: row.availability,
      },
    ];
  }

  _visibleCandidates({ user }: { user: User }): CandidateRow[] {
    const own = this.#byOwner.get(user);
    if (own === undefined) return [];
    return this.#profiles
      .filter((row) => row.visible && row.role !== own.role)
      .map((row) => ({
        candidate: row.owner,
        skills: [...row.skills],
        interests: [...row.interests],
        university: row.university,
        latitude: row.latitude,
        longitude: row.longitude,
        availability: row.availability,
      }));
  }
}

**src/concepts/Recommending.ts**

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

  constructor({ preferences = [], recommendations = [] }: RecommendingInitialState = {}) {
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
    return { score: value };
  }

  seeLater({ viewer, candidate }: { viewer: User; candidate: User }): Record<string, never> {
    const row = this.#byPair.get(pairKey(viewer, candidate));
    if (row === undefined || !row.eligible || row.status !== "AVAILABLE") {
      throw new NotInFeed(NOT_IN_FEED_DETAIL);
    }
    row.status = "SEE_LATER";
    return {};
  }

  markPassed({ viewer, candidate }: { viewer: User; candidate: User }): Record<string, never> {
    const row = this.#byPair.get(pairKey(viewer, candidate));
    if (row === undefined) throw new PassRecommendationNotFound(PASS_RECOMMENDATION_NOT_FOUND_DETAIL);
    row.status = "PASSED";
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
    return {};
  }

  startNewSession({ viewer }: { viewer: User }): Record<string, never> {
    for (const row of this.#recommendations) {
      if (row.viewer === viewer && row.status === "SEE_LATER") row.status = "AVAILABLE";
    }
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
    return {};
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

## Existing wiring and configuration

**src/compositions/Matching.ts**

import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { compute, each, former, is, no, now, where } from "@mit-sdg/sync-engine/language";
import { applicationConceptSet, concepts } from "../concepts.ts";

const { MutualMatching, Notifying, Sessioning } = concepts;
const { matchesLink, profileLink } = applicationConceptSet.computations;

const MATCH_MESSAGE = "It's a match!";
const INTEREST_MESSAGE = "Someone is interested in you!";

const ShowInterest = endpoint(
  "/matching/show-interest",
  ({ session, other, user, time, matched, userLink, otherLink, profile }) =>
    receive({ session, other })
      .then(
        where(now(time)).then(
          Sessioning.current({ session, now: time }).responds({ subject: user }),
        ),
      )
      .then(MutualMatching.showInterest({ from: user, to: other }).responds({ matched }))
      .then(
        // Reaction 8, first notification: the session user learns of the match.
        where(is.among(matched, [true]), compute(matchesLink, { user }, userLink))
          .then(
            Notifying.notify({
              recipient: user,
              message: MATCH_MESSAGE,
              link: userLink,
              createdAt: time,
            }).responds({}),
          )
          .named("match-notifies-session-user"),
        // Reaction 6: interest without a match notifies the other person unless they passed.
        where(
          is.among(matched, [false]),
          no(MutualMatching._decision({ from: other, to: user }).is({ status: "PASSED" })),
          compute(profileLink, { user }, profile),
        )
          .then(
            Notifying.notify({
              recipient: other,
              message: INTEREST_MESSAGE,
              link: profile,
              createdAt: time,
            }).responds({}),
          )
          .then(respond({ matched }))
          .named("interest-notifies-other"),
        where(
          is.among(matched, [false]),
          MutualMatching._decision({ from: other, to: user }).is({ status: "PASSED" }),
        )
          .then(respond({ matched }))
          .named("interest-after-pass"),
      )
      // Reaction 8, second notification: the other person learns of the match.
      .then(
        where(
          is.among(matched, [true]),
          compute(matchesLink, { user: other }, otherLink),
        ).then(
          Notifying.notify({
            recipient: other,
            message: MATCH_MESSAGE,
            link: otherLink,
            createdAt: time,
          }).responds({}),
        ),
      )
      .then(respond({ matched })),
  { input: { required: ["other"], defaults: { session: "" } } },
);

const Pass = endpoint(
  "/matching/pass",
  ({ session, other, user, time }) =>
    receive({ session, other })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        where(MutualMatching._decision({ from: other, to: user }).is({ status: "INTERESTED" }))
          .then(MutualMatching.pass({ from: user, to: other }).responds({}))
          .then(respond({ passed: true }))
          .named("incoming-interest"),
        where(no(MutualMatching._decision({ from: other, to: user }).is({ status: "INTERESTED" })))
          .then(respond({ error: "NO_INCOMING_INTEREST" }))
          .named("no-incoming-interest"),
      ),
  { input: { required: ["other"], defaults: { session: "" } } },
);

const Unmatch = endpoint(
  "/matching/unmatch",
  ({ session, other, user, time }) =>
    receive({ session, other })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(MutualMatching.unmatch({ user, other }).responds({}))
      .then(respond({ unmatched: true })),
  { input: { required: ["other"], defaults: { session: "" } } },
);

const InterestedInYouRows = former("the users interested in (user)", ({ user }, { from }) =>
  each(MutualMatching._getInterestedInYou({ user }).is({ from })).form({ user: from }),
);

const MatchRows = former("the matches of (user)", ({ user }, { other }) =>
  each(MutualMatching._getMatches({ user }).is({ other })).form({ user: other }),
);

const InterestedInYou = endpoint(
  "/matching/interested-in-you",
  ({ session, user, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        respond({ interested: InterestedInYouRows({ user }) }),
      ),
  { input: { defaults: { session: "" } } },
);

const Matches = endpoint(
  "/matching/matches",
  ({ session, user, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        respond({ matches: MatchRows({ user }) }),
      ),
  { input: { defaults: { session: "" } } },
);

export const composition = {
  Requests: { ShowInterest, Pass, Unmatch },
  Reads: { InterestedInYou, Matches },
};

**src/concepts.ts**

import { conceptSet, registerConcept } from "@mit-sdg/sync-engine/assembly";
import authenticatingSpec from "@design/concepts/Authenticating.md" with { type: "text" };
import mutualMatchingSpec from "@design/concepts/MutualMatching.md" with { type: "text" };
import notifyingSpec from "@design/concepts/Notifying.md" with { type: "text" };
import sessioningSpec from "@design/concepts/Sessioning.md" with { type: "text" };
import { AuthenticatingMemoryConcept } from "./concepts/catalog/authenticating/authenticating.memory.ts";
import {
  InvalidCredentials,
  InvalidUsername,
  UsernameTaken,
  WeakPassword,
} from "./concepts/catalog/authenticating/authenticating.shared.ts";
import { SessioningMemoryConcept } from "./concepts/catalog/sessioning/sessioning.memory.ts";
import {
  InvalidSessionLifetime,
  UnknownSession,
} from "./concepts/catalog/sessioning/sessioning.shared.ts";
import {
  InterestAlreadyDecided,
  InterestAlreadyMatched,
  InterestInSelf,
  MutualMatchingConcept,
  NotMatched,
  PassAfterInterest,
  PassAlreadyMatched,
  PassOnSelf,
} from "./concepts/MutualMatching.ts";
import {
  DismissTargetNotFound,
  EmptyMessage,
  NotifyingConcept,
  ReadTargetDismissed,
  ReadTargetNotFound,
} from "./concepts/Notifying.ts";

const authenticating = registerConcept({
  class: AuthenticatingMemoryConcept,
  spec: authenticatingSpec,
  refusals: {
    INVALID_USERNAME: InvalidUsername,
    WEAK_PASSWORD: WeakPassword,
    USERNAME_TAKEN: UsernameTaken,
    INVALID_CREDENTIALS: InvalidCredentials,
  },
});

const sessioning = registerConcept({
  class: SessioningMemoryConcept,
  spec: sessioningSpec,
  refusals: {
    INVALID_SESSION_LIFETIME: InvalidSessionLifetime,
    UNKNOWN_SESSION: UnknownSession,
  },
});

const mutualMatching = registerConcept({
  class: MutualMatchingConcept,
  spec: mutualMatchingSpec,
  refusals: {
    INTEREST_IN_SELF: InterestInSelf,
    INTEREST_ALREADY_MATCHED: InterestAlreadyMatched,
    INTEREST_ALREADY_DECIDED: InterestAlreadyDecided,
    PASS_ON_SELF: PassOnSelf,
    PASS_ALREADY_MATCHED: PassAlreadyMatched,
    PASS_AFTER_INTEREST: PassAfterInterest,
    NOT_MATCHED: NotMatched,
  },
});

const notifying = registerConcept({
  class: NotifyingConcept,
  spec: notifyingSpec,
  refusals: {
    EMPTY_MESSAGE: EmptyMessage,
    READ_TARGET_NOT_FOUND: ReadTargetNotFound,
    READ_TARGET_DISMISSED: ReadTargetDismissed,
    DISMISS_TARGET_NOT_FOUND: DismissTargetNotFound,
  },
});

/** Computations declared by the approved design documents. */
const computations = {
  // Registered so the authored `currentInstant` declaration resolves. Compositions bind the
  // flow's instant with the framework's `now(...)`, which is read once per flow; no flow
  // invokes this function.
  currentInstant: (_input: Record<string, never>): Date => new Date(),
  sessionLifetime: (_input: Record<string, never>): number => 1_800_000,
  profileLink: ({ user }: { user: string }): string => `/profile/${user}`,
  matchesLink: (_input: { user: string }): string => "/matches",
};

export const applicationConceptSet = conceptSet(
  {
    Authenticating: authenticating,
    Sessioning: sessioning,
    MutualMatching: mutualMatching,
    Notifying: notifying,
  },
  computations,
);
export const { concepts } = applicationConceptSet;

## Additional public framework references

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/api/application-example.md**

# Worked application composition

This example shows documented realization patterns, not required design prose. Approved
design fixes behavioral commitments and declaration links; source chooses stages,
bindings, and disjoint branches that preserve them.

## Endpoint-owned sequencing

An endpoint-linked reaction may perform every action required before its visible success.
Values returned by one action travel to the next stage through `.responds(...)` bindings:

```ts
const PublishPost = endpoint(
  "/board/post",
  ({ session, username, content, post }) =>
    receive({ session, content })
      .then(Sessioning.current({ session }).responds({ subject: username }))
      .then(Posting.publish({ author: username, content }).responds({ post }))
      .then(respond({ post })),
  {
    input: { required: ["session", "content"] },
    validators: { input: sessionContentInput, output: postOutput },
  },
);
```

Do not split a required consequence into a second reaction merely because the behavior
has several steps. If success must acknowledge all required effects, perform those effects
before `respond(...)` unless approved failure semantics explicitly say otherwise.

## Guarded success and total fallback

Sibling branches are alternatives. Give them disjoint conditions and ensure every
admitted request has an answer. A state-dependent success branch may call one action and
then respond; its sibling may return an application error directly:

```ts
const AddComment = endpoint(
  "/board/comment",
  ({ session, username, target, content, comment }) =>
    receive({ session, target, content })
      .then(Sessioning.current({ session }).responds({ subject: username }))
      .then(
        where(Posting._get({ post: target }))
          .then(Commenting.add({ target, author: username, content }).responds({ comment }))
          .then(respond({ comment }))
          .named("post-exists"),
        where(no(Posting._get({ post: target })))
          .then(respond({ error: "POST_NOT_FOUND" }))
          .named("post-missing"),
      ),
  {
    input: { required: ["session", "target", "content"] },
    validators: { input: sessionCommentInput, output: commentOutput },
  },
);
```

`MISSING_ENDPOINT_FALLBACK` means analysis could not establish an answer for every admitted
request. Add a disjoint answer when approved behavior requires one; do not silence the
advisory with an unconditional branch that overlaps a guarded success. When the branches
are intentionally total but conservative analysis still reports the advisory, boundary
evidence—not warning elimination—decides the behavior.

## Computed optional-input branches

A computation is a condition line inside `where(...)`, not an action passed to `.then(...)`.
`reminderSet` comes from `conceptSet(...)`; its second argument is exposed as
`reminderSet.computations`. Use `is.among(flag, [true])` and `is.among(flag, [false])` for
disjoint boolean branches. A computation with no inputs receives `{}`:

```ts
const reminderSet = conceptSet(
  {},
  {
    hasDeadline: ({ dueAt }: { dueAt: string | null }) => dueAt !== null,
    defaultPriority: (_input: Record<string, never>) => "normal",
  },
);

export const CreateReminder = endpoint(
  "/reminders",
  ({ dueAt, hasDeadline, priority }) =>
    receive({ dueAt }).then(
      where(
        compute(reminderSet.computations.hasDeadline, { dueAt }, hasDeadline),
        is.among(hasDeadline, [true]),
      )
        .then(respond({ mode: "scheduled" }))
        .named("with-deadline"),
      where(
        compute(reminderSet.computations.hasDeadline, { dueAt }, hasDeadline),
        is.among(hasDeadline, [false]),
        compute(reminderSet.computations.defaultPriority, {}, priority),
      )
        .then(respond({ mode: "open", priority }))
        .named("without-deadline"),
    ),
  { input: { defaults: { dueAt: null } } },
);
```

The endpoint contract supplies `null` when the optional field is absent; one
`receive(...)` handles both branches.

## Intentionally separate reaction

Use a separate reaction only when approved design selects a distinct internal reaction
link. Trigger it from a real concept action or outcome whose bindings supply the
consequence:

```ts
const SelectedReadingOpensDiscussion = reaction(({ selection }) =>
  // An empty input pattern ({}) matches any choose regardless of scope or item.
  when(Selecting.choose({}).responds({ selection })).then(Discussing.open({ subject: selection })),
);
```

Do not target an endpoint path or declaration name through `returned(..., { by })` unless
a supplied public contract explicitly defines that occurrence. Do not duplicate the
reaction's consequence inside its triggering endpoint.

## Linked placement and assembly

Place declarations under the exact groups named by accepted links, then register that
group record under its module:

```ts
export const boardComposition = {
  BoardPublishing: { PublishPost },
  BoardComments: { AddComment },
};

export const circleComposition = {
  ReadingDiscussion: { SelectedReadingOpensDiscussion },
};

assemble({
  conceptSet: applicationConceptSet,
  instances: applicationConceptSet.implementations(),
  composition: { Board: boardComposition, Circle: circleComposition },
});
```

Use the project's generation, application check, typecheck, and black-box boundary tests
as the repair loop. Public generated wire declarations may be read as caller contracts.
If documented constructions cannot preserve an approved behavioral commitment, report the
blocker instead of discovering alternate API shapes by runtime reflection.

## Exact starting paths

**.sync-engine/work/recommending/inputs/app-starting-paths.md**

- src/compositions/Matching.ts (style reference)
- src/concepts.ts, src/composition.ts, src/assembly.ts, generated.config.ts (edit)
- src/compositions/Profiles.ts, src/compositions/Recommendations.ts (new)
- src/recommendations.integration.test.ts (new); src/integration.test.ts (helper reference)

# Result

Unless the task requests another format, return these headings in order. Omit progress narration.

- `## Status` — required. First line is exactly `Complete` or `Blocked`; explanation goes below.
- `## Changed` — required. Paths changed, or none.
- `## Checks` — required. Exact command and pass/fail outcome.
- `## Blockers` — required. Categorize as design, context, or environment.
- `## Concerns` — optional. Material non-blocking uncertainty only.

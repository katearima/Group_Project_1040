# Role and objective

Work unit `recommending`; role `designer`; phase `contracts`.

# Contract designer

Author the complete affected concept and application contract set needed by the work item. A supplied decomposition fixes boundaries, placement, and obligation IDs; otherwise use the brief and approved contracts. Preserve unaffected and catalog-unchanged surfaces.

Apply the supplied authored-format, SSF, boundary, and contract guidance exactly. Put mechanism state and invariants in concept contracts. Author application contracts for every required endpoint, link, and cross-concept behavior; include selected executable identities, cross-concept policy, acknowledgement order, and recovery. Cover action success, refusal state, repetition, lifecycle, query cardinality/order, authorization, and every affected obligation.

Edit design only. Run `bunx --no-install sync-engine check-design <changed files>` and repair its diagnostics before returning. Do not run generation or the full project check: source agreement cannot pass until implementation exists, and it is not contract syntax. Ask one focused question for a missing product choice; report a blocker when required behavior would change accepted boundaries or obligations.

# Access

Root: "/Users/fidan10/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `work-unit:brief.md` ("/Users/fidan10/Group_Project_1040/.sync-engine/work/recommending/brief.md"), `design:compositions/Accounts.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Accounts.md"), `design:compositions/Matching.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Matching.md"), `design:compositions/Notifications.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Notifications.md").
- Write: `assigned-design:compositions/Profiles.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Profiles.md"), `assigned-design:compositions/Recommendations.md` ("/Users/fidan10/Group_Project_1040/design/compositions/Recommendations.md"), `assigned-design:concepts/ProfileSetting.md` ("/Users/fidan10/Group_Project_1040/design/concepts/ProfileSetting.md"), `assigned-design:concepts/Recommending.md` ("/Users/fidan10/Group_Project_1040/design/concepts/Recommending.md"), `assigned-design:types.md` ("/Users/fidan10/Group_Project_1040/design/types.md").
- Tools: `repository-read`, `repository-write`.
- Shell: `project-validation`; network: no; generated output: no; long-running processes: no.

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

# Authored formats

Write each concept to `design/concepts/<Gerund>.md`, each application composition to `design/compositions/<Name>.md`, and application-owned concrete types to `design/types.md`. These are the only authored-design locations; decomposition remains the work-unit `decomposition.md`.

Each concept has one gerund identifier H1 naming its mechanism and these H2s, in order;
no other headings or fences:

````text
# Tasking

## Purpose
Unfenced prose.

## Principle
Unfenced prose.

## Types
```types
external Owner
  Optional explanation.
```

## State
```state
<SSF declarations>
```

## Actions
```actions
create (owner: Owner, title: String, dueAt?: DateTime) : returns (item: Item)
  where title is invalid
  then
    refuses INVALID_TITLE "A valid title is required."
  where title is valid
  then
    create the item
    returns item

delete (item: Item) : returns ()
  where true
  then
    delete the item
    returns
```

## Queries
```queries
_items (owner: Owner) : many (item: Item, title: String)
  answers the owner's items with their titles
  answers no rows when the owner has none
  orders rows by Item identity
```
````

A concept's Types section contains `external Name`, `opaque Name`, and
`Name is VALUE or VALUE` declarations, or is empty. State uses supplied SSF; keep every
State line inside its fence and prefix every invariant prose line with exact `Rule:`.
Actions use `name: Type`, optional `name?: Type`, `: returns`, parenthesized named results,
and one or more `where`/`then` branches. Indent `where` and `then` equally and each branch
body deeper. Terminal success `returns` exactly the declared names. Declare an empty result
`: returns ()` and end its branches with bare `returns`. Refuse with
`refuses CODE "Normative sentence."`; keep codes unique within an action and never shared
across actions. A returned name is a declared parameter, the row the branch created or
changed, or a value an earlier line in that branch binds, as in
`count the Tallies with subject as total`. Order an action's branches with its refusals
first and its terminal success last, and give each branch a condition the others cannot
also match.

Actions start with a letter; queries start `_` and use `one`, `optional`, or `many`
before the named row. Mark optional State values in the row `field?: Type`. A `one` body
always promises one row; only `optional` may say no row. Write a query body as one line
per fact: what it answers, then the empty or unknown case, then—for `many` alone—its
stable ordering.

```types
concrete Person
  Stable application identity.
```

```instances
instantiate Tasking with
  Owner is Person
instantiate Noting as Notes with
  Task is Tasking.Task
```

Bare `instantiate D` means `instantiate D as D`, for a definition with no external to
bind. Bind every external inline on its own instance, as above.

Concept files carry no application links, endpoint entries, instances, bindings, or
computations.

## Application files

Inventory exact selected static instances in `design/types.md`, whose `concrete`
declarations are application-owned; never declare core-owned `RequestBoundary`. A
definition may have zero or more instances, none carrying its name. Write an alias only as
`alias Alias for Target`, and leave no concrete unused; config checking rejects the rest.
Bindings convey identity only.

Put exact `reaction:`, `view:`, `former:`, and `computation:` links beside prose, never
wildcards. Every selected endpoint is a reaction declaration and therefore needs its own
`reaction:` link, in addition to links for internal reaction trees. It also needs exactly
one boundary declaration in an `endpoints` fence. Cover every selected endpoint, internal
reaction, named view, and former; declare each executable computation once. A composition
document reads as prose carrying its links and endpoint declarations:

````text
Submitting a response [enters the application](reaction:Circle.Reading.AddResponse).

```endpoints
Circle.Reading.AddResponse at /circle/respond
```

Choosing a reading [opens a discussion](reaction:Circle.Reading.SelectedOpensDiscussion)
about it. A circle page shows the circle, its members and that discussion
[as one record](former:Circle.Pages.CirclePage), and only a member
[may respond](view:Circle.Reading.MemberMayRespond).
````

Give each composition document a nonempty H1 and decision prose. An `endpoints` fence
contains declarations only, one per line in exact `Declaration.Identity at /path` form.
The identity is the same module, group, and declaration selected by the endpoint's
`reaction:` link. The portable absolute path is the exact path implementation passes to
`endpoint(...)`. Different endpoint identities may share a path only when they are
intentional alternatives.

Declare each computation once as `name(inputs) : Result`, no space before its inputs, with
an indented body where it is used, or in `design/types.md` when shared, and reference it as
`[normalization](computation:normalizeTitle)`. Its result is one bare type; a list or record
read from concept state is not a computation result:

```computations
normalizeTitle(raw: String) : String
  Produces the canonical task title used by endpoint adaptation.
```

The endpoint entry fixes the executable endpoint pathname; its `reaction:` link separately
fixes trace identity. Neither prescribes trigger syntax, stage structure, or variable
flow. If either declaration is absent, implementation must not create that endpoint. Do
not add an internal reaction link for a consequence the endpoint-linked declaration may
perform unless separate deferred behavior is an intentional design decision.

An application document does not duplicate endpoint input, return, or refusal listings:
the concept specifications and composition prose own that behavior, and a second copy
drifts from the contracts the checker reads. Transport methods, status codes, headers, and
external route projections remain outside the `endpoints` fence.

`check-design` proves grammar and authored form only. Config checking proves shapes,
bindings, links, endpoint identity/path agreement, computations, and source agreement. Neither proves boundaries, prose truth,
persistence, transactions, authorization, repair, or behavior; review and test.

---

# Simple State Form (SSF)

```text
document := (setDecl|subsetDecl|aliasDecl|ruleLine)*
setDecl := (a|an) [(set|seq) [of]] Type [with] declarationBody?
subsetDecl := (a|an) [set [of]] Qualifier+ Type [condition] [with] declarationBody?
condition := where fieldName is VALUE (or VALUE)*
declarationBody := (INDENT (field|uniqueLine|ruleLine))+
aliasDecl := alias Alias for Type
field := [a|an] modifier* [fieldName] (named|collection)
modifier := optional|unique
uniqueLine := unique fieldName (and fieldName)*
named := Qualifier* Type|Parameter|Local|primitive
collection := (set|seq) [of] named
primitive := Number|String|Flag|Date|DateTime
ruleLine := Rule: TEXT

typesLine := (external Name|opaque Name|Name is VALUE (or VALUE)+) [INDENT TEXT]
```

Start Type, Qualifier, Alias, Parameter, and Local uppercase ASCII and fieldName
lowercase; continue each with ASCII letters, digits, or `_`. Start VALUE uppercase and
continue with uppercase ASCII letters, digits, or `_` only. A field without a fieldName
is named for its type's words joined, with a lowercase first letter: `an Author` is
`author`, `a set of Tags` is `tags`, `a Verified User` is `verifiedUser`. Write names
when two fields share a type, and prefer a role name (`a sponsor Verified User`) when
the role matters.

Declare every type in the Types fence: `external Name` for an application-supplied
parameter, `Name is A or B` for an enumeration, `opaque Name` when the representation is
deliberately the implementer's. A name that is none of these, nor owned, nor primitive, nor
(in a State field) a declared subset, fails
with `SSF_UNDECLARED_TYPE`, in a State field or anywhere in an action or query signature,
including inside a type argument or union. Owned, external, concept-local, and primitive
names are one namespace. Never name a type for a primitive—write the primitive on the
field and state what narrows it where it is enforced.

Make every nonblank line parse or start with `Rule:`. Put a `Rule:` line at top level or
indented under a declaration; SSF keeps its TEXT verbatim and proves nothing. A top-level
rule ends the preceding declaration body. End a first line with `with` only when a field
or `unique` line follows, and always then; a `Rule:` line attaches without `with`.

A plain top-level set contains every individual of its type in the concept's state, and
each has its fields: with `a set of Users with a reputation Number`, every User any field
refers to is in `Users` and has a reputation. That holds whether the concept owns User or
takes it as `external User`; a set named for an external type's plural holds its
individuals and introduces no identity. Write the plural—`a set of User` collides with
the external name. The actions carry the obligation: storing a User makes it a member
with its fields, and removing a member removes or refuses every reference to it. Taking a
member out of a subset likewise removes or refuses every field of that subset's type that
holds it; type the field by the parent when it should outlive membership.

Declare a subset by qualifying its parent: `a set of Verified Users`, `a set of Trusted
Verified Users`, `a Root Folder`. One capitalized type word is a top-level set, sequence,
or singleton; more are a subset of the set the remaining words name, which must be declared unless it is an external type's plural (`a set of Read Posts` beside `external
Post` needs no `a set of Posts`). The name is the whole phrase, `Verified Users` or `Verified User`, never the
qualifier alone. Use a qualified subset instead of a plain set, or instead of `optional`
fields, when only some individuals carry fields. A qualifier may qualify different sets
(`Pending Invitations`, `Pending Users`) but appears once among one set's subsets. Use a
subset as a State field type (`a sponsor Verified User`); in action and query signatures
take the parent type and state membership in a condition, such as `where sponsor is in
Verified Users`. Name the set for membership in any condition: `user is in Users`, not
`user exists`. Never write `a Verified set of Users` or `a verified set of Users`.

SSF accepts automatic singular/plural aliases for owned sets and sequences, and for
external types, when an authored State field, subset line, or action/query signature
supplies one unambiguous matching name; a subset phrase joins through its last word.
Declare an explicit `alias` for a synonym or an ambiguous singular/plural relationship of
an owned set; the explicit declaration takes precedence. An external type cannot be an
alias target, so when a spelling pairs with several external types, write the exact
external name or rename one of them.

An alias targets one unique owned top-level declaration: a set, sequence, or singleton. It
cannot target another alias, a subset, an external or a set of one, an opaque or enum type,
a primitive, a duplicate, or an unresolved name. Automatic singular/plural joins never
reach singletons; only an explicit alias names one. Alias collisions and chains, ambiguous automatic
relationships, duplicate subsets, repeated qualifiers, and undeclared parents are
rejected.

Structures, aliases, externals, local types, and primitives share one type universe, and
a subset's joined identifier (`VerifiedUsers`, `VerifiedUser`) may not collide with it. A
field cannot be named `optional`, `unique`, `set`, or `seq`. Keep fieldNames unique per
declaration and VALUEs per enum. Every State type must resolve to an owned, external,
subset, local, or primitive type, and every signature type to one that is not a subset.

Mark a field `unique` when its values must be unique among members of that declaration; a
unique collection field compares the whole collection. A `unique` line names the fields of
one constraint; the modifier is shorthand for a line naming that field alone, so use the
line where the field is inherited rather than declared. Order does not distinguish a
combination; a declaration may carry several. A subset's constraints bind only its own
members and may name ancestor fields. Condition a subset on a field whose type is a
declared enumeration to state which members it classifies. Write each modifier
at most once, in either order, between any article and the fieldName; `a` and `an` both
read. Case separates the forms: `unique Email` is a unique field named `email`, and
`unique email` a constraint line; `a Verified User` holds a Verified User, while `a
verified User` is a field named `verified` holding any User. Collections are never `optional` (empty means absent)
or nested; named-type unions are invalid. Owned sets and sequences introduce
identities—never add ID fields. Subsets add no identity; they classify parent members,
may overlap, and add relations. `a Type` or `an Type` has one member. Either article is
accepted; indentation distinguishes a declaration from an implicitly named field.
Which side declares a relation implies no storage, navigation, or ownership.

```state
a set of Items with
  a unique title String
  an item Item
  an optional owner Person
  a watchers set of Person
  an updates seq of Update
  a Status

a set of Votes with
  an Item
  a Voter
  unique item and voter

a set of Completed Items where status is DONE with
  a completedAt DateTime

a set of Reviews with
  a Completed Item
  a reviewer Person

a set of Muted People

a Settings with
  a retentionDays Number

alias WorkItem for Items

Rule: an Item's owner must be active
```

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

## Task

**.sync-engine/work/recommending/inputs/design-task.md**

# Contract design: ProfileSetting, Recommending, Profiles and Recommendations compositions

Objective: author the authored contracts for this work item from the brief and the team's
accepted prose design (context excerpt: ProfileSetting §1, Recommending §2, Reactions 1–2).
The prose design is the product authority; the brief fixes scope and active decisions
(availability field, deferred hide/Reaction 3/4/5/10, best-effort refresh fan-out).

Write exactly these canonical design files:

- `design/concepts/ProfileSetting.md` — prose ProfileSetting plus `availability`. Keep its
  actions and the two named queries; add only narrow reads the compositions need (a user's
  recommendation data and role/visibility; visible users with the opposite role, stable order).
  Stable refusal codes for every precondition.
- `design/concepts/Recommending.md` — prose Recommending. The five-factor score is part of
  `refreshRecommendation`'s contract and must be stated exactly (normalization, empty-set
  rules, great-circle distance on a 6371 km sphere, zero preferred distance). Add a narrow
  pair read (status, eligible) for later guards. Stable refusal codes.
- `design/types.md` — add ProfileSetting and Recommending instances with
  `User is Authenticating.Account`; keep existing content.
- `design/compositions/Profiles.md` — create, update, set pitch, publish, read own profile
  endpoints; Reaction 1 (publish) and Reaction 2 (update, set pitch). State explicitly whether
  each refresh fan-out is a consequence of the endpoint reaction or an internal reaction, the
  ordering relative to the response, and the best-effort partial-failure behavior.
- `design/compositions/Recommendations.md` — set preferences (requires a profile; Reaction 2
  when visible), read own preferences, read own feed. List deferred integrations.

Existing `design/compositions/Matching.md`, `Accounts.md` and `Notifications.md` are read-only
patterns for style (session guard first, `UNKNOWN_SESSION`, endpoints fences, deferred list).

Acceptance: `bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md`
passes. Every refusal has a code and message; every endpoint names its path in an
`endpoints` fence under `/profiles/...` or `/recommendations/...`.

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

- `## Status` — required. First line is exactly `Complete` or `Blocked`; explanation goes below.
- `## Changed` — required. Paths changed, or none.
- `## Questions` — required. Material questions, or none.
- `## Checks` — optional. Command and outcome when applicable.

# Role and objective

Work unit `matching-notifying`; role `designer`; phase `contracts`.

# Contract designer

Author the complete affected concept and application contract set needed by the work item. A supplied decomposition fixes boundaries, placement, and obligation IDs; otherwise use the brief and approved contracts. Preserve unaffected and catalog-unchanged surfaces.

Apply the supplied authored-format, SSF, boundary, and contract guidance exactly. Put mechanism state and invariants in concept contracts. Author application contracts for every required endpoint, link, and cross-concept behavior; include selected executable identities, cross-concept policy, acknowledgement order, and recovery. Cover action success, refusal state, repetition, lifecycle, query cardinality/order, authorization, and every affected obligation.

Edit design only. Run `bunx --no-install sync-engine check-design <changed files>` and repair its diagnostics before returning. Do not run generation or the full project check: source agreement cannot pass until implementation exists, and it is not contract syntax. Ask one focused question for a missing product choice; report a blocker when required behavior would change accepted boundaries or obligations.

# Access

Root: "/Users/katearima/Documents/6.104/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `work-unit:brief.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/.sync-engine/work/matching-notifying/brief.md").
- Write: `assigned-design:compositions/Accounts.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Accounts.md"), `assigned-design:compositions/Matching.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Matching.md"), `assigned-design:compositions/Notifications.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Notifications.md"), `assigned-design:concepts/Authenticating.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/Authenticating.md"), `assigned-design:concepts/MutualMatching.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/MutualMatching.md"), `assigned-design:concepts/Notifying.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/Notifying.md"), `assigned-design:concepts/Sessioning.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/Sessioning.md"), `assigned-design:types.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/types.md").
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

**.sync-engine/work/matching-notifying/inputs/design-task.md**

# Contract design: MutualMatching, Notifying, accounts, matching composition

Objective: author the complete authored contract set for this work item from the brief and
the team's accepted prose concept design (supplied as context excerpt). The prose design is
the product authority for MutualMatching and Notifying behavior; the brief fixes scope and
active decisions (deferred ProfileSetting/Recommending/Chatting clauses, session identity,
generic interest message, link formats).

Write exactly these canonical design files:

- `design/concepts/MutualMatching.md` — gerund concept for the prose MutualMatching.
  Keep its actions and the two named queries; add only narrow read queries the
  composition needs to guard requests (for example a pair's decision status or whether a
  pair is matched). Give every precondition a stable refusal code.
- `design/concepts/Notifying.md` — gerund concept for the prose Notifying, with
  `createdAt` (or `now`) as an explicit `notify` input. Ownership failures for
  `markAsRead`/`dismissNotification` must not reveal whether another user's notification
  exists.
- `design/concepts/Authenticating.md` and `design/concepts/Sessioning.md` — copy the
  supplied catalog contracts unchanged.
- `design/types.md` — application concrete types and the `instances` inventory
  (bind MutualMatching's and Notifying's User and Sessioning's Subject to the
  authenticated account identity, following the message-board recipe pattern).
- `design/compositions/Accounts.md` — register, sign in (both start a 30-minute session
  using the flow's instant), sign out.
- `design/compositions/Matching.md` — show interest, pass, unmatch, interested-in-you,
  matches endpoints; Reaction 6 and Reaction 8 as internal reactions (or as consequences of
  the show-interest endpoint, your choice, stated explicitly); `profileLink` and
  `matchesLink` computations.
- `design/compositions/Notifications.md` (or fold into Matching.md) — list, list unread,
  mark as read, dismiss endpoints.

Every endpoint resolves the session to the user through Sessioning; callers never supply
their own identity. State acknowledgement order and what happens when a follow-on
notification fails after the matching action succeeded. Record the deferred clauses
(ProfileSetting guard and name, Reactions 4, 5, 7, 9, 10) in composition prose as
explicitly not realized in this change, with no links for them.

Acceptance: every brief requirement maps to a contract clause; endpoint paths are declared
once each in `endpoints` fences; `bunx --no-install sync-engine check-design
design/concepts/*.md design/types.md design/compositions/*.md` passes. Report the command
output under Checks. Ask one focused question only for a missing product choice the brief
and prose do not settle.

## Brief

**.sync-engine/work/matching-notifying/brief.md**

# MutualMatching and Notifying with Show Interest and Match/Unmatch

## Goal

Signed-in users can show interest in each other, see who is interested in them, become a
match when interest is mutual, unmatch, and receive and manage in-app notifications about
new interest and new matches. Source of truth for product behavior:
`documentation/concept-design.md` sections 3 (MutualMatching), 4 (Notifying) and 6
(Reactions).

## Scope

Included:

- Concept `MutualMatching [User]` exactly as designed: Decisions (INTERESTED/PASSED,
  unique from→to), Matches (unordered pair), actions `showInterest`, `pass`, `unmatch`,
  queries `_getInterestedInYou`, `_getMatches`, plus whatever narrow read queries the
  composition needs to guard requests.
- Concept `Notifying [User]` exactly as designed: notifications with recipient, message,
  link, createdAt, status UNREAD/READ/DISMISSED; actions `notify`, `markAsRead`,
  `dismissNotification`; queries `_getNotifications`, `_getUnreadNotifications`, plus
  any narrow read query the composition needs to check ownership. `createdAt` is an action
  input bound by the composition, never a clock read inside the concept.
- Catalog concepts `Authenticating` and `Sessioning` (used unchanged) to establish the
  signed-in user. Accounts endpoints: register, sign in, sign out.
- Endpoints (each resolves the session to the user; the caller never supplies its own
  identity): show interest, pass, unmatch, list interested-in-you, list matches, list
  notifications, list unread notifications, mark notification as read, dismiss notification.
- Show Interest request reaction with its MutualMatching guards.
- Reaction 6 (notify recipient of new interest) and Reaction 8 (notify both of a match).
- Unmatch request reaction.
- Pure link computations for `profileLink(user)` and `matchesLink(user)`.

Excluded (owned by other teammates; record as deferred, do not link or implement):

- ProfileSetting guard on Show Interest (visible profiles with opposite roles) and the
  `fromName` lookup for Reaction 6.
- Reaction 4 (`Recommending.markInterested`), Reaction 5 (`Recommending.markPassed`), the
  Recommending branch of the Pass request guard, and the `Recommending.markPassed` half of
  Reaction 10.
- Reaction 7 (create conversation on match), Reaction 9 and the Chatting half of
  Reaction 10 (close conversation on unmatch).
- Database persistence (state is in memory for this change), frontend.

## Requirements

- Show interest: refused for oneself, for an already matched pair, or when the sender
  already decided about the target. Otherwise it records INTERESTED; if the target already
  showed interest in the sender, a match is created in the same action.
- When show interest does not create a match and the target has not passed on the sender,
  the target receives an UNREAD notification "Someone is interested in you!" linking to the
  sender's profile link.
- When show interest creates a match, both users receive an UNREAD "It's a match!"
  notification linking to their own matches link.
- Pass (request): allowed only when the other user has an INTERESTED decision about the
  session user. Refused for oneself, for a matched pair, or after the session user already
  showed interest. Repeating a pass is a no-op success. No notification is sent for a pass.
- Unmatch (request): requires an active match between the session user and the other user;
  removes the match and changes both decisions to PASSED, so the pair cannot match again.
- `_getInterestedInYou` excludes users the viewer has passed on or matched with.
- Mark as read: only own, not dismissed. Dismiss: only own. Dismissed notifications drop out
  of both lists. Lists are newest first. Dismissing never undoes the interest or match.
- A missing, ended, expired or invented session is refused, with no state change.
- Another user's notification cannot be read or changed. Refusals for "not yours" and
  "does not exist" must not let a caller learn whether another user's notification exists.

## Active decisions

- Scope limited to MutualMatching and Notifying (user choice); ProfileSetting,
  Recommending and Chatting clauses are deferred, not stubbed. Reaction 4 is therefore not
  wired in this change even though Show Interest is.
- Signed-in identity comes from catalog Authenticating + Sessioning (user choice). Sessions
  last 30 minutes using the flow's instant, as in the catalog message-board recipe.
- The interest notification text is "Someone is interested in you!" until ProfileSetting can
  supply the sender's name (assumption, avoids exposing usernames).
- Link formats: `profileLink(user)` = `/profile/<user>`, `matchesLink(user)` = `/matches`
  (assumption; frontend may refine).
- State is in memory only for this change; Mongo persistence is a follow-up.
- Framework stays on the team's pinned sync-engine 1.1.0 although the skill release is
  1.2.0 (user choice: continue with warning). `@mit-sdg/sync-engine-analysis` and
  `@mit-sdg/sync-engine-catalog` 1.1.0 were added as exact dev dependencies by bootstrap.
  `@mit-sdg/sync-engine-http` 1.1.0 was already a dependency and is used for the host.
- Product decomposition is taken from the team's accepted concept design
  (`documentation/concept-design.md`); no separate decomposition round. Contract design and
  independent contract review still run.
- Roles are delegated to separate Claude Code subagents with independent review (user
  choice).

## Done when

- Two registered, signed-in users A and B: A shows interest in B → B's interested-in-you
  lists A and B has one UNREAD interest notification linking to A's profile link.
  (integration test)
- B shows interest in A → both list each other in matches, both have an UNREAD
  "It's a match!" notification, and A no longer appears in B's interested-in-you.
  (integration test)
- Repeated show interest, self-interest, and missing/invalid session are refused with no
  state change. (concept and integration tests)
- B passes on an incoming interest → A disappears from B's interested-in-you and A gets no
  notification. (integration test)
- Unmatch removes the match, both decisions become PASSED, a later show interest between
  them is refused, and a non-participant cannot unmatch. (integration test)
- Mark as read and dismiss succeed only on the session user's own notifications; dismissed
  ones leave both lists; the interest/match is unaffected. (integration test)
- `bun run check`, `bun test`, and `sync-engine check-design` pass.

## Open questions

None.

## Activity

- Work item started (review required, execution delegated, release 1.1.0 with warning).

## Relevant unchanged catalog contracts

**.sync-engine/work/matching-notifying/inputs/catalog-authenticating.md**

# Authenticating

## Purpose

Establish a username from a password, so a username claim alone cannot act as proof of
identity and a compromised password can be replaced or removed.

## Principle

Ari registers username `ari` with a password. Another registration of `ari` is refused.
The wrong password cannot authenticate `ari`; the correct password can. Ari changes
the password using the old password, after which the old password fails and the new
one succeeds. Ari unregisters with the current password, and the username is no longer
registered.

## Types

```types
opaque Secret
  A password verifier; its representation is the implementer's choice.
```

## State

```state
a set of Accounts with
  a unique username String
  a salt String
  a passwordVerifier Secret
```

## Actions

```actions
register (username: String, password: String) : returns (account: Account)
  where username is not 3 to 32 ASCII letters, digits, underscores, or hyphens
  then
    refuses INVALID_USERNAME "A username must contain 3 to 32 letters, numbers, underscores, or hyphens."
  where password is shorter than 8 characters or longer than 128 characters
  then
    refuses WEAK_PASSWORD "A password must contain 8 to 128 characters."
  where username is already registered
  then
    refuses USERNAME_TAKEN "That username is already registered."
  where username and password are accepted
  then
    add a new Account with username, a fresh salt, and a verifier derived from password and that salt
    bind account to that Account
    returns account

authenticate (username: String, password: String) : returns (account: Account)
  where username is unknown or password does not verify
  then
    refuses INVALID_CREDENTIALS "The username or password is incorrect."
  where password verifies
  then
    bind account to the verified Account
    returns account

changePassword (username: String, currentPassword: String, newPassword: String) : returns (account: Account)
  where newPassword is shorter than 8 characters or longer than 128 characters
  then
    refuses WEAK_PASSWORD "A password must contain 8 to 128 characters."
  where username is unknown or currentPassword does not verify
  then
    refuses INVALID_CREDENTIALS "The username or password is incorrect."
  where currentPassword verifies and newPassword is accepted
  then
    replace the Account salt and verifier using newPassword and a fresh salt
    bind account to that Account
    returns account

unregister (username: String, password: String) : returns (account: Account)
  where username is unknown or password does not verify
  then
    refuses INVALID_CREDENTIALS "The username or password is incorrect."
  where password verifies
  then
    bind account to the verified Account
    delete that Account
    returns account
```

## Queries

```queries
_registered (username: String) : one (registered: Flag)
  answers true when an Account has the username
  answers false for an unknown username
```

**.sync-engine/work/matching-notifying/inputs/catalog-sessioning.md**

# Sessioning

## Purpose

Issue an opaque session for an external subject with a caller-chosen lifetime, so temporary
access ends without changing that subject's identity.

## Principle

At noon Ari starts session `v1` for subject `ari` with a 20-minute lifetime, so it expires
at 12:20. Asked at 12:10, `_active` answers `ari` and 12:20, and `current` answers `ari`.
Ari ends `v1` at 12:11, after which `current` refuses it. At 12:12 Ari starts `v2` with an
eight-minute lifetime; at 12:20 it is expired and is refused just like an invented session.

## Types

```types
external Subject
  The external identity represented by a session.
```

## State

```state
a set of Sessions with
  a subject Subject
  an expiresAt DateTime
```

## Actions

```actions
start (subject: Subject, lifetime: Number, now: DateTime) : returns (session: Session, expiresAt: DateTime)
  where lifetime is not a positive finite number of milliseconds
  then
    refuses INVALID_SESSION_LIFETIME "A session lifetime must be a positive number of milliseconds."
  where lifetime is a positive finite number of milliseconds
  then
    add a new opaque Session for subject with expiresAt lifetime milliseconds after now
    returns session, expiresAt

current (session: Session, now: DateTime) : returns (subject: Subject)
  where session is unknown or ended, or its expiresAt is at or before now
  then
    refuses UNKNOWN_SESSION "This session is not active."
  where session is known and its expiresAt is after now
  then
    bind subject to the Session's subject
    returns subject

end (session: Session, now: DateTime) : returns (ended: Flag)
  where session is unknown or ended, or its expiresAt is at or before now
  then
    refuses UNKNOWN_SESSION "This session is not active."
  where session is known and its expiresAt is after now
  then
    delete the Session
    set ended to true
    returns ended
```

## Queries

```queries
_active (session: Session, now: DateTime) : optional (subject: Subject, expiresAt: DateTime)
  answers the active Session's subject and expiresAt when expiresAt is after now
  answers no row for an unknown or ended Session, or when expiresAt is at or before now
```

## Additional directed context

**.sync-engine/work/matching-notifying/inputs/catalog-message-board.md**

# Message Board

A message board gives authenticated users sessions for publishing posts, commenting, and reading attributed content.

## Application types and instances

```instances
instantiate Authenticating

instantiate Sessioning with
  Subject is Authenticating.Username

instantiate Posting with
  Author is Authenticating.Username

instantiate Commenting with
  Target is Posting.Post
  Author is Authenticating.Username
```

## Compositions

### Accounts

A user may register, sign in, inspect the current account, change its password, sign out, or delete it. Registration and sign-in start a 30-minute session using the causal flow's instant; every later session check receives that same kind of composition-supplied instant. Registration can persist before session creation faults, after which the user can sign in. Deleting an account does not revoke separately owned sessions; they remain usable until ended or expired.

### BoardPublishing

An active session supplies the author for posts and comments, so callers cannot choose another author. A comment may target only an existing Post; a missing target returns `POST_NOT_FOUND` without adding a Comment. Comment retraction uses the same session-derived author.

### BoardPages

An active session may open the board and see posts with their attached comments.

## Views

### PostTargetExists

A comment target exists when Posting can read the referenced Post.

### PostTargetIsMissing

A comment target is missing when Posting cannot read the referenced Post.

## Formers

### MessageBoard

The board read lists posts in publication order and nests each post's comments in arrival order.

**.sync-engine/work/matching-notifying/inputs/concept-design-excerpt.md**

## 3. MutualMatching

### Purpose

To help people identify when their interest in working together is mutual, so they can focus on potential collaborators who are also interested in them.

### Operational Principle

When a user finds someone interesting, they can press **Show Interest** on that person's profile.

For example, Keti sees Bumba's startup pitch and thinks his idea is interesting. She presses Show Interest.

Bumba can see that Keti is interested in him through the separate **Interested in You** section.

Bumba opens Keti's profile and reads about her skills and experience. If he also presses Show Interest, they become a match.

A match only happens when both people express interest in each other.

If Bumba is not interested, he can pass instead. Keti will not receive a notification that he passed.

Users can also unmatch later if they no longer want to stay connected. Passing is permanent in this version. Unmatching records a pass in both directions, so the same pair cannot match again.

### State

```text
concept MutualMatching [User]

types
  DecisionStatus is INTERESTED or PASSED

state
  a set of Decisions with
    a from User
    a to User
    a status DecisionStatus
    unique from and to

  a set of Matches with
    a first User
    a second User

  Rule: Users cannot express interest in themselves.
  Rule: A match is an unordered pair of users.
  Rule: A pair can have at most one active match.
  Rule: A match exists exactly when both users have INTERESTED decisions about each other.
```

### Actions

**showInterest**

```text
showInterest(from: User, to: User)
  where from and to are different users
  and they are not already matched
  and from has not already made a decision about to
  then
    record that from is INTERESTED in to

    if to has already expressed interest in from:
      create a match between from and to
```

**pass**

```text
pass(from: User, to: User)
  where from and to are different users
  and they are not already matched
  and from has not already expressed interest in to
  then
    create a PASSED decision from from to to if none exists
    otherwise keep the existing PASSED decision without
      creating a second record
```

**unmatch**

```text
unmatch(user: User, other: User)
  where user and other have an active match
  then
    remove the match
    change the two existing decisions to PASSED
```

### Queries

**\_getInterestedInYou**

```text
_getInterestedInYou(user: User):
  many (from: User)
```

Returns all users with an INTERESTED decision about the given user, excluding people the user has already passed on or matched with. Returns no results when there are none, including an unknown user. Their order is unspecified.

**\_getMatches**

```text
_getMatches(user: User):
  many (other: User)
```

Returns all users who currently have an active match with the given user, or no results when there are none, including an unknown user. Their order is unspecified.

---

## 4. Notifying

### Purpose

To help users stay informed about relevant activity without having to constantly check the platform, so they don't miss opportunities to connect with people who are interested in them.

### Operational Principle

When something relevant happens, the user receives a notification.

For example, Keti presses Show Interest on Bumba's profile. Bumba gets a notification saying that Keti is interested in him.

Bumba can open the notification to view Keti's profile.

If Bumba also shows interest in Keti, both receive a notification that they matched.

Users can also receive notifications when someone they have matched with sends a new message.

Reading a notification marks it as read, but it stays in the notification list until the user dismisses it. Dismissing a notification does not undo the action that caused it.

### State

```text
concept Notifying [User]

types
  NotificationStatus is UNREAD or READ or DISMISSED

state
  a set of Notifications with
    a recipient User
    a message String
    a link String
    a createdAt DateTime
    a status NotificationStatus

  Rule: Every notification has exactly one recipient.
  Rule: New notifications are initially UNREAD.
```

### Actions

**notify**

```text
notify(
  recipient: User,
  message: String,
  link: String
): returns (notification: Notification)
  where message is not empty
  then
    create a notification
    set its recipient, message, and link to the supplied values
    set its status to UNREAD
    record the creation time
    return notification
```

**markAsRead**

```text
markAsRead(user: User, notification: Notification)
  where notification belongs to user
  and notification is not DISMISSED
  then
    change status to READ
```

**dismissNotification**

```text
dismissNotification(
  user: User,
  notification: Notification
)
  where notification belongs to user
  then
    change status to DISMISSED
```

### Queries

**\_getNotifications**

```text
_getNotifications(user: User):
  many (notification: Notification)
```

Returns the user's notifications, excluding dismissed notifications, ordered from newest to oldest. Returns no results when there are none, including an unknown user. Notifications created at the same time may appear in any order.

**\_getUnreadNotifications**

```text
_getUnreadNotifications(user: User):
  many (notification: Notification)
```

Returns all notifications belonging to the user that are marked `UNREAD`, ordered from newest to oldest. Returns no results when there are none, including an unknown user. Notifications created at the same time may appear in any order.

---

## 5. Chatting

### Purpose

To help people who have connected discuss their ideas and expectations privately, so they can decide whether they would actually want to work together.

### Operational Principle

When two people connect, they can start a private conversation.

For example, Keti and Bumba have both expressed interest in each other. A chat becomes available between them.

Keti can ask Bumba more about his startup idea, and Bumba can ask about her experience, interests, and availability.

They can continue exchanging messages and decide whether they would want to meet or try working on something together.

Their messages are saved so they can return to the conversation later.

If their connection ends, the conversation can be closed. They can no longer send new messages, but the previous messages are preserved.

### State

```text
concept Chatting [User]

types
  ConversationStatus is OPEN or CLOSED

state
  a set of Conversations with
    a firstUser User
    a secondUser User
    a status ConversationStatus

  a set of Messages with
    a conversation Conversation
    a sender User
    a content String
    a sentAt DateTime

  Rule: Every conversation has two different users.
  Rule: A pair of users has at most one conversation.
  Rule: A message sender must be a participant in the conversation.
  Rule: Messages must contain nonempty text.
```

### Actions

**createConversation**

```text
createConversation(
  firstUser: User,
  secondUser: User
): returns (conversation: Conversation)
  where users are different
  and no conversation exists between them
  then
    create a conversation between the users
    set its status to OPEN
    return conversation
```

**sendMessage**

```text
sendMessage(
  conversation: Conversation,
  sender: User,
  content: String
): returns (message: Message)
  where conversation exists
  and status is OPEN
  and sender is a participant
  and content is not empty
  then
    create a message with the given content
    associate it with the conversation
    record the sender and current time
    return message
```

**closeConversation**

```text
closeConversation(conversation: Conversation)
  where conversation exists
  and status is OPEN
  then
    set status to CLOSED
```

### Queries

**\_getConversations**

```text
_getConversations(user: User):
  many (conversation: Conversation)
```

Returns all conversations in which the user is a participant, including closed conversations so they can return to their previous messages. Open and closed conversations are shown separately by the app. Returns no results when there are none, including an unknown user. Their order is unspecified.

**\_getMessages**

```text
_getMessages(
  user: User,
  conversation: Conversation
): many (message: Message)
```

Returns all messages in the conversation, ordered from oldest to newest, if the user is a participant. Returns no results if the conversation does not exist, has no messages, or the user is not a participant, including an unknown user. Messages sent at the same time may appear in any order.

Participants can still view previous messages after a conversation is closed, but they cannot send new ones.

---

# 6. Reactions

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

## Reaction 3: Hiding a Profile

When someone hides their profile, they should no longer appear in other users' recommendations.

```text
when ProfileSetting.hideProfile(user)

where Recommending:
  a recommendation exists with user
  as either viewer or candidate

then
  Recommending.deactivateRecommendation(
    viewer,
    candidate
  )
```

This reaction applies to every recommendation involving that user.

Hiding a profile does not automatically delete existing matches or conversations.

## Reaction 4: Showing Interest

When a user shows interest in someone, that person is removed from their recommendation feed.

```text
when MutualMatching.showInterest(from, to)

where Recommending:
  a recommendation with viewer from and candidate to exists
  its status is AVAILABLE or SEE_LATER

then
  Recommending.markInterested(from, to)
```

The interest is stored in `MutualMatching`, while `Recommending` only records that the person should no longer appear in the discovery feed.

## Reaction 5: Passing

When a user passes on someone, the decision is reflected in their recommendations.

```text
when MutualMatching.pass(from, to)

where Recommending:
  a recommendation with viewer from and candidate to exists

then
  Recommending.markPassed(from, to)
```

This prevents the passed profile from appearing again.

The same decision applies whether the user passes from their discovery feed or the Interested in You section.

## Reaction 6: Notifying Someone About Interest

When Keti shows interest in Bumba, and they have not matched yet, Bumba receives a notification.

```text
when MutualMatching.showInterest(from, to)

where MutualMatching:
  no match exists between from and to
  to has not already passed on from
and ProfileSetting:
  from has a profile with name fromName

then
  Notifying.notify(
    to,
    "[fromName] is interested in you!",
    profileLink(from)
  )
```

Here, `[fromName]` is replaced with the name read by the reaction. Bumba can click the notification to see Keti's profile.

Keti will also appear in his Interested in You section, which gets its information directly from `MutualMatching`.

If Bumba dismisses the notification, Keti still appears in Interested in You.

## Reaction 7: Creating a Chat After a Match

When both users show interest in each other, a match is created and a chat becomes available.

```text
when MutualMatching.showInterest(from, to)

where MutualMatching:
  a match now exists between from and to
and Chatting:
  no conversation exists between them

then
  Chatting.createConversation(from, to)
```

The `showInterest` precondition means the pair was not matched before this action. If a match exists afterward, this action created it. For example, Keti has already shown interest in Bumba. When Bumba shows interest back, a match is created and their private conversation becomes available.

## Reaction 8: Sending Match Notifications

When a new match is created, both people receive a notification.

```text
when MutualMatching.showInterest(from, to)

where MutualMatching:
  a match now exists between from and to

then
  Notifying.notify(
    from,
    "It's a match!",
    matchesLink(from)
  )

  Notifying.notify(
    to,
    "It's a match!",
    matchesLink(to)
  )
```

The users can open their Matches section and start chatting.

## Reaction 9: Notifying About New Messages

When one person sends a message, the other person receives a notification.

```text
when Chatting.sendMessage(
  conversation,
  sender,
  content
)

where Chatting:
  recipient is the other participant
  in the conversation

then
  Notifying.notify(
    recipient,
    "You have a new message!",
    conversationLink(conversation)
  )
```

For example, Keti sends Bumba a message asking about his startup. Bumba receives a notification and can open their conversation.

## Reaction 10: Closing Chat After Unmatching

When either person unmatches, their chat is closed.

```text
when MutualMatching.unmatch(user, other)

where Chatting:
  an OPEN conversation exists
  between user and other

then
  Chatting.closeConversation(conversation)
```

Neither person can send new messages after unmatching.

Their previous messages remain saved, but the conversation is no longer active.

Unmatching also removes both people from each other's discovery feeds:

```text
when MutualMatching.unmatch(user, other)

where Recommending:
  a recommendation exists with viewer and candidate
    equal to user and other in either direction

then
  Recommending.markPassed(viewer, candidate)
```

This applies to each existing direction, keeping the feed decisions consistent with the passes recorded by MutualMatching.

# Result

Unless the task requests another format, return these headings in order. Omit progress narration.

- `## Status` — required. First line is exactly `Complete` or `Blocked`; explanation goes below.
- `## Changed` — required. Paths changed, or none.
- `## Questions` — required. Material questions, or none.
- `## Checks` — optional. Command and outcome when applicable.

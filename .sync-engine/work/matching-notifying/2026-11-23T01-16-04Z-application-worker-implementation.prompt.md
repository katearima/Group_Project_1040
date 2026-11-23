# Role and objective

Work unit `matching-notifying`; role `application-worker`; phase `implementation`.

# Application worker

Implement and test the assigned registration, composition, assembly, configuration, boundary, host, and integration work from approved design and concept surfaces. Keep concept implementations, frontend behavior, and authored design read-only unless the task explicitly expands ownership.

Before editing, inventory every selected endpoint, internal reaction, view, former, computation, module/group placement, and endpoint path against the supplied design. Register raw concept classes, refusals, computations, and static instances exactly once. Implement each approved obligation, acknowledgement order, and recovery path through documented composition declarations.

Use the selected transport end to end. Do not invent missing declarations, duplicate owner invariants or effects, bypass the boundary, call concepts directly from a host, or create a parallel product router. Generate artifacts only through project commands.

Repair in-scope wiring and test diagnostics. Do not edit authored design, concept implementation, audit records, or tests outside the write grant, and do not replace required scenarios with skipped or TODO tests. Report a design blocker when every documented realization changes approved behavior, a context blocker when one documented repair leaves the API undetermined, or an environment blocker when checks cannot run.

# Access

Root: "/Users/katearima/Documents/6.104/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `application:design` ("/Users/katearima/Documents/6.104/Group_Project_1040/design"), `application:generated.config.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/generated.config.ts"), `application:package.json` ("/Users/katearima/Documents/6.104/Group_Project_1040/package.json"), `application:src` ("/Users/katearima/Documents/6.104/Group_Project_1040/src"), `application:tsconfig.json` ("/Users/katearima/Documents/6.104/Group_Project_1040/tsconfig.json").
- Write: `owned-integration:src/assembly.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/assembly.ts"), `owned-integration:src/composition.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/composition.ts"), `owned-integration:src/compositions` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/compositions"), `owned-integration:src/concepts.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/concepts.ts"), `owned-integration:src/main.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/main.ts"), `owned-configuration:generated` ("/Users/katearima/Documents/6.104/Group_Project_1040/generated"), `owned-configuration:generated.config.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/generated.config.ts"), `owned-test:src/integration.test.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/integration.test.ts").
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

**.sync-engine/work/matching-notifying/inputs/app-task.md**

# Application integration: register concepts, realize compositions, host over HTTP

Objective: make the approved design executable end to end. Own registration, composition,
assembly, configuration, the HTTP host, generated artifacts, and integration tests.

1. `src/concepts.ts` — register Authenticating, Sessioning, MutualMatching and Notifying
   with their approved specs imported as text from `@design/concepts/*.md` and every
   refusal code mapped to its exported error class. Use the vendored catalog classes under
   `src/concepts/catalog/` for Authenticating and Sessioning. Register the instances exactly
   as `design/types.md` declares them, and the computations `currentInstant`,
   `sessionLifetime`, `profileLink`, `matchesLink` as declared.
2. `src/composition.ts` (and any modules it needs) — realize every endpoint linked in
   `design/compositions/Accounts.md`, `Matching.md` and `Notifications.md` with the exact
   module/group/declaration identities and endpoint paths. Show interest owns Reactions 6
   and 8 synchronously before its answer, in the stated order and with best-effort failure
   semantics. No links or behavior for the deferred clauses.
3. `src/assembly.ts` — assemble with the concept set, fresh implementations, and the
   composition.
4. `src/main.ts` — host the assembled application with `@mit-sdg/sync-engine-http`
   (already a dependency at 1.1.0); no hand-written router and no direct concept calls.
   Port from `PORT`, default 8080.
5. `generated.config.ts` — list the authored design documents; run `bun run generate`.
6. Integration tests (`src/integration.test.ts` or similar, `bun test`) driving the
   assembled application through its public interface for every brief Done When outcome:
   A→B interest notifies B and lists A in B's interested-in-you; mutual interest matches
   and notifies both and removes A from interested-in-you; repeated/self interest and
   missing/invalid session refused with no state change; pass on incoming interest removes
   it with no notification to A; unmatch → both decisions PASSED, rematch refused,
   non-participant cannot unmatch; mark-as-read/dismiss only on own notifications, dismissed
   leave both lists, interest/match unaffected; sign-out ends the session.

Checks: `bun run check:design`, `bun run generate`, `bun run check`, `bun test` must pass.
Do not edit design or concept implementations; report a design blocker if a declaration is
missing or the contracts cannot be realized as written. `src/db.ts` and the Mongo setup
stay untouched (in-memory state for this change).

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
- Interest and match notifications (Reactions 6 and 8) are best-effort in this change (user
  choice after review finding F1): if a `notify` step faults after `showInterest`
  succeeded, the decision/match stays recorded, the endpoint reports the fault, and no
  recovery recreates the lost notification. The interested-in-you and matches lists are the
  authoritative record. Revisit when persistence lands.
- A request with no session is refused `UNKNOWN_SESSION`, the same code as an ended,
  expired or invented session (coordinator decision for review finding F2).
- Framework stays on the team's pinned sync-engine 1.1.0 although the skill release is
  1.2.0 (user choice: continue with warning). `@mit-sdg/sync-engine-analysis` and
  `@mit-sdg/sync-engine-catalog` 1.1.0 were added as exact dev dependencies by bootstrap.
  `@mit-sdg/sync-engine-http` 1.1.0 was already a dependency and is used for the host.
- "Empty" text in these contracts (Notifying `EMPTY_MESSAGE`) follows the team design
  convention that text containing only spaces counts as empty; `notify` refuses a
  whitespace-only message (coordinator decision during implementation; no contract change).
- `@node-rs/argon2` 2.0.2, the catalog-pinned password verifier, was added as an exact
  runtime dependency for the vendored Authenticating source (user choice).
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
```

Every flow binds one instant when it enters the application and passes that same instant
to each session check, session start or end, and notification it causes.

```computations
currentInstant() : DateTime
  Produces the instant at which the current flow entered the application; it is read once per flow and reused for every step of that flow.
```

## Compositions

**design/compositions/Accounts.md**

# Accounts

A visitor can register an account, sign in to an existing one, and sign out. Registering
and signing in each start a 30-minute session for the account, measured from the flow's
[current instant](computation:currentInstant) with the
[fixed session lifetime](computation:sessionLifetime). Every other endpoint in the
application resolves the signed-in user only from that session through Sessioning, so a
username or account identity in a request is never treated as authentication.

```computations
sessionLifetime() : Number
  Produces 1800000, the 30-minute session lifetime in milliseconds.
```

## Register

Anyone may [register](reaction:Accounts.Sessions.Register) by supplying a username and a
password. Authenticating owns the account and refuses an invalid username
(`INVALID_USERNAME`), a password of the wrong length (`WEAK_PASSWORD`), or a username that is
already registered (`USERNAME_TAKEN`); a refusal creates no account and no session. When
the account is registered, Sessioning starts a session for it with the 30-minute lifetime
and the flow's instant, and only then does the endpoint answer with the account identity,
the session, and its expiry. Registration and session start belong to independent owners
and are not atomic: if session start faults after the account was registered, the account
remains and the visitor recovers by signing in; repeating registration is refused
`USERNAME_TAKEN`.

```endpoints
Accounts.Sessions.Register at /accounts/register
```

## Sign in

Anyone may [sign in](reaction:Accounts.Sessions.SignIn) by supplying a username and a
password. Authenticating refuses an unknown username or a wrong password with the single
indistinguishable refusal `INVALID_CREDENTIALS`, and no session starts. When the password
verifies, Sessioning starts a new 30-minute session for that account from the flow's
instant, and the endpoint answers with the account identity, the session, and its expiry
after the session exists. Signing in again starts another independent session; earlier
sessions stay active until ended or expired. If session start faults, no session is
answered and the visitor may simply sign in again.

```endpoints
Accounts.Sessions.SignIn at /accounts/sign-in
```

## Sign out

A holder of a session may [sign out](reaction:Accounts.Sessions.SignOut). Sessioning ends
that session at the flow's instant, and the endpoint answers that it ended once the session
is gone. A request with no session, or with an already ended, expired, or invented one, is
refused `UNKNOWN_SESSION` with no change; the missing case carries the same code and meaning
as an inactive session, and signing out twice refuses the second time. Signing out
ends only the supplied session; it changes no matching decisions, matches, or
notifications.

```endpoints
Accounts.Sessions.SignOut at /accounts/sign-out
```

**design/compositions/Matching.md**

# Matching

Signed-in users show interest in or pass on each other, see who is interested in them and
whom they are matched with, and unmatch. Every endpoint here first resolves the supplied
session to the signed-in account with Sessioning `current` at the flow's
[current instant](computation:currentInstant). A request with no session, or with an ended,
expired, or invented one, is refused `UNKNOWN_SESSION` before any matching or notifying
action; the missing case carries the same code and meaning as an inactive session, and the
refusal changes no state and acts for nobody. The other person in a request is an
account identity the caller names as a claim about whom to act on, never about who is
acting: the acting user is always the session's account.

MutualMatching enforces every pair invariant atomically inside its own actions, so the
composition does not pre-check self, matched, or already-decided conditions separately;
it forwards that action's refusal unchanged. Concurrent requests about the same pair
therefore cannot produce two decisions for one direction or two matches for one pair.

Not realized in this change, and deliberately not linked: the ProfileSetting guard on show
interest (both profiles visible with opposite roles) and the sender's name for the interest
notification; Reaction 4 (`Recommending.markInterested`) and Reaction 5
(`Recommending.markPassed`); the Recommending branch of the pass request guard; Reaction 7
(create a conversation on a match); Reaction 9 (notify about new messages); and both
halves of Reaction 10 (close the conversation and mark recommendations passed on unmatch).
Because the ProfileSetting guard is deferred, the other person is an opaque account
identity that is not checked against registered accounts in this change: interest in an
identity no one holds records a decision and a notification that no signed-in user can
see.

## Show interest

A signed-in user may [show interest](reaction:Matching.Requests.ShowInterest) in another
person. After resolving the session, MutualMatching `showInterest` runs with the session
user as `from` and the other person as `to`. It refuses interest in oneself
(`INTEREST_IN_SELF`), in a person already matched with the user
(`INTEREST_ALREADY_MATCHED`), and in a person the user already decided about, whether by
interest, a pass, or an earlier unmatch (`INTEREST_ALREADY_DECIDED`); a refusal records
nothing and sends no notification, so repeating a successful show interest is refused with
no state change.

The same endpoint-linked reaction owns the follow-on notifications of Reactions 6 and 8 as
synchronous consequences before its answer; this change has no separate internal reaction
for them. Every notification uses the flow's instant as `createdAt`.

- When `showInterest` answers that it created a match (Reaction 8), Notifying `notify`
  gives the session user "It's a match!" with [their matches link](computation:matchesLink),
  and then gives the other person "It's a match!" with their own matches link.
- When it answers that no match was created (Reaction 6), the reaction reads MutualMatching
  `_decision` from the other person to the session user. Unless that decision is PASSED,
  Notifying `notify` gives the other person "Someone is interested in you!" with the
  [session user's profile link](computation:profileLink). If the other person has passed on
  the session user, no notification is sent. The generic message stands in for the
  deferred sender name, so no username is exposed.

By explicit product decision for this in-memory change, these interest and match
notifications are best-effort. The endpoint answers whether a match was created only after
the decision is recorded and the applicable notifications have been attempted. Recording
the decision and creating the notifications belong to independent owners and are not
atomic. If a `notify` step faults
after `showInterest` succeeded, the decision and any match stay recorded and are not rolled
back; the endpoint reports the fault instead of the match outcome, and for a match the
first notification may exist without the second. No retry recreates a lost notification:
repeating show interest is refused `INTEREST_ALREADY_DECIDED` or `INTEREST_ALREADY_MATCHED`,
and the interested-in-you and matches lists, which read MutualMatching directly, remain
the authoritative record of the outcome. `notify` refuses only an empty message, which the
fixed messages here never are. Recovery of a lost notification is deferred until
persistence lands; this change adds no recovery mechanism.

```endpoints
Matching.Requests.ShowInterest at /matching/show-interest
```

```computations
profileLink(user: Authenticating.Account) : String
  Produces the navigation link /profile/<user> for the given account identity.
matchesLink(user: Authenticating.Account) : String
  Produces the recipient's own matches navigation link, /matches, for the given account.
```

## Pass

A signed-in user may [pass](reaction:Matching.Requests.Pass) on a person who has shown
interest in them. After resolving the session, the reaction reads MutualMatching
`_decision` from the other person to the session user; unless it is INTERESTED, the request
is refused `NO_INCOMING_INTEREST` with no state change. This guard is the incoming-interest
branch of the product's pass request; its recommendation branch is deferred. Passing on
oneself always meets this refusal, because no one can hold a decision about themselves.
When the guard holds, MutualMatching `pass` runs with the session user as `from`; it
refuses a matched pair (`PASS_ALREADY_MATCHED`) and a person the user already showed
interest in (`PASS_AFTER_INTEREST`). Otherwise it records a PASSED decision, or keeps the
existing one, so repeating a pass succeeds without change. The endpoint answers success
after the decision is recorded. No notification is sent for a pass, and the passed person
leaves the user's interested-in-you list.

```endpoints
Matching.Requests.Pass at /matching/pass
```

## Unmatch

A signed-in user may [unmatch](reaction:Matching.Requests.Unmatch) a person they are
matched with. After resolving the session, MutualMatching `unmatch` runs with the session
user as `user`; when no match pairs them, including a request naming oneself or a pair the
session user does not belong to, it refuses `NOT_MATCHED` with no change. On success the
match is removed and both decisions become PASSED in that one action, so a later show
interest in either direction is refused and the pair cannot match again. The endpoint
answers success after that change. Unmatching sends no notification and leaves existing
notifications untouched; a repeated unmatch is refused `NOT_MATCHED`.

```endpoints
Matching.Requests.Unmatch at /matching/unmatch
```

## Interested in you

A signed-in user may [list who is interested in them](reaction:Matching.Reads.InterestedInYou).
The answer is MutualMatching `_getInterestedInYou` for the session user only, as rows of
account identities in the order those interests were recorded, earliest first, excluding
people the user has passed on or is matched with; it is empty when there are none. No
caller can read another user's incoming interests. Reading changes no state.

```endpoints
Matching.Reads.InterestedInYou at /matching/interested-in-you
```

## Matches

A signed-in user may [list their matches](reaction:Matching.Reads.Matches). The answer is
MutualMatching `_getMatches` for the session user only, as rows of account identities in
the order the matches were created, oldest first; it is empty when there are none. No
caller can read another user's matches. Reading changes no state.

```endpoints
Matching.Reads.Matches at /matching/matches
```

**design/compositions/Notifications.md**

# Notifications

A signed-in user reads and manages only their own notifications. Every endpoint here
first resolves the supplied session to the signed-in account with Sessioning `current` at
the flow's [current instant](computation:currentInstant). A request with no session, or
with an ended, expired, or invented one, is refused `UNKNOWN_SESSION` before any notifying
action; the missing case carries the same code and meaning as an inactive session, and the
refusal changes no state. Notifications are created only as consequences
of matching activity, never by a request.

Ownership is enforced by Notifying itself: `markAsRead` and `dismissNotification` take the
session user and the named notification and check the recipient atomically with the
change. A notification identity in a request is only a claim about which notification to
act on. A notification belonging to someone else and one that does not exist are refused
identically, so a caller cannot learn whether another user's notification exists.

Not realized in this change: notifications about new messages (Reaction 9) and the
sender's name in interest notifications, both waiting on Chatting and ProfileSetting.

## List notifications

A signed-in user may [list their notifications](reaction:Notifications.Reads.List). The
answer is Notifying `_getNotifications` for the session user: each UNREAD or READ
notification with its message, link, creation instant, and status, newest first, with
equal instants ordered by most recently created first. Dismissed notifications never
appear, and the list is empty when there are none. Reading changes no state.

```endpoints
Notifications.Reads.List at /notifications/list
```

## List unread notifications

A signed-in user may [list their unread notifications](reaction:Notifications.Reads.ListUnread).
The answer is Notifying `_getUnreadNotifications` for the session user: each UNREAD
notification with its message, link, and creation instant, in the same newest-first order.
Read and dismissed notifications never appear, and the list is empty when there are none.

```endpoints
Notifications.Reads.ListUnread at /notifications/unread
```

## Mark as read

A signed-in user may [mark a notification as read](reaction:Notifications.Requests.MarkAsRead).
Notifying `markAsRead` runs with the session user. It refuses a notification that is not
the user's or does not exist with `READ_TARGET_NOT_FOUND`, and the user's own dismissed
notification with `READ_TARGET_DISMISSED`; refusals change nothing. Otherwise the
notification becomes READ, which leaves the unread list but stays in the notification
list; marking a READ notification again succeeds without change. The endpoint answers the
notification identity after the change.

```endpoints
Notifications.Requests.MarkAsRead at /notifications/mark-read
```

## Dismiss

A signed-in user may [dismiss a notification](reaction:Notifications.Requests.Dismiss).
Notifying `dismissNotification` runs with the session user. It refuses a notification that
is not the user's or does not exist with `DISMISS_TARGET_NOT_FOUND`, changing nothing.
Otherwise the notification becomes DISMISSED and leaves both lists; dismissing it again
succeeds without change. The endpoint answers the notification identity after the change.
Dismissing never touches MutualMatching: the interest or match that caused the
notification stays, and the sender still appears in interested-in-you or matches.

```endpoints
Notifications.Requests.Dismiss at /notifications/dismiss
```

## Concept specifications

**design/concepts/Authenticating.md**

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

**design/concepts/MutualMatching.md**

# MutualMatching

## Purpose

Reveal a match only when interest between two users is mutual, recorded as one directed
decision per ordered pair, so a one-sided interest or a pass is never shown to the other
person as a connection and a pair that has passed or unmatched cannot be matched again.
This rules out a request-and-accept handshake, where one user's acceptance alone would
connect them.

## Principle

Keti shows interest in Bumba, which records that Keti is INTERESTED in Bumba; no match
exists yet, and Bumba's interested-in-you list answers Keti. Bumba then shows interest in
Keti, which records his INTERESTED decision and creates the match between them in the same
action; both match lists now answer the other, and Keti leaves Bumba's interested-in-you
list. A second show interest from Keti to Bumba is refused. Later Keti unmatches Bumba: the
match is removed and both decisions become PASSED, so a new show interest in either
direction is refused. Separately, Ana shows interest in Bumba and Bumba passes on her; Ana
leaves Bumba's interested-in-you list, and passing on Ana again succeeds without a second
decision.

## Types

```types
external User
  The opaque identity of a person who decides about other people.
DecisionStatus is INTERESTED or PASSED
  Whether a directed decision is interest or a permanent pass.
```

## State

```state
a seq of Decisions with
  a from User
  a to User
  a status DecisionStatus
  unique from and to

a seq of Matches with
  a first User
  a second User

Rule: No Decision has the same User as from and to.
Rule: A Match is an unordered pair of two different Users; first and second carry no meaning beyond membership.
Rule: A pair of Users has at most one Match, whichever User is first.
Rule: A Match exists between two Users exactly when each has an INTERESTED Decision about the other.
Rule: A PASSED Decision never becomes INTERESTED again.
Rule: Decisions are kept in the order they were first recorded and Matches in the order they were created; changing a Decision's status keeps its position.
Rule: Each action checks and changes these facts atomically, so concurrent requests for the same pair cannot create two Decisions for one ordered pair or two Matches for one pair.
```

## Actions

```actions
showInterest (from: User, to: User) : returns (matched: Flag)
  where from is to
  then
    refuses INTEREST_IN_SELF "You cannot show interest in yourself."
  where from is not to and a Match pairs from and to
  then
    refuses INTEREST_ALREADY_MATCHED "You are already matched with this person."
  where from is not to, no Match pairs from and to, and a Decision from from to to already exists
  then
    refuses INTEREST_ALREADY_DECIDED "You have already decided about this person."
  where from is not to, no Match pairs from and to, no Decision from from to to exists, and the Decision from to to from has status INTERESTED
  then
    append a Decision from from to to with status INTERESTED
    append a Match with first from and second to
    set matched to true
    returns matched
  where from is not to, no Match pairs from and to, no Decision from from to to exists, and no Decision from to to from has status INTERESTED
  then
    append a Decision from from to to with status INTERESTED
    set matched to false
    returns matched

pass (from: User, to: User) : returns ()
  where from is to
  then
    refuses PASS_ON_SELF "You cannot pass on yourself."
  where from is not to and a Match pairs from and to
  then
    refuses PASS_ALREADY_MATCHED "You are matched with this person; unmatch instead."
  where from is not to, no Match pairs from and to, and the Decision from from to to has status INTERESTED
  then
    refuses PASS_AFTER_INTEREST "You have already shown interest in this person."
  where from is not to, no Match pairs from and to, and the Decision from from to to has status PASSED
  then
    keep the existing PASSED Decision without adding another
    returns
  where from is not to, no Match pairs from and to, and no Decision from from to to exists
  then
    append a Decision from from to to with status PASSED
    returns

unmatch (user: User, other: User) : returns ()
  where no Match pairs user and other
  then
    refuses NOT_MATCHED "You do not have an active match with this person."
  where a Match pairs user and other
  then
    delete that Match
    set the status of the Decision from user to other and of the Decision from other to user to PASSED
    returns
```

## Queries

```queries
_getInterestedInYou (user: User) : many (from: User)
  answers each User with an INTERESTED Decision about user, excluding Users that user has a PASSED Decision about and Users matched with user
  answers no rows when there are none, including for an unknown user
  orders rows by the position of each from User's Decision about user, earliest recorded first

_getMatches (user: User) : many (other: User)
  answers each User that currently has a Match with user
  answers no rows when there are none, including for an unknown user
  orders rows by Match creation order, oldest first

_decision (from: User, to: User) : optional (status: DecisionStatus)
  answers the status of the Decision from from to to
  answers no row when from has not decided about to, including for unknown users
```

**design/concepts/Notifying.md**

# Notifying

## Purpose

Keep a per-recipient inbox of short messages, each with a navigation link and a
read/dismissed lifecycle, so a user learns about relevant activity without polling every
feature; dismissing a message only hides it and never undoes the activity that caused it.
This rules out deriving notices on demand from other features' state, which would lose
the read and dismissed history.

## Principle

At 10:00 Bumba is notified "Someone is interested in you!" with link `/profile/keti`;
the notification is UNREAD and appears first in both his notification list and his unread
list. At 10:05 Bumba is notified "It's a match!" with link `/matches`, which now appears
above the first in both lists. Bumba marks the 10:00 notification as read: it leaves his
unread list but stays in his notification list as READ. Keti tries to mark or dismiss
Bumba's notification and is refused exactly as if it did not exist. Bumba dismisses the
10:00 notification: it leaves both lists, and marking it as read afterwards is refused.

## Types

```types
external User
  The opaque identity of a notification recipient.
NotificationStatus is UNREAD or READ or DISMISSED
  The lifecycle stage of one notification.
```

## State

```state
a seq of Notifications with
  a recipient User
  a message String
  a link String
  a createdAt DateTime
  a status NotificationStatus

Rule: Every Notification has exactly one recipient, fixed at creation.
Rule: A new Notification is UNREAD; message, link, and createdAt never change.
Rule: A DISMISSED Notification never becomes UNREAD or READ again, and a READ Notification never becomes UNREAD again.
Rule: createdAt is supplied by the caller of notify; Notifying never reads a clock.
Rule: Notifications are kept in creation order, which breaks ties between equal createdAt values.
Rule: notify does not deduplicate; each successful call adds a distinct Notification. Marking a READ Notification as read and dismissing a DISMISSED Notification succeed again without change.
```

## Actions

```actions
notify (recipient: User, message: String, link: String, createdAt: DateTime) : returns (notification: Notification)
  where message is empty
  then
    refuses EMPTY_MESSAGE "A notification message must not be empty."
  where message is not empty
  then
    append a new Notification with recipient, message, link, createdAt, and status UNREAD
    bind notification to that Notification
    returns notification

markAsRead (user: User, notification: Notification) : returns (notification: Notification)
  where notification is not in Notifications or its recipient is not user
  then
    refuses READ_TARGET_NOT_FOUND "No such notification."
  where notification's recipient is user and its status is DISMISSED
  then
    refuses READ_TARGET_DISMISSED "This notification has been dismissed."
  where notification's recipient is user and its status is UNREAD or READ
  then
    set notification's status to READ
    returns notification

dismissNotification (user: User, notification: Notification) : returns (notification: Notification)
  where notification is not in Notifications or its recipient is not user
  then
    refuses DISMISS_TARGET_NOT_FOUND "No such notification."
  where notification's recipient is user
  then
    set notification's status to DISMISSED
    returns notification
```

## Queries

```queries
_getNotifications (user: User) : many (notification: Notification, message: String, link: String, createdAt: DateTime, status: NotificationStatus)
  answers each Notification whose recipient is user and whose status is UNREAD or READ, with its message, link, createdAt, and status
  answers no rows when there are none, including for an unknown user
  orders rows by createdAt newest first, and equal createdAt values by creation order newest first

_getUnreadNotifications (user: User) : many (notification: Notification, message: String, link: String, createdAt: DateTime)
  answers each Notification whose recipient is user and whose status is UNREAD, with its message, link, and createdAt
  answers no rows when there are none, including for an unknown user
  orders rows by createdAt newest first, and equal createdAt values by creation order newest first
```

**design/concepts/Sessioning.md**

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

## Concept public surfaces

**src/concepts/MutualMatching.ts**

export type User = string;
export type DecisionStatus = "INTERESTED" | "PASSED";

export interface DecisionRow {
  from: User;
  to: User;
  status: DecisionStatus;
}

export interface MatchRow {
  first: User;
  second: User;
}

export const INTEREST_IN_SELF_DETAIL = "You cannot show interest in yourself.";
export const INTEREST_ALREADY_MATCHED_DETAIL = "You are already matched with this person.";
export const INTEREST_ALREADY_DECIDED_DETAIL = "You have already decided about this person.";
export const PASS_ON_SELF_DETAIL = "You cannot pass on yourself.";
export const PASS_ALREADY_MATCHED_DETAIL = "You are matched with this person; unmatch instead.";
export const PASS_AFTER_INTEREST_DETAIL = "You have already shown interest in this person.";
export const NOT_MATCHED_DETAIL = "You do not have an active match with this person.";

/** Refusal INTEREST_IN_SELF. */
export class InterestInSelf extends Error {}
/** Refusal INTEREST_ALREADY_MATCHED. */
export class InterestAlreadyMatched extends Error {}
/** Refusal INTEREST_ALREADY_DECIDED. */
export class InterestAlreadyDecided extends Error {}
/** Refusal PASS_ON_SELF. */
export class PassOnSelf extends Error {}
/** Refusal PASS_ALREADY_MATCHED. */
export class PassAlreadyMatched extends Error {}
/** Refusal PASS_AFTER_INTEREST. */
export class PassAfterInterest extends Error {}
/** Refusal NOT_MATCHED. */
export class NotMatched extends Error {}

/** Unambiguous key for an ordered pair of opaque identities. */
function orderedKey(from: User, to: User): string {
  return JSON.stringify([from, to]);
}

/** Unambiguous key for an unordered pair of opaque identities. */
function unorderedKey(a: User, b: User): string {
  return a < b ? JSON.stringify([a, b]) : JSON.stringify([b, a]);
}

export interface MutualMatchingInitialState {
  decisions?: Iterable<DecisionRow>;
  matches?: Iterable<MatchRow>;
}

export class MutualMatchingConcept {
  /** Decisions in first-recorded order. */
  #decisions: DecisionRow[] = [];
  #decisionsByPair = new Map<string, DecisionRow>();
  /** Matches in creation order. */
  #matches: MatchRow[] = [];
  #matchesByPair = new Map<string, MatchRow>();

  constructor({ decisions = [], matches = [] }: MutualMatchingInitialState = {}) {
    for (const { from, to, status } of decisions) {
      const decision: DecisionRow = { from, to, status };
      this.#decisions.push(decision);
      this.#decisionsByPair.set(orderedKey(from, to), decision);
    }
    for (const { first, second } of matches) {
      const match: MatchRow = { first, second };
      this.#matches.push(match);
      this.#matchesByPair.set(unorderedKey(first, second), match);
    }
  }

  showInterest({ from, to }: { from: User; to: User }): { matched: boolean } {
    if (from === to) throw new InterestInSelf(INTEREST_IN_SELF_DETAIL);
    if (this.#matchesByPair.has(unorderedKey(from, to))) {
      throw new InterestAlreadyMatched(INTEREST_ALREADY_MATCHED_DETAIL);
    }
    if (this.#decisionsByPair.has(orderedKey(from, to))) {
      throw new InterestAlreadyDecided(INTEREST_ALREADY_DECIDED_DETAIL);
    }
    const reverse = this.#decisionsByPair.get(orderedKey(to, from));
    this.#appendDecision(from, to, "INTERESTED");
    if (reverse?.status === "INTERESTED") {
      const match: MatchRow = { first: from, second: to };
      this.#matches.push(match);
      this.#matchesByPair.set(unorderedKey(from, to), match);
      return { matched: true };
    }
    return { matched: false };
  }

  pass({ from, to }: { from: User; to: User }): Record<string, never> {
    if (from === to) throw new PassOnSelf(PASS_ON_SELF_DETAIL);
    if (this.#matchesByPair.has(unorderedKey(from, to))) {
      throw new PassAlreadyMatched(PASS_ALREADY_MATCHED_DETAIL);
    }
    const existing = this.#decisionsByPair.get(orderedKey(from, to));
    if (existing?.status === "INTERESTED") {
      throw new PassAfterInterest(PASS_AFTER_INTEREST_DETAIL);
    }
    if (existing === undefined) this.#appendDecision(from, to, "PASSED");
    return {};
  }

  unmatch({ user, other }: { user: User; other: User }): Record<string, never> {
    const key = unorderedKey(user, other);
    const match = this.#matchesByPair.get(key);
    if (match === undefined) throw new NotMatched(NOT_MATCHED_DETAIL);
    this.#matchesByPair.delete(key);
    this.#matches = this.#matches.filter((candidate) => candidate !== match);
    this.#setPassed(user, other);
    this.#setPassed(other, user);
    return {};
  }

  _getInterestedInYou({ user }: { user: User }): Array<{ from: User }> {
    const rows: Array<{ from: User }> = [];
    for (const decision of this.#decisions) {
      if (decision.to !== user || decision.status !== "INTERESTED") continue;
      const from = decision.from;
      if (this.#decisionsByPair.get(orderedKey(user, from))?.status === "PASSED") continue;
      if (this.#matchesByPair.has(unorderedKey(user, from))) continue;
      rows.push({ from });
    }
    return rows;
  }

  _getMatches({ user }: { user: User }): Array<{ other: User }> {
    const rows: Array<{ other: User }> = [];
    for (const { first, second } of this.#matches) {
      if (first === user) rows.push({ other: second });
      else if (second === user) rows.push({ other: first });
    }
    return rows;
  }

  _decision({ from, to }: { from: User; to: User }): Array<{ status: DecisionStatus }> {
    const decision = this.#decisionsByPair.get(orderedKey(from, to));
    return decision === undefined ? [] : [{ status: decision.status }];
  }

  #appendDecision(from: User, to: User, status: DecisionStatus): void {
    const decision: DecisionRow = { from, to, status };
    this.#decisions.push(decision);
    this.#decisionsByPair.set(orderedKey(from, to), decision);
  }

  #setPassed(from: User, to: User): void {
    const decision = this.#decisionsByPair.get(orderedKey(from, to));
    if (decision !== undefined) decision.status = "PASSED";
  }
}

**src/concepts/Notifying.ts**

import { randomUUID } from "node:crypto";

export type User = string;
export type Notification = string;
export type NotificationStatus = "UNREAD" | "READ" | "DISMISSED";

export interface NotificationRecord {
  notification: Notification;
  recipient: User;
  message: string;
  link: string;
  createdAt: Date;
  status: NotificationStatus;
}

export interface NotifyingDependencies {
  /** Source of fresh opaque Notification identities. */
  freshNotification?: () => Notification;
  /** Notifications to start from, in creation order. */
  initial?: Iterable<NotificationRecord>;
}

export const EMPTY_MESSAGE_DETAIL = "A notification message must not be empty.";
export const READ_TARGET_NOT_FOUND_DETAIL = "No such notification.";
export const READ_TARGET_DISMISSED_DETAIL = "This notification has been dismissed.";
export const DISMISS_TARGET_NOT_FOUND_DETAIL = "No such notification.";

/** Refusal EMPTY_MESSAGE. */
export class EmptyMessage extends Error {}
/** Refusal READ_TARGET_NOT_FOUND. */
export class ReadTargetNotFound extends Error {}
/** Refusal READ_TARGET_DISMISSED. */
export class ReadTargetDismissed extends Error {}
/** Refusal DISMISS_TARGET_NOT_FOUND. */
export class DismissTargetNotFound extends Error {}

const NOTIFICATION_ID_ATTEMPTS = 32;

interface StoredNotification extends NotificationRecord {
  /** Creation position; breaks ties between equal createdAt values. */
  position: number;
}

function newestFirst(a: StoredNotification, b: StoredNotification): number {
  return b.createdAt.getTime() - a.createdAt.getTime() || b.position - a.position;
}

export class NotifyingConcept {
  #notifications = new Map<Notification, StoredNotification>();
  #nextPosition = 0;
  #freshNotification: () => Notification;

  constructor({ freshNotification = randomUUID, initial = [] }: NotifyingDependencies = {}) {
    this.#freshNotification = freshNotification;
    for (const record of initial) {
      this.#store({ ...record, createdAt: new Date(record.createdAt.getTime()) });
    }
  }

  notify({
    recipient,
    message,
    link,
    createdAt,
  }: {
    recipient: User;
    message: string;
    link: string;
    createdAt: Date;
  }): { notification: Notification } {
    // Text containing only whitespace counts as empty (team product design).
    if (message.trim().length === 0) throw new EmptyMessage(EMPTY_MESSAGE_DETAIL);
    const notification = this.#allocate();
    this.#store({
      notification,
      recipient,
      message,
      link,
      createdAt: new Date(createdAt.getTime()),
      status: "UNREAD",
    });
    return { notification };
  }

  markAsRead({
    user,
    notification,
  }: {
    user: User;
    notification: Notification;
  }): { notification: Notification } {
    const found = this.#notifications.get(notification);
    if (found === undefined || found.recipient !== user) {
      throw new ReadTargetNotFound(READ_TARGET_NOT_FOUND_DETAIL);
    }
    if (found.status === "DISMISSED") throw new ReadTargetDismissed(READ_TARGET_DISMISSED_DETAIL);
    found.status = "READ";
    return { notification };
  }

  dismissNotification({
    user,
    notification,
  }: {
    user: User;
    notification: Notification;
  }): { notification: Notification } {
    const found = this.#notifications.get(notification);
    if (found === undefined || found.recipient !== user) {
      throw new DismissTargetNotFound(DISMISS_TARGET_NOT_FOUND_DETAIL);
    }
    found.status = "DISMISSED";
    return { notification };
  }

  _getNotifications({ user }: { user: User }): Array<{
    notification: Notification;
    message: string;
    link: string;
    createdAt: Date;
    status: NotificationStatus;
  }> {
    return this.#inbox(user, (status) => status !== "DISMISSED").map(
      ({ notification, message, link, createdAt, status }) => ({
        notification,
        message,
        link,
        createdAt: new Date(createdAt.getTime()),
        status,
      }),
    );
  }

  _getUnreadNotifications({ user }: { user: User }): Array<{
    notification: Notification;
    message: string;
    link: string;
    createdAt: Date;
  }> {
    return this.#inbox(user, (status) => status === "UNREAD").map(
      ({ notification, message, link, createdAt }) => ({
        notification,
        message,
        link,
        createdAt: new Date(createdAt.getTime()),
      }),
    );
  }

  #inbox(user: User, include: (status: NotificationStatus) => boolean): StoredNotification[] {
    const rows: StoredNotification[] = [];
    for (const stored of this.#notifications.values()) {
      if (stored.recipient === user && include(stored.status)) rows.push(stored);
    }
    return rows.sort(newestFirst);
  }

  #allocate(): Notification {
    for (let attempt = 0; attempt < NOTIFICATION_ID_ATTEMPTS; attempt += 1) {
      const notification = this.#freshNotification();
      if (!this.#notifications.has(notification)) return notification;
    }
    throw new Error("The notification identity source repeatedly returned an existing value.");
  }

  #store(record: NotificationRecord): void {
    this.#notifications.set(record.notification, { ...record, position: this.#nextPosition });
    this.#nextPosition += 1;
  }
}

**src/concepts/catalog/authenticating/authenticating.shared.ts**

import { randomBytes } from "node:crypto";

export class InvalidUsername extends Error {}
export class WeakPassword extends Error {}
export class UsernameTaken extends Error {}
export class InvalidCredentials extends Error {}

export interface PasswordCredential {
  salt: string;
  passwordVerifier: string;
}

export interface AccountRecord extends PasswordCredential {
  username: string;
}

export interface PasswordVerifierStrategy {
  create(input: { password: string; salt: string }): Promise<string>;
  verify(input: { password: string; credential: PasswordCredential | undefined }): Promise<boolean>;
  needsUpgrade(passwordVerifier: string): boolean;
}

export interface AuthenticatingDependencies {
  passwordVerifier?: PasswordVerifierStrategy;
  freshSalt?: () => string;
}

export const PASSWORD_SALT_BYTES = 16;
export const INVALID_USERNAME_DETAIL =
  "A username must contain 3 to 32 letters, numbers, underscores, or hyphens.";
export const WEAK_PASSWORD_DETAIL = "A password must contain 8 to 128 characters.";
export const USERNAME_TAKEN_DETAIL = "That username is already registered.";
export const INVALID_CREDENTIALS_DETAIL = "The username or password is incorrect.";

const USERNAME = /^[A-Za-z0-9_-]{3,32}$/;

export function validUsername(username: string): boolean {
  return USERNAME.test(username);
}

export function validPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}

export function securePasswordSalt(): string {
  return randomBytes(PASSWORD_SALT_BYTES).toString("base64url");
}

export async function passwordMatches(
  strategy: PasswordVerifierStrategy,
  account: AccountRecord | undefined,
  password: string,
): Promise<boolean> {
  const admissible = validPassword(password);
  const candidate = admissible ? account : undefined;
  const boundedPassword = password.length <= 128 ? password : password.slice(0, 128);
  const verified = await strategy.verify({ password: boundedPassword, credential: candidate });
  return account !== undefined && admissible && verified;
}

**src/concepts/catalog/sessioning/sessioning.shared.ts**

import { randomBytes } from "node:crypto";

export class InvalidSessionLifetime extends Error {}
export class UnknownSession extends Error {}

export interface SessionRecord {
  subject: string;
  expiresAt: Date;
}

export interface SessionDocument extends SessionRecord {
  sessionDigest: string;
}

export interface SessioningDependencies {
  freshSession?: () => string;
}

export const SESSION_TOKEN_BYTES = 32;
export const SESSION_TOKEN_ATTEMPTS = 32;
export const INVALID_SESSION_LIFETIME_DETAIL =
  "A session lifetime must be a positive number of milliseconds.";
export const UNKNOWN_SESSION_DETAIL = "This session is not active.";

export function secureSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

export function dateTime(value: Date): Date {
  const milliseconds = value.getTime();
  if (!Number.isFinite(milliseconds)) throw new RangeError("The supplied instant is invalid.");
  return new Date(milliseconds);
}

export function expiration(now: Date, lifetime: number): Date {
  const milliseconds = now.getTime() + lifetime;
  if (!Number.isFinite(lifetime) || lifetime <= 0 || !Number.isFinite(milliseconds)) {
    throw new InvalidSessionLifetime(INVALID_SESSION_LIFETIME_DETAIL);
  }
  const expiresAt = new Date(milliseconds);
  if (!Number.isFinite(expiresAt.getTime())) {
    throw new InvalidSessionLifetime(INVALID_SESSION_LIFETIME_DETAIL);
  }
  return expiresAt;
}

export function isActive(record: SessionRecord, now: Date): boolean {
  return record.expiresAt.getTime() > now.getTime();
}

## Existing wiring and configuration

**generated.config.ts**

import { assembleApplication } from "./src/assembly.ts";

export default {
  assemble: assembleApplication,
  title: "Application",
  design: { version: 1, documents: [] },
};

**package.json**

{
  "overrides": {
    "bson": "7.2.0"
  },
  "private": true,
  "type": "module",
  "packageManager": "bun@1.3.4",
  "dependencies": {
    "@mit-sdg/sync-engine": "1.1.0",
    "@mit-sdg/sync-engine-http": "1.1.0",
    "@node-rs/argon2": "2.0.2",
    "mongodb": "^7.9.1"
  },
  "devDependencies": {
    "@mit-sdg/sync-engine-analysis": "1.1.0",
    "@mit-sdg/sync-engine-catalog": "1.1.0",
    "@mit-sdg/sync-engine-skill": "1.2.0",
    "@types/bun": "^1.3.4",
    "@types/node": "^24.0.0",
    "typescript": ">=6 <7"
  },
  "scripts": {
    "generate": "sync-engine artifacts pin",
    "check": "sync-engine check && sync-engine artifacts check && tsc --noEmit",
    "start": "bun src/main.ts",
    "check:design": "sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md",
    "dev": "bun run db:up && bun run --parallel dev:backend dev:frontend",
    "dev:backend": "bun --watch src/main.ts",
    "dev:frontend": "bun --watch web/server.ts",
    "up": "podman compose up -d --build && bun scripts/check-api.ts http://127.0.0.1:8080 --wait",
    "down": "podman compose down",
    "logs": "podman compose logs backend frontend",
    "db:up": "podman compose up -d mongo",
    "db:shell": "podman compose exec mongo mongosh -u dev -p dev",
    "db:logs": "podman compose logs mongo",
    "db:reset": "podman compose down -v",
    "db:check": "bun scripts/check-db.ts"
  }
}

**src/assembly.ts**

import { assemble } from "@mit-sdg/sync-engine/assembly";
import { applicationConceptSet } from "./concepts.ts";

export function assembleApplication() {
  return assemble({
    conceptSet: applicationConceptSet,
    composition: {},
  });
}

**src/concepts.ts**

import { conceptSet } from "@mit-sdg/sync-engine/assembly";

export const applicationConceptSet = conceptSet({});
export const { concepts } = applicationConceptSet;

**src/main.ts**

import { assembleApplication } from "./assembly.ts";

const application = assembleApplication();
console.log(JSON.stringify(Object.keys(application.publicInterface.routes).sort()));

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

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/api/http-host.md**

# HTTP projection and hosting

`@mit-sdg/sync-engine-http` exposes an assembled application over POST/JSON. Its policy
derives CORS, request-origin checks, cookie attributes, direct GET routes, public error
mapping, and wire projection. Authentication and authorization stay in concepts and
composition.

The pinned `@mit-sdg/sync-engine-http` package is installed at the exact framework version
before HTTP work is assigned. Use that version; do not install, replace, or upgrade it. If
it is absent or incompatible, report an environment blocker. The package exposes ordinary endpoints as POST/JSON by their unchanged endpoint pathname;
policy `direct` adds only GET redirects. It does not turn arbitrary brief-selected dynamic
GET or POST paths into endpoint inputs. If an exact selected method or path cannot be
represented, report the mismatch instead of substituting another interface. Do not
implement a parallel product router, call concepts directly from the host, or copy HTTP
policy into a hand-written Fetch handler.

## Declare the boundary

Every operation remains a sync-engine `endpoint` built from `receive` and `respond`. A
direct browser GET route maps to an unchanged endpoint; the HTTP package does not replace
endpoint declarations. The approved design must first link that endpoint as a reaction
and declare its endpoint pathname:

```text
Resolving a short code [enters the application](reaction:LinkShortener.Links.Resolve).
```

```endpoints
LinkShortener.Links.Resolve at /links/resolve
```

The source declaration uses that exact final name and path:

```ts
import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { where } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const Resolve = endpoint("/links/resolve", ({ code, target }) =>
  receive({ code }).then(
    where(concepts.Links._resolve({ code }).is({ target })).then(respond({ target })),
  ),
);

export const composition = { Links: { Resolve } };
```

Assembly registers the exported group record under the linked module:

```ts
assemble({
  conceptSet: applicationConceptSet,
  instances: applicationConceptSet.implementations(),
  composition: { LinkShortener: composition },
});
```

Use the approved concepts, endpoint paths, conditions, response fields, validators, and
composition names; the example supplies API shape, not product policy. If the endpoint's
reaction link or endpoint entry is absent, stop with a design blocker before writing the
declaration.

## Define one policy and projection

Construct policy with `httpPolicy` from `@mit-sdg/sync-engine-http/policy`. Map only
caller-visible refusal codes. A browser-followed link uses `direct`; each `{name}` fills
the endpoint input, and `redirect` names an absolute-URL response field. Direct routes are
GET-only and redirect with 302.

```ts
import { httpPolicy } from "@mit-sdg/sync-engine-http/policy";

export const appHttpPolicy = httpPolicy({
  publicErrors: {
    INVALID_URL: "INVALID_REQUEST",
    NOT_FOUND: "NOT_FOUND",
  },
  direct: [{ method: "GET", path: "/go/{code}", endpoint: "/links/resolve", redirect: "target" }],
});
```

Add `httpWire` to the generated config and use the same policy at runtime:

```ts
import { httpWire } from "@mit-sdg/sync-engine-http/tooling";
import { assembleApplication } from "./src/assembly.ts";
import { appHttpPolicy } from "./src/http-policy.ts";

export default {
  assemble: assembleApplication,
  title: "Application",
  wireName: "AppWire",
  design: {
    version: 1,
    documents: [
      new URL("./design/types.md", import.meta.url),
      new URL("./design/compositions/Links.md", import.meta.url),
    ],
  },
  projections: [httpWire({ policy: appHttpPolicy, name: "AppWireHttp" })],
};
```

Run the project's generation command; never edit generated wire output.

## Bind gateway, handler, and host

Create a typed gateway from the generated wire, pass it with the same assembled
application and policy to the package handler, then give that handler to `Bun.serve`:

```ts
import { createGateway } from "@mit-sdg/sync-engine/boundary";
import { createHttpHandler } from "@mit-sdg/sync-engine-http/handler";
import type { AppWire } from "../generated/wire.ts";
import { assembleApplication } from "./assembly.ts";
import { appHttpPolicy } from "./http-policy.ts";

export function createApplicationHttpHandler() {
  const application = assembleApplication();
  const gateway = createGateway<AppWire>({ application });
  return createHttpHandler({ application, gateway, policy: appHttpPolicy });
}

export function startHost(hostname = "localhost", port = 3000) {
  return Bun.serve({ hostname, port, fetch: createApplicationHttpHandler() });
}
```

The package handler accepts POST/JSON by endpoint pathname. Without policy it emits no
CORS or cookie headers, limits bodies to 1 MiB, and maps private failures to
`INTERNAL_ERROR`. `httpPolicy` owns CORS, request-origin checks, cookie attributes,
limits, direct routes, and public error categories; do not duplicate them in host code.
Tests for an HTTP application exercise this package handler or the actual listener, not a
substitute handler with the same name.

## Relevant examples

**.sync-engine/work/matching-notifying/inputs/catalog/authenticating-registry.ts**

import { registerConcept } from "@mit-sdg/sync-engine/assembly";
import {
  InvalidCredentials,
  InvalidUsername,
  UsernameTaken,
  WeakPassword,
} from "./authenticating.shared.ts";
import spec from "./spec.md" with { type: "text" };
//#floor memory
import { AuthenticatingMemoryConcept } from "./authenticating.memory.ts";
//#endfloor

//#class memory AuthenticatingMemoryConcept
export const authenticating = registerConcept({
  class: AuthenticatingMemoryConcept, // selected-class
  spec,
  refusals: {
    INVALID_USERNAME: InvalidUsername,
    WEAK_PASSWORD: WeakPassword,
    USERNAME_TAKEN: UsernameTaken,
    INVALID_CREDENTIALS: InvalidCredentials,
  },
  floors: {
    //#floor memory
    memory: (_context: {}) => new AuthenticatingMemoryConcept(),
    //#endfloor
  },
});

**.sync-engine/work/matching-notifying/inputs/catalog/message-board.ts**

import spec from "./spec.md" with { type: "text" };
import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { each, form, former, no, now, view, where } from "@mit-sdg/sync-engine/language";
import { concepts } from "@catalog/concepts";

const { Authenticating, Commenting, Posting, Sessioning } = concepts;

const SESSION_LIFETIME_MS = 30 * 60 * 1000;

const PostTargetExists = view("the Post target exists (post)", ({ post }, _outputs, _bindings) =>
  where(Posting._get({ post })),
).holds();

const PostTargetIsMissing = view(
  "the Post target is missing (post)",
  ({ post }, _outputs, _bindings) => where(no(Posting._get({ post }))),
).holds();

const MessageBoard = former(
  "the message board",
  (_input, { post, postAuthor, content, publishedAt, comment, commentAuthor, text, addedAt }) =>
    form({
      posts: each(Posting._all({}).is({ post, author: postAuthor, content, publishedAt })).form({
        post,
        author: postAuthor,
        content,
        publishedAt,
        comments: each(
          Commenting._for({ target: post }).is({
            comment,
            author: commentAuthor,
            text,
            addedAt,
          }),
        ).form({ comment, author: commentAuthor, text, addedAt }),
      }),
    }),
);

const RegisterBoardUser = endpoint(
  "/message-board/register",
  ({ username, password, account, session, expiresAt, time }) =>
    receive({ username, password })
      .then(Authenticating.register({ username, password }).responds({ account }))
      .then(
        where(now(time)).then(
          Sessioning.start({ subject: account, lifetime: SESSION_LIFETIME_MS, now: time }).responds(
            {
              session,
              expiresAt,
            },
          ),
        ),
      )
      .then(respond({ account, session, expiresAt })),
);

const SignInBoardUser = endpoint(
  "/message-board/sign-in",
  ({ username, password, account, session, expiresAt, time }) =>
    receive({ username, password })
      .then(Authenticating.authenticate({ username, password }).responds({ account }))
      .then(
        where(now(time)).then(
          Sessioning.start({ subject: account, lifetime: SESSION_LIFETIME_MS, now: time }).responds(
            {
              session,
              expiresAt,
            },
          ),
        ),
      )
      .then(respond({ account, session, expiresAt })),
);

const CurrentBoardUser = endpoint("/message-board/current-user", ({ session, username, time }) =>
  receive({ session })
    .then(
      where(now(time)).then(
        Sessioning.current({ session, now: time }).responds({ subject: username }),
      ),
    )
    .then(respond({ username })),
);

const SignOutBoardUser = endpoint("/message-board/sign-out", ({ session, signedOut, time }) =>
  receive({ session })
    .then(
      where(now(time)).then(Sessioning.end({ session, now: time }).responds({ ended: signedOut })),
    )
    .then(respond({ signedOut })),
);

const ChangeBoardPassword = endpoint(
  "/message-board/change-password",
  ({ session, username, currentPassword, newPassword, account, time }) =>
    receive({ session, currentPassword, newPassword })
      .then(
        where(now(time)).then(
          Sessioning.current({ session, now: time }).responds({ subject: username }),
        ),
      )
      .then(
        Authenticating.changePassword({
          username,
          currentPassword,
          newPassword,
        }).responds({ account }),
      )
      .then(respond({ account })),
);

const DeleteBoardAccount = endpoint(
  "/message-board/delete-account",
  ({ session, username, password, account, time }) =>
    receive({ session, password })
      .then(
        where(now(time)).then(
          Sessioning.current({ session, now: time }).responds({ subject: username }),
        ),
      )
      .then(Authenticating.unregister({ username, password }).responds({ account }))
      .then(respond({ account })),
);

const PublishMessageBoardPost = endpoint(
  "/message-board/post",
  ({ session, author, content, time, post }) =>
    receive({ session, content })
      .then(
        where(now(time)).then(
          Sessioning.current({ session, now: time }).responds({ subject: author }),
        ),
      )
      .then(Posting.publish({ author, content, at: time }).responds({ post }))
      .then(respond({ post })),
);

const AddMessageBoardComment = endpoint(
  "/message-board/comment",
  ({ session, author, target, text, time, comment }) =>
    receive({ session, target, text })
      .then(
        where(now(time)).then(
          Sessioning.current({ session, now: time }).responds({ subject: author }),
        ),
      )
      .then(
        where(PostTargetExists({ post: target }))
          .then(Commenting.add({ target, author, text, at: time }).responds({ comment }))
          .then(respond({ comment }))
          .named("post-exists"),
        where(PostTargetIsMissing({ post: target }))
          .then(respond({ error: "POST_NOT_FOUND" }))
          .named("post-missing"),
      ),
);

const RetractMessageBoardComment = endpoint(
  "/message-board/retract-comment",
  ({ session, author, comment, time }) =>
    receive({ session, comment })
      .then(
        where(now(time)).then(
          Sessioning.current({ session, now: time }).responds({ subject: author }),
        ),
      )
      .then(Commenting.retract({ comment, author }).responds({ comment }))
      .then(respond({ comment })),
);

const ListMessageBoard = endpoint("/message-board/list", ({ session, time }) =>
  receive({ session })
    .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({})))
    .then(respond({ board: MessageBoard({}) })),
);

export { spec };

export const compositions = {
  Accounts: {
    RegisterBoardUser,
    SignInBoardUser,
    CurrentBoardUser,
    SignOutBoardUser,
    ChangeBoardPassword,
    DeleteBoardAccount,
  },
  BoardPublishing: { PublishMessageBoardPost, AddMessageBoardComment, RetractMessageBoardComment },
  BoardPages: { ListMessageBoard },
};
export const views = { PostTargetExists, PostTargetIsMissing };
export const formers = { MessageBoard };

**.sync-engine/work/matching-notifying/inputs/catalog/sessioning-registry.ts**

import { registerConcept } from "@mit-sdg/sync-engine/assembly";
import { InvalidSessionLifetime, UnknownSession } from "./sessioning.shared.ts";
import spec from "./spec.md" with { type: "text" };
//#floor memory
import { SessioningMemoryConcept } from "./sessioning.memory.ts";
//#endfloor

//#class memory SessioningMemoryConcept
export const sessioning = registerConcept({
  class: SessioningMemoryConcept, // selected-class
  spec,
  refusals: {
    INVALID_SESSION_LIFETIME: InvalidSessionLifetime,
    UNKNOWN_SESSION: UnknownSession,
  },
  floors: {
    //#floor memory
    memory: (_context: {}) => new SessioningMemoryConcept(),
    //#endfloor
  },
});

## Exact starting paths

**.sync-engine/work/matching-notifying/inputs/app-starting-paths.md**

- src/concepts.ts, src/assembly.ts, src/main.ts, generated.config.ts (existing, edit)
- src/composition.ts or src/compositions/ (create)
- src/integration.test.ts (create)
- src/concepts/*.ts and src/concepts/catalog/** (read-only concept surfaces)
- design/** (read-only)

# Result

Unless the task requests another format, return these headings in order. Omit progress narration.

- `## Status` — required. First line is exactly `Complete` or `Blocked`; explanation goes below.
- `## Changed` — required. Paths changed, or none.
- `## Checks` — required. Exact command and pass/fail outcome.
- `## Blockers` — required. Categorize as design, context, or environment.
- `## Concerns` — optional. Material non-blocking uncertainty only.

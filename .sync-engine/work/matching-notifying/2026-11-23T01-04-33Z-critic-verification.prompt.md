# Role and objective

Work unit `matching-notifying`; role `critic`; phase `verification`.

# Critic verification

Verify only the supplied finding or routed-blocker IDs against the revised candidate and their direct effects. Mark each ID resolved, unresolved, or directly regressed.

Do not restart holistic review, add unrelated findings, edit the candidate, or infer missing context.

# Access

Root: "/Users/katearima/Documents/6.104/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `work-unit:brief.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/.sync-engine/work/matching-notifying/brief.md"), `design:compositions` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/compositions"), `design:concepts` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/concepts"), `design:types.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/types.md").
- Write: none.
- Tools: `repository-read`.
- Shell: `none`; network: no; generated output: no; long-running processes: no.

Inspect only listed files or directories. In coordinator simulation, this grant binds the coordinator itself; broader coordinator access and prior discovery are unavailable to the assignment. Project checks may transitively read other project files, but do not inspect them yourself. Use supplied or task-named package-owned public documentation; do not browse package trees. Never inspect package `dist`, framework internals, caches, sibling applications, or undeclared declarations. Exclude `.git`, `.sync-engine` except this prompt, harness/skill configuration, agent traces, parent directories, and unrelated generated output. Ask for context instead of searching outside the grant. Generated files come only from granted commands. Never grantable: `git-mutation`, `dependency-installation`, `framework-internals`, `workflow-management`, `skill-cli-invocation`, `delegation-or-handoff`.

# Guidance

No additional guidance for this phase.

# Context

## Verification task

**.sync-engine/work/matching-notifying/inputs/verify-task.md**

# Verify repairs for findings F1 and F2

Verify only findings F1 and F2 from your contract review against the revised composition
files. F1 was resolved by an explicit user product decision now recorded under Active
decisions in the brief (notifications best-effort in this change); check that the
contracts state it consistently. F2: check that a missing session is refused
`UNKNOWN_SESSION` consistently in all three composition files. Report each as resolved or
unresolved, and any direct regression. Do not discover new findings.

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

## Original finding or routed blocker IDs

**.sync-engine/work/matching-notifying/inputs/original-findings.md**

F1, F2 (from the 2026-11-23T00-57-07Z critic/contracts review)

## Revised candidate context

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

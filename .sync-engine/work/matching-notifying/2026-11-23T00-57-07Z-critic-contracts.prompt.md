# Role and objective

Work unit `matching-notifying`; role `critic`; phase `contracts`.

# Contract critic

Independently review the complete changed contract set after authored syntax validation. Use the brief, affected approved contracts, and supplied decomposition as authority.

Check scope, sole mechanism ownership, opaque peer identities, action success and refusal state, repetition, lifecycle, query cardinality and ordering, authorization enforcement, effect ownership, acknowledgement order, and recoverable obligations.

Record one compact assessment row per affected obligation covering trigger, closing reaction, visible success, false interval, acknowledgement order, retry identity, whether the owner accepts that identity, recovery action, and duplicate-effect risk. Inventory selected endpoints, internal reactions, views, formers, computations, links, and endpoint paths. Check that every derived value or optional-input branch implied by the prose has exactly one declared computation and that no computation depends on concept state.

Missing authority, bypassable authorization, duplicate ownership, unrecoverable required work, or behavior required for visible success/refusal is a blocker. When the brief or decomposition requires endpoints, links, or cross-concept behavior, the absence of an application contract in supplied or granted design is a blocker. Return a `Blocked` verdict for that absence, not `Approve` with a note. Give other consequential mismatches stable material-finding IDs. Ignore naming polish, parser mechanics, implementation staging, and unrelated pre-existing issues.

Do not edit design, prescribe implementation, or infer missing context.

# Access

Root: "/Users/katearima/Documents/6.104/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `work-unit:brief.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/.sync-engine/work/matching-notifying/brief.md"), `design:compositions` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/compositions"), `design:concepts` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/concepts"), `design:types.md` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/types.md").
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

**.sync-engine/work/matching-notifying/inputs/critic-task.md**

# Contract review: MutualMatching, Notifying, accounts, matching composition

Review the changed candidate contracts as one full semantic design review against the brief
and the team's accepted prose concept design (supplied as context excerpt; it is the
product authority for MutualMatching and Notifying). Authenticating and Sessioning are
unchanged catalog contracts and are supplied for reference only.

Assess, obligation by obligation:
- every brief Requirement and Done When outcome is realized by a concept clause or a
  composition clause, with no behavior the brief excludes;
- MutualMatching and Notifying match the prose design's state, actions, preconditions,
  and query semantics (including `_getInterestedInYou` exclusions and the match invariant);
- refusal codes, repetition, lifecycle, query cardinality and ordering are fully specified;
- every endpoint resolves the session user; no caller-chosen identity; notification
  ownership refusals do not reveal another user's notifications;
- Reaction 6 and Reaction 8 semantics, acknowledgement order and failure semantics are
  stated and acceptable; deferred clauses are documented and unlinked;
- endpoint, reaction, computation and instance identities are consistent and complete.

Return stable finding IDs (F1, F2, ...) for blocker or material findings only.

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

## Changed candidate contracts

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
is gone. A missing, already ended, expired, or invented session is refused
`UNKNOWN_SESSION` with no change, so signing out twice refuses the second time. Signing out
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
[current instant](computation:currentInstant). A request without a session is refused before
any concept action, and an ended, expired, or invented session is refused `UNKNOWN_SESSION`;
both refusals change no state and act for nobody. The other person in a request is an
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

The endpoint answers whether a match was created only after the decision is recorded and
the applicable notifications have been attempted. Recording the decision and creating the
notifications belong to independent owners and are not atomic. If a `notify` step faults
after `showInterest` succeeded, the decision and any match stay recorded and are not rolled
back; the endpoint reports the fault instead of the match outcome, and for a match the
first notification may exist without the second. No retry recreates a lost notification:
repeating show interest is refused `INTEREST_ALREADY_DECIDED` or `INTEREST_ALREADY_MATCHED`,
and the interested-in-you and matches lists, which read MutualMatching directly, remain
the authoritative record of the outcome. `notify` refuses only an empty message, which the
fixed messages here never are.

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
the flow's [current instant](computation:currentInstant). A request without a session is
refused before any concept action, and an ended, expired, or invented session is refused
`UNKNOWN_SESSION`; neither changes state. Notifications are created only as consequences
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

## Affected existing contracts

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

## Additional directed context

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

- `## Verdict` — required. First line is exactly `Approve`, `Revise`, or `Blocked`.
- `## Assessments` — required. Compact obligation-by-obligation semantic assessment; do not restate contracts.
- `## Findings` — required. Stable-ID blocker or material findings, or none.

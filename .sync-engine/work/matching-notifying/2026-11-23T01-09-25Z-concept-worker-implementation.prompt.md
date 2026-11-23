# Role and objective

Work unit `matching-notifying`; role `concept-worker`; phase `implementation`.

# Concept worker

Implement and test the assigned concepts from their approved contracts. Keep each concept independent and limit changes to assigned concept and test paths. Authored design is read-only.

Honor the supplied guidance's exact query row shapes and per-action refusal codes. Concept source agreement is proved only by the project check at integration; report a wider row or different code as a design blocker, not a convenience.

Repair in-scope implementation diagnostics. Report a design blocker for required behavior absent from the contract, a context blocker for missing supplied API or project context, or an environment blocker when checks cannot run. Do not absorb composition, host, frontend, or evidence work.

# Access

Root: "/Users/katearima/Documents/6.104/Group_Project_1040". The short native message explicitly authorizes reading this prompt file; all assignment context is inline below. This is already a compiled role assignment: do not load a skill, workflow, harness guide, or another instruction file.

- Read: `application:design/concepts` ("/Users/katearima/Documents/6.104/Group_Project_1040/design/concepts"), `application:package.json` ("/Users/katearima/Documents/6.104/Group_Project_1040/package.json"), `application:src/text.d.ts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/text.d.ts"), `application:tsconfig.json` ("/Users/katearima/Documents/6.104/Group_Project_1040/tsconfig.json").
- Write: `owned-concept:src/concepts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/concepts"), `owned-test:src/concepts` ("/Users/katearima/Documents/6.104/Group_Project_1040/src/concepts").
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

**.sync-engine/work/matching-notifying/inputs/concept-task.md**

# Concept implementation: MutualMatching, Notifying, and vendored catalog auth concepts

Objective: implement and test the two approved application concepts, and vendor the two
unchanged catalog concepts, so the application worker can register all four.

1. `src/concepts/MutualMatching.ts` — class `MutualMatchingConcept` implementing
   `design/concepts/MutualMatching.md` exactly: actions `showInterest` → `{ matched }`,
   `pass` → `{}`, `unmatch` → `{}`; queries `_getInterestedInYou` → `{ from }[]`,
   `_getMatches` → `{ other }[]`, `_decision` → `{ status }[]` (zero or one row). Export one
   stable error class per refusal code (`INTEREST_IN_SELF`, `INTEREST_ALREADY_MATCHED`,
   `INTEREST_ALREADY_DECIDED`, `PASS_ON_SELF`, `PASS_ALREADY_MATCHED`,
   `PASS_AFTER_INTEREST`, `NOT_MATCHED`). User identities are opaque strings.
2. `src/concepts/Notifying.ts` — class `NotifyingConcept` implementing
   `design/concepts/Notifying.md` exactly, including its returned row shapes, refusal codes,
   ordering, and identity generation as the contract states. Export one error class per
   refusal code.
3. Vendor the supplied catalog sources unchanged (same file contents, same relative
   imports) into `src/concepts/catalog/authenticating/` (`authenticating.shared.ts`,
   `authenticating.verifier.ts`, `authenticating.memory.ts`) and
   `src/concepts/catalog/sessioning/` (`sessioning.shared.ts`, `sessioning.memory.ts`).
   Fix only relative import paths if the flattened layout requires it. Do not vendor the
   catalog `registry.ts` files; registration belongs to the application worker.
4. Tests with `bun test`: `src/concepts/MutualMatching.test.ts` and
   `src/concepts/Notifying.test.ts` covering exact result objects, every refusal (and that
   a refusal leaves state unchanged), repetition (repeat pass, repeat markAsRead/dismiss),
   the match invariant, unmatch → both PASSED and no rematch, query exclusions, empty and
   unknown cases, ordering, no-argument construction, and `Class.length === 0`.

Follow the concept implementation conventions: plain classes, one named input object per
action, `#private` helpers, explicit zero-arity constructor with defaulted parameters, no
imports of peer concepts.

Checks: `bun test src/concepts` and `bunx tsc --noEmit` must pass (the full
`bun run check` cannot pass until registration exists; do not run generation). Report a
design blocker if the contract leaves required behavior undetermined.

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

## Concept specifications

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

## Exact starting paths

**.sync-engine/work/matching-notifying/inputs/concept-starting-paths.md**

- src/concepts/ (create)
- design/concepts/MutualMatching.md, design/concepts/Notifying.md (read-only contracts)
- tsconfig.json, package.json (read-only)

## Additional directed context

**.sync-engine/work/matching-notifying/inputs/catalog/authenticating-authenticating.memory.ts**

import {
  type AccountRecord,
  type AuthenticatingDependencies,
  InvalidCredentials,
  INVALID_CREDENTIALS_DETAIL,
  InvalidUsername,
  INVALID_USERNAME_DETAIL,
  passwordMatches,
  securePasswordSalt,
  type PasswordCredential,
  type PasswordVerifierStrategy,
  UsernameTaken,
  USERNAME_TAKEN_DETAIL,
  validPassword,
  validUsername,
  WeakPassword,
  WEAK_PASSWORD_DETAIL,
} from "./authenticating.shared.ts";
import { argon2idPasswordVerifier } from "./authenticating.verifier.ts";

export class AuthenticatingMemoryConcept {
  private readonly accounts = new Map<string, AccountRecord>();
  private readonly passwordVerifier: PasswordVerifierStrategy;
  private readonly freshSalt: () => string;

  constructor({
    passwordVerifier = argon2idPasswordVerifier,
    freshSalt = securePasswordSalt,
  }: AuthenticatingDependencies = {}) {
    this.passwordVerifier = passwordVerifier;
    this.freshSalt = freshSalt;
  }

  async register({ username, password }: { username: string; password: string }) {
    if (!validUsername(username)) throw new InvalidUsername(INVALID_USERNAME_DETAIL);
    if (!validPassword(password)) throw new WeakPassword(WEAK_PASSWORD_DETAIL);
    if (this.accounts.has(username)) throw new UsernameTaken(USERNAME_TAKEN_DETAIL);

    const credential = await this.#createCredential(password);
    if (this.accounts.has(username)) throw new UsernameTaken(USERNAME_TAKEN_DETAIL);
    this.accounts.set(username, { username, ...credential });
    return { account: username };
  }

  async authenticate({ username, password }: { username: string; password: string }) {
    const account = this.accounts.get(username);
    const matches = await passwordMatches(this.passwordVerifier, account, password);
    if (account === undefined || !matches) throw new InvalidCredentials(INVALID_CREDENTIALS_DETAIL);
    await this.#upgrade(account, password);
    return { account: username };
  }

  async changePassword({
    username,
    currentPassword,
    newPassword,
  }: {
    username: string;
    currentPassword: string;
    newPassword: string;
  }) {
    if (!validPassword(newPassword)) throw new WeakPassword(WEAK_PASSWORD_DETAIL);
    const account = this.accounts.get(username);
    const matches = await passwordMatches(this.passwordVerifier, account, currentPassword);
    if (account === undefined || !matches) throw new InvalidCredentials(INVALID_CREDENTIALS_DETAIL);

    const credential = await this.#createCredential(newPassword);
    if (this.accounts.get(username) !== account) {
      throw new InvalidCredentials(INVALID_CREDENTIALS_DETAIL);
    }
    this.accounts.set(username, { username, ...credential });
    return { account: username };
  }

  async unregister({ username, password }: { username: string; password: string }) {
    const account = this.accounts.get(username);
    const matches = await passwordMatches(this.passwordVerifier, account, password);
    if (account === undefined || !matches) throw new InvalidCredentials(INVALID_CREDENTIALS_DETAIL);
    if (this.accounts.get(username) !== account) {
      throw new InvalidCredentials(INVALID_CREDENTIALS_DETAIL);
    }
    this.accounts.delete(username);
    return { account: username };
  }

  _registered({ username }: { username: string }): { registered: boolean } {
    return { registered: this.accounts.has(username) };
  }

  async #createCredential(password: string): Promise<PasswordCredential> {
    const salt = this.freshSalt();
    const passwordVerifier = await this.passwordVerifier.create({ password, salt });
    return { salt, passwordVerifier };
  }

  async #upgrade(account: AccountRecord, password: string): Promise<void> {
    if (!this.passwordVerifier.needsUpgrade(account.passwordVerifier)) return;
    const credential = await this.#createCredential(password);
    if (this.accounts.get(account.username) === account) {
      this.accounts.set(account.username, { username: account.username, ...credential });
    }
  }
}

**.sync-engine/work/matching-notifying/inputs/catalog/authenticating-authenticating.shared.ts**

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

**.sync-engine/work/matching-notifying/inputs/catalog/authenticating-authenticating.verifier.ts**

import { timingSafeEqual } from "node:crypto";
import { hash, verify, type Options } from "@node-rs/argon2";
import type { PasswordCredential, PasswordVerifierStrategy } from "./authenticating.shared.ts";

export const CURRENT_ARGON2ID_POLICY = Object.freeze({
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
  saltBytes: 16,
});

const DUMMY_PASSWORD_VERIFIER =
  "$argon2id$v=19$m=19456,t=2,p=1$paWlpaWlpaWlpaWlpaWlpQ$Qxghaea65x6Wttmctu4VDirG0PGP+PqWi93OSda9LxI";

interface ParsedVerifier {
  version: number;
  memoryCost: number;
  timeCost: number;
  parallelism: number;
  salt: Buffer;
  output: Buffer;
}

function saltBytes(salt: string): Buffer {
  if (!/^[A-Za-z0-9_-]+$/.test(salt))
    throw new Error("A password salt must use base64url encoding.");
  const decoded = Buffer.from(salt, "base64url");
  if (decoded.length < CURRENT_ARGON2ID_POLICY.saltBytes) {
    throw new Error("A password salt must contain at least 16 bytes.");
  }
  return decoded;
}

function parseVerifier(passwordVerifier: string): ParsedVerifier | undefined {
  const match =
    /^\$argon2id\$v=(\d+)\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/.exec(
      passwordVerifier,
    );
  if (match === null) return undefined;
  const [
    ,
    encodedVersion,
    encodedMemory,
    encodedTime,
    encodedParallelism,
    encodedSalt,
    encodedOutput,
  ] = match;
  const version = Number(encodedVersion);
  const memoryCost = Number(encodedMemory);
  const timeCost = Number(encodedTime);
  const parallelism = Number(encodedParallelism);
  const salt = Buffer.from(encodedSalt, "base64");
  const output = Buffer.from(encodedOutput, "base64");
  if (
    (version !== 16 && version !== 19) ||
    !Number.isSafeInteger(memoryCost) ||
    memoryCost < 8 * parallelism ||
    memoryCost > 1024 * 1024 ||
    !Number.isSafeInteger(timeCost) ||
    timeCost < 1 ||
    timeCost > 100 ||
    !Number.isSafeInteger(parallelism) ||
    parallelism < 1 ||
    parallelism > 255 ||
    salt.length < 8 ||
    output.length < 4
  ) {
    return undefined;
  }
  return { version, memoryCost, timeCost, parallelism, salt, output };
}

function currentEnough(passwordVerifier: string): boolean {
  const parsed = parseVerifier(passwordVerifier);
  return (
    parsed !== undefined &&
    parsed.version === 19 &&
    parsed.memoryCost >= CURRENT_ARGON2ID_POLICY.memoryCost &&
    parsed.timeCost >= CURRENT_ARGON2ID_POLICY.timeCost &&
    parsed.parallelism >= CURRENT_ARGON2ID_POLICY.parallelism &&
    parsed.salt.length >= CURRENT_ARGON2ID_POLICY.saltBytes &&
    parsed.output.length >= CURRENT_ARGON2ID_POLICY.outputLen
  );
}

if (!currentEnough(DUMMY_PASSWORD_VERIFIER)) {
  throw new Error("The dummy password verifier does not meet the current Argon2id policy.");
}

function matchingSalt(credential: PasswordCredential, parsed: ParsedVerifier): boolean {
  if (!/^[A-Za-z0-9_-]+$/.test(credential.salt)) return false;
  const stored = Buffer.from(credential.salt, "base64url");
  return stored.length === parsed.salt.length && timingSafeEqual(stored, parsed.salt);
}

async function verifyOrDummy(
  password: string,
  credential: PasswordCredential | undefined,
): Promise<boolean> {
  if (credential === undefined) {
    await verify(DUMMY_PASSWORD_VERIFIER, password);
    return false;
  }
  const parsed = parseVerifier(credential.passwordVerifier);
  if (parsed === undefined || !matchingSalt(credential, parsed)) {
    await verify(DUMMY_PASSWORD_VERIFIER, password);
    return false;
  }
  return verify(credential.passwordVerifier, password);
}

/**
 * The shipped strategy writes self-describing Argon2id PHC strings. Its policy is
 * implementation configuration, not part of the Authenticating specification.
 */
export const argon2idPasswordVerifier: PasswordVerifierStrategy = {
  async create({ password, salt }) {
    return hash(password, {
      algorithm: 2 as NonNullable<Options["algorithm"]>,
      version: 1 as NonNullable<Options["version"]>,
      memoryCost: CURRENT_ARGON2ID_POLICY.memoryCost,
      timeCost: CURRENT_ARGON2ID_POLICY.timeCost,
      parallelism: CURRENT_ARGON2ID_POLICY.parallelism,
      outputLen: CURRENT_ARGON2ID_POLICY.outputLen,
      salt: saltBytes(salt),
    });
  },

  async verify({ password, credential }) {
    return verifyOrDummy(password, credential);
  },

  needsUpgrade(passwordVerifier) {
    return !currentEnough(passwordVerifier);
  },
};

**.sync-engine/work/matching-notifying/inputs/catalog/sessioning-sessioning.memory.ts**

import {
  dateTime,
  expiration,
  isActive,
  secureSessionToken,
  SESSION_TOKEN_ATTEMPTS,
  UnknownSession,
  UNKNOWN_SESSION_DETAIL,
  type SessionRecord,
  type SessioningDependencies,
} from "./sessioning.shared.ts";

export class SessioningMemoryConcept {
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly freshSession: () => string;

  constructor({ freshSession = secureSessionToken }: SessioningDependencies = {}) {
    this.freshSession = freshSession;
  }

  start({ subject, lifetime, now }: { subject: string; lifetime: number; now: Date }) {
    const expiresAt = expiration(dateTime(now), lifetime);
    const session = this.#allocateSession();
    this.sessions.set(session, { subject, expiresAt });
    return { session, expiresAt: new Date(expiresAt) };
  }

  current({ session, now }: { session: string; now: Date }) {
    return { subject: this.#active(session, dateTime(now)).subject };
  }

  end({ session, now }: { session: string; now: Date }) {
    this.#active(session, dateTime(now));
    this.sessions.delete(session);
    return { ended: true };
  }

  _active({
    session,
    now,
  }: {
    session: string;
    now: Date;
  }): Array<{ subject: string; expiresAt: Date }> {
    const found = this.sessions.get(session);
    if (found === undefined || !isActive(found, dateTime(now))) return [];
    return [{ subject: found.subject, expiresAt: new Date(found.expiresAt) }];
  }

  #allocateSession(): string {
    for (let attempt = 0; attempt < SESSION_TOKEN_ATTEMPTS; attempt += 1) {
      const session = this.freshSession();
      if (!this.sessions.has(session)) return session;
    }
    throw new Error("The session token source repeatedly returned an existing bearer value.");
  }

  #active(session: string, now: Date): SessionRecord {
    const found = this.sessions.get(session);
    if (found === undefined || !isActive(found, now)) {
      throw new UnknownSession(UNKNOWN_SESSION_DETAIL);
    }
    return found;
  }
}

**.sync-engine/work/matching-notifying/inputs/catalog/sessioning-sessioning.shared.ts**

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

# Result

Unless the task requests another format, return these headings in order. Omit progress narration.

- `## Status` — required. First line is exactly `Complete` or `Blocked`; explanation goes below.
- `## Changed` — required. Paths changed, or none.
- `## Checks` — required. Exact command and pass/fail outcome.
- `## Blockers` — required. Categorize as design, context, or environment.
- `## Concerns` — optional. Material non-blocking uncertainty only.

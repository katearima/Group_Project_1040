## Verdict
Revise

The contract set covers every brief Requirement and Done When outcome on the normal path. Authorization cannot be bypassed and each effect has one owner. Two issues remain. F1 is material: the Reaction 6 and 8 notifications cannot be recovered if `notify` faults. F2 is minor: the missing-session refusal has no stated code.

## Assessments

**Scope and authority**
- MutualMatching and Notifying match the prose design's state, actions, preconditions and query semantics.
- Additions that refine the prose without contradicting it:
  - stable ordering for `_getInterestedInYou` and `_getMatches`, which the prose left unspecified;
  - `createdAt` taken as an action input;
  - the narrow `_decision` query;
  - unified not-found refusals.
- Excluded clauses are documented and left unlinked: the ProfileSetting guard, `fromName`, and Reactions 4, 5, 7, 9 and both halves of 10.
- No behavior the brief excludes is present.

**Concept checks**
- **MutualMatching**
  - Refusal ordering is coherent. The match invariant holds across `showInterest`, `pass` and `unmatch`. A PASSED decision is permanent. Concurrent requests are handled because each action checks and changes the pair atomically.
  - `_getInterestedInYou` excludes people the user passed on or is matched with, and `_getMatches` covers current matches only. Both are `many`, return no rows for an empty or unknown user, and have a stable order.
- **Notifying**
  - `markAsRead` and `dismissNotification` check the recipient atomically with the change.
  - "Not yours" and "does not exist" give the same refusal, so a caller learns nothing about other users' notifications. `READ_TARGET_DISMISSED` is only reachable by the owner.
  - Repetition rules: marking a READ notification again and dismissing twice both succeed without change. `notify` does not deduplicate, and the contract says so.
  - Both lists are newest first, ties broken by creation order. Dismissed notifications are excluded.
- **Authenticating and Sessioning:** unchanged catalog contracts, used consistently.

**Authorization**
- Every Matching and Notifications endpoint resolves the acting user only through Sessioning `current` at the flow's instant.
- The other person and the notification identity are treated as claims about what to act on, never as identity.
- A non-participant cannot unmatch, because the session user is always the `user` input.
- Each read is scoped to the session user.

**Obligation rows**
(Columns: trigger | closing reaction | visible success | false interval | retry identity | owner accepts? | recovery | duplicate risk)

- **Register:** Register endpoint | Authenticating `register` then Sessioning `start` | account, session, expiry after the session exists | account exists without a session if `start` faults | username | yes, a retry is refused `USERNAME_TAKEN` | sign in | none
- **Sign in:** SignIn endpoint | Sessioning `start` | answer after the session exists | none | none needed | n/a | sign in again | an extra session, which is harmless and documented
- **Sign out:** SignOut endpoint | Sessioning `end` | answer after the session is gone | none | session | yes, a repeat is refused `UNKNOWN_SESSION` | n/a | none
- **Show interest (decision and match):** ShowInterest endpoint | MutualMatching `showInterest` | `matched` returned after the decision is recorded | none | the ordered (from, to) pair | yes: unique from/to, a retry is refused `ALREADY_DECIDED` or `ALREADY_MATCHED` | n/a | none
- **Reaction 6 (interest notification):** `showInterest` answers `matched` = false and `_decision` from the other person is not PASSED | Notifying `notify`, synchronously before the answer | answer after the notify attempt | if `notify` faults, the decision exists with no notification and the endpoint reports a fault | none | no: `notify` does not deduplicate and a retry of show interest is refused | **none available** | none, because no retry path exists → F1
- **Reaction 8 (match notifications):** `showInterest` answers `matched` = true | two `notify` calls, session user first, then the other person | answer after both attempts | the match exists with zero or one notification | none | no | **none available** | none → F1
- **Pass:** Pass endpoint | `_decision` guard requiring INTERESTED, then MutualMatching `pass` | answer after the decision is recorded | none | the ordered pair | yes, a repeat is a no-op success | n/a | none
  - Self-pass is refused `NO_INCOMING_INTEREST` rather than `PASS_ON_SELF`. Through this endpoint, "pass after showing interest" becomes `NO_INCOMING_INTEREST` or `PASS_ALREADY_MATCHED`. Both still satisfy the brief.
  - A race between the guard read and `pass` is harmless, because an INTERESTED decision can only change by an unmatch.
- **Unmatch:** Unmatch endpoint | MutualMatching `unmatch` | answer after the change | none | the pair | yes, a repeat is refused `NOT_MATCHED` | n/a | none
- **Mark as read / Dismiss:** endpoint | the Notifying action | notification identity after the change | none | the notification | yes: marking a READ one again and dismissing twice both succeed with no change | n/a | none
- **Reads (four list endpoints):** query only, no effects, scoped to the session user, empty case and order stated.

**Inventory**
- **Instances** (`design/types.md`): Authenticating; Sessioning (Subject is Account); MutualMatching (User is Account); Notifying (User is Account).
- **Endpoints:** 12. Each has one reaction link and one matching `endpoints` entry.
  - `Accounts.Sessions.{Register, SignIn, SignOut}`
  - `Matching.Requests.{ShowInterest, Pass, Unmatch}`
  - `Matching.Reads.{InterestedInYou, Matches}`
  - `Notifications.Reads.{List, ListUnread}`
  - `Notifications.Requests.{MarkAsRead, Dismiss}`
- **Internal reactions:** none. Reactions 6 and 8 are owned by the ShowInterest endpoint reaction and are not duplicated anywhere.
- **Views and formers:** none. Reads go directly through concept queries.
- **Computations:** `currentInstant` (types.md), `sessionLifetime` (Accounts.md), `profileLink` and `matchesLink` (Matching.md). All are pure and none reads concept state.
- **Branches:** every derived value in the prose has a declared computation. No endpoint has an optional input. The branches on `_decision` read a query, not a computation.

## Findings

**F1 (material): Reaction 6/8 notifications are required by the brief but cannot be recovered after a fault.**
- If a `notify` step faults after `showInterest` succeeds, the decision or match stays recorded and the notification is lost for good. For a match, the two users can end up with only one notification between them.
- No retry identity is accepted: `notify` does not deduplicate, and repeating show interest is refused. No action exists that can recreate the lost notification.
- Matching.md states this false interval honestly, and the endpoint reports a fault rather than success.
- However, the brief makes these notifications required outcomes and nowhere accepts best-effort delivery. The contract cannot grant itself that acceptance.
- To resolve it, either:
  - the brief or user records explicitly that notifications are best-effort for this in-memory change (the fault window is effectively an internal error); or
  - the contracts provide a recovery path with an identity the owner accepts.
- This becomes a real gap when the planned Mongo persistence lands.

**F2 (minor material): the missing-session refusal has no stable code.**
- Matching.md and Notifications.md say a request with no session is "refused before any concept action" but name no code. Accounts sign-out refuses the same case with `UNKNOWN_SESSION`.
- The brief requires missing, ended, expired and invented sessions to be refused with no state change. The behavior is met, but every refusal is supposed to state a code and meaning, and the files are inconsistent with each other.
- To resolve it, give the missing-session case a code (or the same `UNKNOWN_SESSION`) consistently across all three composition files.

Everything reviewed is in /Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/, /Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/ and /Users/katearima/Documents/6.104/Group_Project_1040/design/types.md. I did not edit anything.

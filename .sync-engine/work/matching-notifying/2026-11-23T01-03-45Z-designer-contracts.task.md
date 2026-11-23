# Repair contract design for review findings F1 and F2

Apply only these repairs; change nothing else.

- F1 (resolved by product decision, now an Active decision in the brief): Reactions 6 and 8
  are best-effort in this change. In `design/compositions/Matching.md`, state that the
  notifications are best-effort by explicit product decision, keep the existing
  fault/false-interval description, and say recovery is deferred until persistence lands.
  Do not add a recovery mechanism.
- F2: give the missing-session case a stable code. A request with no session is refused
  `UNKNOWN_SESSION` with the same meaning as an ended, expired or invented session. Make
  this consistent in `design/compositions/Matching.md`, `design/compositions/Notifications.md`
  and `design/compositions/Accounts.md` (sign-out).

Rerun `bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md`
and report its output.

Original critic findings, verbatim:

F1 (material): Reaction 6/8 notifications are required by the brief but cannot be recovered after a fault. If a `notify` step faults after `showInterest` succeeds, the decision or match stays recorded and the notification is lost for good. To resolve it, either the brief or user records explicitly that notifications are best-effort for this in-memory change, or the contracts provide a recovery path with an identity the owner accepts.

F2 (minor material): the missing-session refusal has no stable code. Matching.md and Notifications.md say a request with no session is "refused before any concept action" but name no code. Accounts sign-out refuses the same case with `UNKNOWN_SESSION`. Give the missing-session case a code (or the same `UNKNOWN_SESSION`) consistently across all three composition files.

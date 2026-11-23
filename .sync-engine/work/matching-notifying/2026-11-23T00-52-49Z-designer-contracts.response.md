## Status
Complete

All eight assigned design files are written and pass `check-design`. I did not run generation or the full project check, as the assignment instructed.

## Changed
- /Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/Authenticating.md: catalog contract, copied unchanged.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/Sessioning.md: catalog contract, copied unchanged.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/MutualMatching.md
  - Decisions and Matches are `seq`s, so the `many` queries have a stable order: interested-in-you lists the earliest interest first; matches list the oldest match first.
  - `showInterest` returns `(matched: Flag)`. Refusals: `INTEREST_IN_SELF`, `INTEREST_ALREADY_MATCHED`, `INTEREST_ALREADY_DECIDED`.
  - `pass` returns `()`. Refusals: `PASS_ON_SELF`, `PASS_ALREADY_MATCHED`, `PASS_AFTER_INTEREST`. Repeating a pass succeeds without change.
  - `unmatch` returns `()` and refuses `NOT_MATCHED`. On success it removes the match and sets both decisions to PASSED.
  - Queries: `_getInterestedInYou`, `_getMatches`, plus one narrow addition, `_decision(from, to) : optional (status)`.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/concepts/Notifying.md
  - `notify(recipient, message, link, createdAt)` refuses `EMPTY_MESSAGE` and never deduplicates.
  - `markAsRead` refuses `READ_TARGET_NOT_FOUND` for both "not yours" and "does not exist", so the two look the same to a caller. It refuses `READ_TARGET_DISMISSED` only for the user's own dismissed notification.
  - `dismissNotification` refuses `DISMISS_TARGET_NOT_FOUND` in the same indistinguishable way.
  - Repeating mark-as-read or dismiss succeeds without change.
  - Both lists are newest first; equal times are ordered by most recently created.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/types.md: instances for Authenticating; Sessioning with `Subject is Authenticating.Account`; MutualMatching and Notifying with `User is Authenticating.Account`. Also the shared `currentInstant() : DateTime` computation.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Accounts.md: register, sign in and sign out (`Accounts.Sessions.*` at `/accounts/register`, `/accounts/sign-in`, `/accounts/sign-out`), and the `sessionLifetime() : Number` computation (1800000 ms). Recovery: if an account is registered but session start faults, the user signs in.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Matching.md
  - Request endpoints `Matching.Requests.ShowInterest`, `Pass`, `Unmatch` at `/matching/show-interest`, `/matching/pass`, `/matching/unmatch`.
  - Read endpoints `Matching.Reads.InterestedInYou`, `Matches` at `/matching/interested-in-you`, `/matching/matches`.
  - Computations `profileLink` (`/profile/<user>`) and `matchesLink` (`/matches`).
  - The deferred ProfileSetting, Recommending (Reactions 4, 5, 10) and Chatting (Reactions 7, 9, 10) clauses are recorded in prose, with no links.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Notifications.md: `Notifications.Reads.List`, `ListUnread` and `Notifications.Requests.MarkAsRead`, `Dismiss` at `/notifications/list`, `/notifications/unread`, `/notifications/mark-read`, `/notifications/dismiss`.

Design decisions:
- **Reactions 6 and 8:** they run inside the ShowInterest endpoint before it answers, not as separate internal reactions. The order is: resolve the session, run `showInterest`, then notify.
  - If a match was created, both users get "It's a match!" with `matchesLink`.
  - Otherwise, unless `_decision(other→user)` is PASSED, the other user gets "Someone is interested in you!" with `profileLink(user)`.
  - The endpoint answers only after the notifications have been attempted.
  - If a `notify` faults, the decision or match stays recorded and the endpoint reports the fault. Nothing recreates the lost notification. The MutualMatching lists remain the record of what happened.
- **Pass guard:** this is a composition check. It refuses `NO_INCOMING_INTEREST` unless the other user has an INTERESTED decision about the session user. Passing on yourself also hits this refusal.
- **Session check:** every matching and notification endpoint resolves the user with Sessioning `current` at the flow's instant. A missing session is refused before any action, and an inactive session is refused with `UNKNOWN_SESSION`. Neither changes state.

## Questions
None.

Points for the reviewer:
- The notification list rows include message, link, createdAt and status, not just the identity. Without this, the app would need a separate per-notification query to display each one.
- The computation inputs are typed `Authenticating.Account`. `check-design` accepts this, but the config check may want a different spelling.
- The ProfileSetting guard is deferred and there is no lookup from Account to registration. So the other user in a request is not checked against registered accounts. The composition prose states this.

## Checks
`bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md` → "Design form check passed for 8 files."

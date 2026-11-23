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

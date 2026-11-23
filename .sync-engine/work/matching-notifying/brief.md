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
- Designer/contracts (Claude Code subagent) authored 8 design files; check-design passed.
- Critic/contracts (independent subagent): Revise with F1 (unrecoverable best-effort
  notifications) and F2 (missing-session code). F1 resolved by user decision, F2 by
  designer repair; critic/verification approved.
- Concept worker: MutualMatching, Notifying and tests; vendored catalog auth sources.
  Blocked on missing `@node-rs/argon2`; user approved adding it; continuation completed
  with whitespace-empty repair (46 concept tests).
- Application worker: registration, 12 endpoints, Reactions 6/8 inside show interest,
  HTTP host, generated artifacts, 14 integration tests.
- Validation: `bun run check` pass (16 advisories), `bun test` 60 pass, live HTTP smoke
  test of register → interest → notification → match → unmatch → rematch refused.
  `work finish` ready for handback. Optional critic/implementation not run.
- Post-handback code-review fixes (coordinator, direct, not a delegated run): vendored
  catalog verifier caps concurrent Argon2id derivations at 4; vendored Sessioning memory
  store sweeps expired sessions on `start` (at most once a minute); host adds a
  path-agnostic 120-requests/minute per-client limit (429); HTTP policy caps bodies at
  16 KiB and maps PASS_ON_SELF and EMPTY_MESSAGE. Vendored catalog files are no longer
  byte-identical to the catalog. Checks: `bun run check` pass, `bun test` 64 pass, live
  429 check. Show interest on nonexistent accounts is left for the ProfileSetting guard.
- Known limits: HTTP maps domain refusal codes to categories (401/404/409/400); account
  identity is the username, so links and lists expose usernames; `currentInstant`
  computation is registered but unused (flows use framework `now`).

# Contract design: ProfileSetting, Recommending, Profiles and Recommendations compositions

Objective: author the authored contracts for this work item from the brief and the team's
accepted prose design (context excerpt: ProfileSetting §1, Recommending §2, Reactions 1–2).
The prose design is the product authority; the brief fixes scope and active decisions
(availability field, deferred hide/Reaction 3/4/5/10, best-effort refresh fan-out).

Write exactly these canonical design files:

- `design/concepts/ProfileSetting.md` — prose ProfileSetting plus `availability`. Keep its
  actions and the two named queries; add only narrow reads the compositions need (a user's
  recommendation data and role/visibility; visible users with the opposite role, stable order).
  Stable refusal codes for every precondition.
- `design/concepts/Recommending.md` — prose Recommending. The five-factor score is part of
  `refreshRecommendation`'s contract and must be stated exactly (normalization, empty-set
  rules, great-circle distance on a 6371 km sphere, zero preferred distance). Add a narrow
  pair read (status, eligible) for later guards. Stable refusal codes.
- `design/types.md` — add ProfileSetting and Recommending instances with
  `User is Authenticating.Account`; keep existing content.
- `design/compositions/Profiles.md` — create, update, set pitch, publish, read own profile
  endpoints; Reaction 1 (publish) and Reaction 2 (update, set pitch). State explicitly whether
  each refresh fan-out is a consequence of the endpoint reaction or an internal reaction, the
  ordering relative to the response, and the best-effort partial-failure behavior.
- `design/compositions/Recommendations.md` — set preferences (requires a profile; Reaction 2
  when visible), read own preferences, read own feed. List deferred integrations.

Existing `design/compositions/Matching.md`, `Accounts.md` and `Notifications.md` are read-only
patterns for style (session guard first, `UNKNOWN_SESSION`, endpoints fences, deferred list).

Acceptance: `bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md`
passes. Every refusal has a code and message; every endpoint names its path in an
`endpoints` fence under `/profiles/...` or `/recommendations/...`.

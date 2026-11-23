# Startup Matching App

Matches student founders with student builders. Built on `@mit-sdg/sync-engine` (concept
design: independent concepts wired together by declarative syncs/endpoints). 6.104 team
project; product spec in `documentation/concept-design.md`.

## Commands

```bash
bun install
bun test                 # concept unit tests + HTTP integration tests (in-memory)
bun run check            # sync-engine source/config check + artifacts check + tsc
bun run check:design     # authored design grammar check
bun run generate         # regenerate generated/ (after design, composition or HTTP policy changes)
bun run start            # HTTP host on PORT (default 8080)
```

`bun run dev`, `dev:frontend` and `up` reference `web/server.ts` and `scripts/check-api.ts`,
which do not exist yet.

## Layout

- `documentation/concept-design.md`: team's prose concept design (product authority).
- `design/`: authored sync-engine contracts, checked by the framework.
  - `concepts/<Gerund>.md`: one per concept (state, actions, refusal codes, queries).
  - `compositions/*.md`: endpoints, reactions, computations; `endpoints` fences fix paths.
  - `types.md`: instance inventory and shared computations.
- `src/concepts/*.ts`: concept classes (one per design concept) with `*.test.ts`.
- `src/concepts/catalog/`: Authenticating and Sessioning copied from `sync-engine-catalog`.
- `src/concepts.ts`: registers concepts, refusal→error-class maps, and computations.
- `src/compositions/*.ts`: endpoint/reaction code, one file per design composition.
- `src/assembly.ts`: assembly plus the HTTP policy (`appHttpPolicy`).
- `src/main.ts`: Bun host over the `@mit-sdg/sync-engine-http` handler, plus rate limiter.
- `generated/`: produced by `bun run generate`; never edit by hand.
- `.sync-engine/work/<slug>/`: sync-engine skill work items (brief, prompts, run records).

## Status (as of 2026-11-22)

Implemented: MutualMatching, Notifying, Authenticating, Sessioning. Endpoints:

- `/accounts/register`, `/accounts/sign-in`, `/accounts/sign-out`
- `/matching/show-interest`, `/matching/pass`, `/matching/unmatch`,
  `/matching/interested-in-you`, `/matching/matches`
- `/notifications/list`, `/notifications/unread`, `/notifications/mark-read`,
  `/notifications/dismiss`

All endpoints take POST JSON. Every endpoint except register and sign-in takes `session`;
the acting user always comes from the session, never from the request body.

Not yet implemented (deliberately documented as deferred in `design/compositions/Matching.md`):

- ProfileSetting, Recommending, Chatting concepts.
- The ProfileSetting guard on show interest (visible profiles, opposite roles), which will
  also stop interest in nonexistent accounts, and the sender's name in interest notifications.
- Reactions 4, 5 (Recommending), 7, 9 (Chatting) and both halves of 10.
- Persistence: all state is in memory and is lost on restart. `src/db.ts` (MongoDB) is not
  wired in.

## Conventions and decisions

- **Change design before code.** New behavior goes into `design/` first, then
  `bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md`,
  then implementation. `bun run check` enforces that code matches the contracts (action and
  query names, row shapes, refusal codes, endpoint paths, links).
- **Concepts are independent.** A concept never imports or queries another concept; only
  compositions combine them. Concept classes take one named input object per action, keep
  helpers `#private`, and have a zero-argument constructor (`Class.length === 0`).
- **Time is an input.** Concepts never read the clock; compositions bind `now(time)` once per
  flow and pass it in.
- **Hosts don't route.** Never match paths or call concepts from host code; the HTTP
  package handler and `appHttpPolicy` own routing, body limits and error mapping.
- **HTTP error categories are fixed** (`INVALID_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`,
  `NOT_FOUND`, `CONFLICT`). Map every new refusal code in `appHttpPolicy`, or it surfaces
  as an internal error. Exact codes exist only on the generated core wire (`AppWire`).
- **Framework pinned at 1.1.0** (`@mit-sdg/sync-engine`, `-http`, `-analysis`, `-catalog`)
  although the skill is 1.2.0; the team chose not to upgrade yet.
- **Vendored catalog code is application-owned and modified**: the verifier caps concurrent
  Argon2id hashing at 4, and the Sessioning memory store sweeps expired sessions on `start`.
  Don't overwrite these files from the catalog without keeping those changes.
- **Interest and match notifications are best-effort**: if a notify fails after
  `showInterest` succeeds, the decision or match stays and nothing recreates the
  notification. The Interested in You and Matches lists are the source of truth.
- Whitespace-only text counts as empty (team convention); usernames are the account
  identity, so they appear in links (`/profile/<user>`) and lists.
- The host allows 120 requests per minute per client address (429 after that) and caps
  request bodies at 16 KiB.

## Sync-engine skill workflow

Larger changes run through the `sync-engine` skill (`.claude/skills/sync-engine/`) as work
items under `.sync-engine/work/<slug>/`: brief → contract designer → independent critic →
concept worker → application worker → `sync-engine-skill work finish <slug>`.

- Finalize each run (`launch complete ... --status completed|blocked`) before preparing
  the next.
- Don't create or edit project files while a run is prepared: completion compares every
  changed path against that run's write grant.
- Record product and process decisions under "Active decisions" in the work item's
  `brief.md`.

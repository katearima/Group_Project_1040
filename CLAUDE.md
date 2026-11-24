# Startup Matching App

Matches student founders with student builders. Built on `@mit-sdg/sync-engine` (concept
design: independent concepts wired together by declarative syncs/endpoints). 6.104 team
project; product spec in `documentation/concept-design.md`.

## Commands

```bash
bun install
bun run db:up            # start MongoDB (podman compose); needed by bun test and the app
bun test                 # concept unit tests + HTTP integration tests (fresh Mongo DB per test)
bun run check            # sync-engine source/config check + artifacts check + tsc
bun run check:design     # authored design grammar check
bun run generate         # regenerate generated/ (after design, composition or HTTP policy changes)
bun run start            # API under /api, /health, and frontend/dist, on HOST:PORT (default localhost:8080)
bun run dev:frontend     # Vite dev server on :5173, proxying /api/* to the backend on :8080
bun run build            # build the frontend into frontend/dist
bun run preview          # build, then serve the whole app on :3000 the way the platform does
```

Run `bun install` in `frontend/` too. `bun run check` also type-checks the frontend
(`vue-tsc`). The platform ignores `compose.yaml`; it only provides local MongoDB (`bun run db:up`).

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
- `src/main.ts`: Bun host. `/api/*` goes to the `@mit-sdg/sync-engine-http` handler (with the
  rate limiter), `/health` answers `{ status: "ok" }` only if a MongoDB read succeeds (503 otherwise), and every other GET is served from `frontend/dist`
  with `index.html` as the fallback (`serveSite`).
- `generated/`: produced by `bun run generate`; never edit by hand.
- `frontend/`: Vue 3 + Vite app (set up after the conceptbox example). `src/api/client.ts` is
  the typed sync-engine HTTP client over `generated/wire.ts` (`AppWireHttp`), calling
  `/api/...` on the page's own origin; the dev server forwards `/api` to :8080 unchanged.
  `src/styles/tokens.css` holds the palette and fonts from `documentation/colors.png` and
  `typography.png`. Pages are in `src/views/` (Auth, Discover, Matches, Messages, Profile),
  shared pieces in `src/components/`, and state in `src/state/` (session in `localStorage`,
  hash navigation, polling, toasts). `src/api/errors.ts` maps each endpoint's HTTP error
  category to a sentence. There is no router dependency; lists refresh by polling.
- `.sync-engine/work/<slug>/`: sync-engine skill work items (brief, prompts, run records).

## Status (as of 2026-11-23)

Implemented: MutualMatching, Notifying, Authenticating, Sessioning, ProfileSetting,
Recommending, Chatting. Endpoints:

- `/accounts/register`, `/accounts/sign-in`, `/accounts/sign-out`
- `/matching/show-interest`, `/matching/pass`, `/matching/unmatch`,
  `/matching/interested-in-you`, `/matching/matches`
- `/notifications/list`, `/notifications/unread`, `/notifications/mark-read`,
  `/notifications/dismiss`
- `/profiles/create`, `/profiles/update`, `/profiles/set-pitch`, `/profiles/publish`,
  `/profiles/mine`
- `/recommendations/set-preferences`, `/recommendations/preferences`, `/recommendations/feed`
- `/chats/list`, `/chats/messages`, `/chats/send`

Reactions 1 and 2 (create/update recommendations) are internal reactions in the
`Refreshing` groups of `src/compositions/Profiles.ts` and `Recommendations.ts`; triggering
endpoints answer after the flow settles (`.afterFlowSettles()`), because an endpoint-owned
fan-out never answers when the candidate read is empty. Profiles carry an
`availability` (hours/week) field the prose design omits. Work item:
`.sync-engine/work/recommending/`.

Chatting reactions live in `Reacting` in `src/compositions/Chatting.ts`: Reaction 7 opens a
conversation when `showInterest` creates a match, Reaction 9 notifies the other participant
of a new message, and the Chatting half of Reaction 10 closes the conversation on unmatch.
The Recommending half of Reaction 10 is `Unmatching` in `src/compositions/Recommendations.ts`:
one reaction per direction marks an existing, not-yet-PASSED recommendation PASSED.
Show Interest and Unmatch answer `.afterFlowSettles()` so those reactions have run.

All endpoints take POST JSON. Every endpoint except register and sign-in takes `session`;
the acting user always comes from the session, never from the request body.

Not yet implemented (deliberately documented as deferred in `design/compositions/Matching.md`):

- The ProfileSetting guard on show interest (visible profiles, complementary roles), which will
  also stop interest in nonexistent accounts, and the sender's name in interest notifications.
- `/profiles/hide` and Reaction 3; viewing other people's profiles; See Later and Begin
  Browsing endpoints.
- Reactions 4 and 5.
- Persistence for everything except Chatting: those concepts are in memory and lose state on
  restart. Chatting stores `chatting.conversations` and `chatting.messages` in MongoDB via
  `src/db.ts`; `assembleApplication({ database })` overrides the database.

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
- **Hosts don't route endpoints.** Never match endpoint paths or call concepts from host
  code; the HTTP package handler and `appHttpPolicy` (including `basePath: "/api"`) own
  routing, body limits and error mapping. The host only separates `/api/*` from `/health`
  and the static frontend.
- **Deployment** is on mit-sdg.dev (guide: https://61040.github.io/fa26/resources/deploying-apps/):
  runtime Bun, package directories `.` and `frontend`, build script `build`, start script
  `start`, health check `/health`, MongoDB variable renamed to `MONGODB_URL`. The platform sets
  PORT and HOST and ignores compose.yaml and .env. Keep `packageManager` equal to the local
  `bun --version` (bun.lock format) and commit both lockfiles.
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
- **Composition binding bags:** every property read on a reaction/endpoint bag declares a
  fresh logic variable, so read each name once (destructure, or use `take` in
  `src/compositions/Profiles.ts`); reading the same name twice fails assembly with
  "opened and never used". Optional query-row fields need `whether(...)` to match when absent.
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

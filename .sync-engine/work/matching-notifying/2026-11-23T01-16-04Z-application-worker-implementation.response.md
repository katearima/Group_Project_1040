## Status
Complete

The design now runs end to end. All 12 linked endpoints are implemented under their exact module, group, declaration and path. They are served over HTTP with the `@mit-sdg/sync-engine-http` handler and policy. There is no hand-written router and no direct concept calls.

- **Registration:** the four concepts are registered once each, with design specs imported from `@design/concepts/*.md` and every refusal code mapped to its class. The vendored catalog memory classes are used for Authenticating and Sessioning. The four computations `currentInstant`, `sessionLifetime`, `profileLink` and `matchesLink` are registered with the concept set.
- **Session handling:** every session-taking endpoint defaults `session` to `""` in its input contract. A missing session therefore reaches `Sessioning.current` and is refused `UNKNOWN_SESSION`, the same as an invented, ended or expired one (finding F2). Identity always comes from the session's account.
- **Show interest:** after `showInterest`, three disjoint branches follow:
  - **Match:** notify the session user "It's a match!".
  - **No match, other person has not passed:** notify the other person "Someone is interested in you!" with `/profile/<user>`, then respond.
  - **No match, other person passed:** respond only.

  A second guarded stage then gives the other person their match notification before the final `respond({ matched })`. That split is needed because a computed binding does not survive past the next action, and a stage inside a branch takes only one action line. The order and best-effort semantics match the design. A failed `notify` is not caught, so the endpoint reports the fault and nothing is rolled back.
- **Pass:** guarded by `_decision(other→user)` being INTERESTED. Otherwise the endpoint answers `NO_INCOMING_INTEREST`.
- **Unmatch, lists, mark-as-read, dismiss:** forward the concept's own refusals unchanged. List rows are built with formers.
- **HTTP host:** `src/main.ts` exports `createApplicationHttpHandler()` and `startHost()`, and listens only under `import.meta.main`, on `PORT` (default 8080). The HTTP policy lives in `src/assembly.ts`, because a separate policy file was not in the write grant.

## Changed
- /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts.ts
- /Users/katearima/Documents/6.104/Group_Project_1040/src/composition.ts (new)
- /Users/katearima/Documents/6.104/Group_Project_1040/src/compositions/Accounts.ts (new)
- /Users/katearima/Documents/6.104/Group_Project_1040/src/compositions/Matching.ts (new)
- /Users/katearima/Documents/6.104/Group_Project_1040/src/compositions/Notifications.ts (new)
- /Users/katearima/Documents/6.104/Group_Project_1040/src/assembly.ts
- /Users/katearima/Documents/6.104/Group_Project_1040/src/main.ts
- /Users/katearima/Documents/6.104/Group_Project_1040/generated.config.ts (lists the 4 design documents and adds `httpWire` with `AppWireHttp`)
- /Users/katearima/Documents/6.104/Group_Project_1040/generated/wire.ts and /Users/katearima/Documents/6.104/Group_Project_1040/generated/application.md (written only by `bun run generate`)
- /Users/katearima/Documents/6.104/Group_Project_1040/src/integration.test.ts (new; 14 black-box tests through the package HTTP handler covering every Done When outcome, plus account and boundary-input cases)

## Checks
- `bun run check:design`: pass (8 files)
- `bun run generate`: pass
- `bun run check`: pass (exit 0), with 16 advisories:
  - 12 × `MISSING_ENDPOINT_FALLBACK`, one per endpoint. This is the conservative analysis the guidance describes; the HTTP tests show every path answers.
  - 4 × `ORDER_SENSITIVE_FORMER`, informational, and the list order is intended.
- `bun test`: pass (60 tests across 3 files, including the existing concept tests)

## Blockers
None.

## Concerns
- **HTTP hides the refusal codes.** `httpPolicy` only accepts fixed categories; a code mapped to itself is rejected as "unsupported category". So `UNKNOWN_SESSION` and `INVALID_CREDENTIALS` reach HTTP callers as `UNAUTHORIZED` (401). Interest, pass, `READ_TARGET_DISMISSED` and `USERNAME_TAKEN` become `CONFLICT` (409). `NOT_MATCHED` and the not-found refusals become `NOT_FOUND` (404). Invalid input becomes `INVALID_REQUEST` (400). The generated core wire (`AppWire`) still carries the exact codes. The integration tests assert the HTTP categories, and check state is unchanged, rather than the domain codes.
- **`currentInstant` is registered but never called.** It is registered only because the design checks fail with `UNRESOLVED_LINK` / `UNREGISTERED_COMPUTATION` without it. A pure no-input function cannot produce the flow's instant, so flows use the framework's `now(time)` instead, which does read once per flow as the design says. The registered body (`() => new Date()`) is impure but unused; a comment in `src/concepts.ts` says so.
- **Two show-interest paths are untested.** The "interest after the other person passed" branch cannot be reached through the public interface, because any such pair is already refused `INTEREST_ALREADY_DECIDED` or `INTEREST_ALREADY_MATCHED`. The best-effort fault path (a failing `notify`) is also untested, since nothing in the public interface can make `notify` fail.
- **The host was not started.** Long-running processes were not granted, so tests drive the package handler directly rather than a live listener.

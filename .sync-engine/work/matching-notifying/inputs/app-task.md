# Application integration: register concepts, realize compositions, host over HTTP

Objective: make the approved design executable end to end. Own registration, composition,
assembly, configuration, the HTTP host, generated artifacts, and integration tests.

1. `src/concepts.ts` — register Authenticating, Sessioning, MutualMatching and Notifying
   with their approved specs imported as text from `@design/concepts/*.md` and every
   refusal code mapped to its exported error class. Use the vendored catalog classes under
   `src/concepts/catalog/` for Authenticating and Sessioning. Register the instances exactly
   as `design/types.md` declares them, and the computations `currentInstant`,
   `sessionLifetime`, `profileLink`, `matchesLink` as declared.
2. `src/composition.ts` (and any modules it needs) — realize every endpoint linked in
   `design/compositions/Accounts.md`, `Matching.md` and `Notifications.md` with the exact
   module/group/declaration identities and endpoint paths. Show interest owns Reactions 6
   and 8 synchronously before its answer, in the stated order and with best-effort failure
   semantics. No links or behavior for the deferred clauses.
3. `src/assembly.ts` — assemble with the concept set, fresh implementations, and the
   composition.
4. `src/main.ts` — host the assembled application with `@mit-sdg/sync-engine-http`
   (already a dependency at 1.1.0); no hand-written router and no direct concept calls.
   Port from `PORT`, default 8080.
5. `generated.config.ts` — list the authored design documents; run `bun run generate`.
6. Integration tests (`src/integration.test.ts` or similar, `bun test`) driving the
   assembled application through its public interface for every brief Done When outcome:
   A→B interest notifies B and lists A in B's interested-in-you; mutual interest matches
   and notifies both and removes A from interested-in-you; repeated/self interest and
   missing/invalid session refused with no state change; pass on incoming interest removes
   it with no notification to A; unmatch → both decisions PASSED, rematch refused,
   non-participant cannot unmatch; mark-as-read/dismiss only on own notifications, dismissed
   leave both lists, interest/match unaffected; sign-out ends the session.

Checks: `bun run check:design`, `bun run generate`, `bun run check`, `bun test` must pass.
Do not edit design or concept implementations; report a design blocker if a declaration is
missing or the contracts cannot be realized as written. `src/db.ts` and the Mongo setup
stay untouched (in-memory state for this change).

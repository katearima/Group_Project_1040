# Tests

`bun run db:up` (local MongoDB), then `bun test`. `bun run test:save` re-saves the summary to
[`output.txt`](output.txt). Last run: 166 pass, 0 fail, 11 files, with `bun run check` passing.

Where the tests live (they sit next to the code, in `src/`):

- **Concept tests** (`src/concepts/*.test.ts`): each concept's actions, including refusals.
  Chatting uses a fresh MongoDB database per test.
- **Integration tests** (`src/integration.test.ts`, `src/recommendations.integration.test.ts`,
  `src/chatting.integration.test.ts`, `src/main.test.ts`): HTTP requests through the real
  handler, covering sign-in, profile, matching, notifications, recommendations and chat flows,
  plus the host (`/health`, static serving, rate limit).

Limitations:

- No frontend tests yet; the UI is not covered.
- Persistence is tested by a restart test (`src/persistence.test.ts`) that reassembles the app over the same database. Snapshots are queued writes, so a hard crash can lose the last changes.
- Runs are local only; the deployed app has not been tested automatically.
- Authenticating has no unit tests of its own (vendored from the catalog); it is exercised through the integration tests.

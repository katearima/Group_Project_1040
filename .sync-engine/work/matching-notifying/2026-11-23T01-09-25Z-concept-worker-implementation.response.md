## Status
Blocked

I implemented MutualMatching and Notifying to their approved contracts, with tests, and vendored the five catalog files unchanged. `bun test src/concepts` passes. `bunx tsc --noEmit` fails on exactly one error: the vendored catalog verifier imports `@node-rs/argon2`, and the project does not declare that package. Adding a dependency is never grantable to this role, so this needs the coordinator or the user.

## Changed
- /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/MutualMatching.ts
  - Class `MutualMatchingConcept`.
  - Actions: `showInterest` returns `{ matched }`; `pass` and `unmatch` return `{}`.
  - Queries: `_getInterestedInYou` returns `{ from }[]`, `_getMatches` returns `{ other }[]`, `_decision` returns `{ status }[]` with zero or one row.
  - One error class per refusal: `InterestInSelf`, `InterestAlreadyMatched`, `InterestAlreadyDecided`, `PassOnSelf`, `PassAlreadyMatched`, `PassAfterInterest`, `NotMatched`. Each carries the contract's message, and the message strings are exported as `*_DETAIL` constants.
  - Class names follow the catalog convention: PascalCase of the code, as in `UnknownSession` for `UNKNOWN_SESSION`.
  - The constructor's optional `{ decisions, matches }` defaults to `{}`, so runtime arity is 0.
- /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/Notifying.ts
  - Class `NotifyingConcept`.
  - Actions: `notify`, `markAsRead` and `dismissNotification` each return `{ notification }`.
  - Queries: `_getNotifications` returns `{ notification, message, link, createdAt, status }[]`; `_getUnreadNotifications` returns `{ notification, message, link, createdAt }[]`.
  - Both queries sort newest `createdAt` first, and break ties by creation order, newest first.
  - Error classes: `EmptyMessage`, `ReadTargetNotFound`, `ReadTargetDismissed`, `DismissTargetNotFound`.
  - Notification ids are opaque strings from `node:crypto` `randomUUID`. The source can be swapped through the constructor's `{ freshNotification, initial }` option, which defaults to `{}`, so runtime arity is 0. Ids are retried if they collide.
  - The concept never reads a clock. `createdAt` Dates are copied on the way in and on the way out.
- /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/MutualMatching.test.ts
- /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/Notifying.test.ts
  - Together they cover:
    - exact result objects and the operational principles
    - every refusal, each followed by a snapshot check that state is unchanged
    - repeated pass, repeated markAsRead and repeated dismiss
    - the match invariant
    - unmatch, after which both decisions are PASSED and the pair cannot match again
    - the interested-in-you exclusions
    - empty and unknown users
    - ordering, including ties on equal `createdAt`
    - "not yours" and "does not exist" giving the same refusal
    - exact row keys, and that only declared methods are on the prototype
    - no-argument construction and `Class.length === 0`
- Vendored from the inline catalog sources in the prompt, contents and relative imports unchanged (the layout needed no import fixes):
  - /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/catalog/authenticating/authenticating.shared.ts
  - /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/catalog/authenticating/authenticating.verifier.ts
  - /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/catalog/authenticating/authenticating.memory.ts
  - /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/catalog/sessioning/sessioning.shared.ts
  - /Users/katearima/Documents/6.104/Group_Project_1040/src/concepts/catalog/sessioning/sessioning.memory.ts

## Checks
- `bun test src/concepts`: pass (45 tests, 0 failures, 170 expect calls).
- `bunx tsc --noEmit`: fail, with one error:
  `src/concepts/catalog/authenticating/authenticating.verifier.ts(2,44): error TS2307: Cannot find module '@node-rs/argon2' or its corresponding type declarations.`
  The MutualMatching and Notifying files and tests type-check cleanly.

## Blockers
- Context blocker: the vendored `authenticating.verifier.ts` imports `@node-rs/argon2`, but `package.json` does not declare it. It is not in `dependencies`, and the only catalog package listed is `@mit-sdg/sync-engine-catalog` 1.1.0, as a dev dependency. Editing the vendored file would break the "unchanged" requirement, and installing a dependency is outside this role.
- Needed: someone with dependency-installation authority adds `@node-rs/argon2` as a runtime dependency (at the version the catalog expects) and installs it. After that, `bunx tsc --noEmit` should pass with no change to concept code. Alternatively, the coordinator can decide on another catalog wiring.

## Concerns
- Neither contract defines identity generation in more detail than "a new Notification". I chose opaque `randomUUID` strings, and tests inject a deterministic source.
- An empty message means a zero-length string, exactly as the contract says. A whitespace-only message is accepted.
- The optional seed state accepted by both constructors is not checked against the contract's invariants. The defaults are empty, and production registration should construct the concepts with no arguments.

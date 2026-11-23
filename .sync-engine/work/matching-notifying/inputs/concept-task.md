# Concept implementation: MutualMatching, Notifying, and vendored catalog auth concepts

Objective: implement and test the two approved application concepts, and vendor the two
unchanged catalog concepts, so the application worker can register all four.

1. `src/concepts/MutualMatching.ts` — class `MutualMatchingConcept` implementing
   `design/concepts/MutualMatching.md` exactly: actions `showInterest` → `{ matched }`,
   `pass` → `{}`, `unmatch` → `{}`; queries `_getInterestedInYou` → `{ from }[]`,
   `_getMatches` → `{ other }[]`, `_decision` → `{ status }[]` (zero or one row). Export one
   stable error class per refusal code (`INTEREST_IN_SELF`, `INTEREST_ALREADY_MATCHED`,
   `INTEREST_ALREADY_DECIDED`, `PASS_ON_SELF`, `PASS_ALREADY_MATCHED`,
   `PASS_AFTER_INTEREST`, `NOT_MATCHED`). User identities are opaque strings.
2. `src/concepts/Notifying.ts` — class `NotifyingConcept` implementing
   `design/concepts/Notifying.md` exactly, including its returned row shapes, refusal codes,
   ordering, and identity generation as the contract states. Export one error class per
   refusal code.
3. Vendor the supplied catalog sources unchanged (same file contents, same relative
   imports) into `src/concepts/catalog/authenticating/` (`authenticating.shared.ts`,
   `authenticating.verifier.ts`, `authenticating.memory.ts`) and
   `src/concepts/catalog/sessioning/` (`sessioning.shared.ts`, `sessioning.memory.ts`).
   Fix only relative import paths if the flattened layout requires it. Do not vendor the
   catalog `registry.ts` files; registration belongs to the application worker.
4. Tests with `bun test`: `src/concepts/MutualMatching.test.ts` and
   `src/concepts/Notifying.test.ts` covering exact result objects, every refusal (and that
   a refusal leaves state unchanged), repetition (repeat pass, repeat markAsRead/dismiss),
   the match invariant, unmatch → both PASSED and no rematch, query exclusions, empty and
   unknown cases, ordering, no-argument construction, and `Class.length === 0`.

Follow the concept implementation conventions: plain classes, one named input object per
action, `#private` helpers, explicit zero-arity constructor with defaulted parameters, no
imports of peer concepts.

Checks: `bun test src/concepts` and `bunx tsc --noEmit` must pass (the full
`bun run check` cannot pass until registration exists; do not run generation). Report a
design blocker if the contract leaves required behavior undetermined.

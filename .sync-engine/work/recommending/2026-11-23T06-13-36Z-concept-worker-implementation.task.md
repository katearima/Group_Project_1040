# Concept implementation: ProfileSetting and Recommending

Implement `src/concepts/ProfileSetting.ts` and `src/concepts/Recommending.ts` as plain
classes exactly matching the approved contracts, with `ProfileSetting.test.ts` and
`Recommending.test.ts`. Follow `src/concepts/MutualMatching.ts` style: exported row types,
one error class and detail constant per refusal code, zero-arity constructor with optional
initial state, `#private` helpers, no clock reads, no peer imports. `Entries` is `string[]`;
`User` is `string`. Optional numeric inputs may arrive as `undefined` or `null`; both mean
omitted. Whitespace-only text counts as empty.

Tests: exact result objects; every refusal leaves state unchanged; repetition; query
cardinality and order; each score factor including the prose example (1, 0.5, 1, 1, 0.5 →
0.8), normalization and duplicate entries, zero preferred distance, great-circle distance;
refresh preserves status and re-enables eligibility; feed filtering/order;
`Class.length === 0`.

Checks: `bun test src/concepts` and `bunx tsc --noEmit` pass.

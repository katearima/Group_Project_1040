# Application integration: Profiles and Recommendations

Register ProfileSetting and Recommending in `src/concepts.ts` (refusal maps for every code,
plus the `numberSupplied` computation), add `src/compositions/Profiles.ts` and
`src/compositions/Recommendations.ts` realizing exactly the linked endpoints, add them to
`src/composition.ts` and `generated.config.ts`, map every new refusal code and the
composition-level `NO_PROFILE` and `PREFERENCES_NEED_PROFILE` in `appHttpPolicy`, run
`bun run generate`, and add HTTP integration tests in
`src/recommendations.integration.test.ts` covering the brief's Done-when outcomes.

The recommendation refresh (publish, update, set pitch, set preferences) runs inside each
endpoint reaction after the triggering action, only when a fresh `_recommendationData` read
shows the profile visible, calling `refreshRecommendation` in both directions for every
`_visibleCandidates` row, and answers only after all refreshes. A hidden profile or no
candidates still answers success. Follow `src/compositions/Matching.ts` style (session via
`Sessioning.current` with `now(time)`, `defaults: { session: "" }`).

Checks: `bun run generate`, `bun run check`, `bun test`.

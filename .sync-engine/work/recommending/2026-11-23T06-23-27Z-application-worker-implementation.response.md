## Status

Complete

Integrated ProfileSetting and Recommending after the B1 design repair.

- `src/concepts.ts`: both concepts registered with every refusal code; `numberSupplied`
  computation added.
- `src/compositions/Profiles.ts`: create, update, set pitch, publish, mine endpoints; the
  three ProfileSetting-triggered refresh reactions (Refreshing group) built by one
  `refreshAfter` factory. Triggering endpoints answer after the flow settles.
- `src/compositions/Recommendations.ts`: set preferences (four disjoint `numberSupplied`
  branches plus the no-profile refusal; the settled answer is guarded to stay disjoint),
  preferences read (optional numbers via `whether`, defaults when none saved), feed read, and
  the setPreferences-triggered refresh reaction.
- `src/assembly.ts`: all new refusal codes plus `NO_PROFILE` and `PREFERENCES_NEED_PROFILE`
  mapped.
- Binding-bag note: every bag property read declares a fresh logic variable, so each
  composition reads its variables once through a `take` helper.

## Changed

- src/concepts.ts, src/composition.ts, src/assembly.ts, generated.config.ts, generated/
- src/compositions/Profiles.ts, src/compositions/Recommendations.ts
- src/recommendations.integration.test.ts

## Questions

None.

## Checks

- `bun run generate`: pass.
- `bun run check`: pass (25 advisories; the new ones are MISSING_ENDPOINT_FALLBACK on the
  eight new endpoints, the same conservative class the existing endpoints report; integration
  tests are the boundary evidence).
- `bun test`: 133 pass, 0 fail (15 new integration tests).

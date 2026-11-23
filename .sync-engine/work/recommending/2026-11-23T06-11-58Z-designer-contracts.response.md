## Status

Complete

Repaired F1–F6:

- F1: Recommendations.md states the refresh runs inside the set-preferences endpoint reaction
  after `setPreferences`, re-reading `_recommendationData` instead of reusing the guard read.
- F2: `numberSupplied(value?: Number)`; applied once each to distance and availability, each
  passed only when its flag is true; the three lists are required and may be empty.
- F3: `Entries` defined identically in both concepts as a finite list of text entries exactly
  as supplied; ProfileSetting refuses entries empty after trimming and stores them as
  supplied (Recommending likewise for preferred entries); Profiles.md states lists pass
  through unchanged.
- F4: Profiles.md documents stale-until-next-refresh under interleaved flows as an accepted
  deviation (recorded in the brief).
- F5: university factor compares trimmed, case-insensitive.
- F6: retry sentence covers set pitch and set preferences.

## Changed

- design/concepts/ProfileSetting.md
- design/concepts/Recommending.md
- design/compositions/Profiles.md
- design/compositions/Recommendations.md

## Questions

None.

## Checks

- `bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md`: passed for 12 files.

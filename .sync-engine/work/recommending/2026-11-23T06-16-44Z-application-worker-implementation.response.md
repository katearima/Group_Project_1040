## Status

Blocked

Design blocker B1: the approved compositions make the recommendation refresh part of each
endpoint reaction ("no separate internal reaction"). That is not realizable: the fan-out
stage reads `_visibleCandidates`, which yields zero rows for a hidden profile or when no
opposite-role profile is visible, and a stage with zero rows never reaches the endpoint's
answer (publish with no candidates hung until timeout). Nested branch chains cannot carry
`afterFlowSettles`, and a sibling answer branch would overlap the refresh branch.

The realizable shape (implemented and exercised locally) is one internal reaction per
trigger — `ProfileSetting.publishProfile`, `updateProfile`, `setStartupPitch`, and
`Recommending.setPreferences` succeeding — that performs both refresh directions, while each
endpoint answers only after the flow settles, so acknowledgement still follows every
refresh. Needed design links: `reaction:Profiles.Refreshing.RefreshOnPublish`,
`reaction:Profiles.Refreshing.RefreshOnUpdate`, `reaction:Profiles.Refreshing.RefreshOnPitch`,
`reaction:Recommendations.Refreshing.RefreshOnPreferences`.

`bun run generate` reports exactly those four MISSING_COVERAGE items; everything else
assembles. Local HTTP probe: feeds, scores, preference reads, refusals, and session checks
behave as designed.

## Changed

- src/concepts.ts, src/composition.ts, src/assembly.ts, generated.config.ts
- src/compositions/Profiles.ts, src/compositions/Recommendations.ts (new)

## Questions

None.

## Checks

- `bunx tsc --noEmit`: clean.
- `bun run generate`: 4 MISSING_COVERAGE (design blocker B1).

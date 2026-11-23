# Role and objective

Continue work unit `recommending`; role `designer`; phase `contracts`. The prior same-phase role contract remains authoritative.

# Access

This grant replaces prior access; other rules remain.

Current grant:

```json
{"readableAreas":[{"area":"work-unit","path":"brief.md"},{"area":"design","path":"compositions/Accounts.md"},{"area":"design","path":"compositions/Matching.md"},{"area":"design","path":"compositions/Notifications.md"}],"writableAreas":[{"area":"assigned-design","path":"compositions/Profiles.md"},{"area":"assigned-design","path":"compositions/Recommendations.md"},{"area":"assigned-design","path":"concepts/ProfileSetting.md"},{"area":"assigned-design","path":"concepts/Recommending.md"},{"area":"assigned-design","path":"types.md"}],"toolKinds":["repository-read","repository-write"],"projectShell":"project-validation","network":false,"generatedOutput":false,"longRunningProcesses":false}
```

# Guidance

Unchanged from the prior same-agent context. Apply it to the task and changed context below.

# Context

## Task

**.sync-engine/work/recommending/inputs/designer-repair2-task.md**

# Contract repair for implementation blocker B1

The application worker reports blocker B1 (supplied as context): an endpoint-owned refresh
fan-out cannot answer when the candidate read is empty. Repair Profiles.md and
Recommendations.md only:

- The refresh for Reactions 1 and 2 is owned by four internal reactions, each linked:
  `reaction:Profiles.Refreshing.RefreshOnPublish`, `reaction:Profiles.Refreshing.RefreshOnUpdate`,
  `reaction:Profiles.Refreshing.RefreshOnPitch`, and
  `reaction:Recommendations.Refreshing.RefreshOnPreferences`, triggered by the successful
  ProfileSetting `publishProfile`, `updateProfile`, `setStartupPitch`, and Recommending
  `setPreferences` actions respectively.
- Each reaction reads `_recommendationData` fresh after its trigger and refreshes only while
  visible; otherwise the refresh behavior, ordering, best-effort failure, and concurrency
  text stay as approved.
- Each triggering endpoint answers only after the flow settles, i.e. after every refresh
  the change caused has completed; the set-preferences answer stays disjoint from
  `PREFERENCES_NEED_PROFILE`.

Change nothing else. Run check-design on all design files.

## Brief

**.sync-engine/work/recommending/brief.md**

Unchanged from the prior same-agent context.

## Additional directed context

**.sync-engine/work/recommending/2026-11-23T06-16-44Z-application-worker-implementation.response.md**

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

# Result

Unless the task requests another format, use these prior fields: `## Status`, `## Changed`, `## Questions`, `## Checks` (optional).

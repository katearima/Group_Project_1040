## Status

Complete

Resolved blocker B1. Profiles.md and Recommendations.md now assign the refresh to four linked
internal reactions (`Profiles.Refreshing.RefreshOnPublish`, `RefreshOnUpdate`,
`RefreshOnPitch`, `Recommendations.Refreshing.RefreshOnPreferences`), each triggered by the
successful action and reading `_recommendationData` fresh. Each triggering endpoint answers
only after its flow settles, including when there is nothing to refresh; the set-preferences
success answer is disjoint from `PREFERENCES_NEED_PROFILE`. Refresh content, ordering,
best-effort failure, and concurrency text are unchanged.

## Changed

- design/compositions/Profiles.md
- design/compositions/Recommendations.md

## Questions

None.

## Checks

- `bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md`: passed for 12 files.

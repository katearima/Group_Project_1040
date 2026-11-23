# Continue application integration after B1 resolution

Design now links the four internal refresh reactions (Profiles.Refreshing.RefreshOnPublish,
RefreshOnUpdate, RefreshOnPitch; Recommendations.Refreshing.RefreshOnPreferences) and has
triggering endpoints answer after the flow settles. Finish the original task: run
`bun run generate`, `bun run check`, add `src/recommendations.integration.test.ts` covering
the brief's Done-when outcomes, and run `bun test`.

# Role and objective

Continue work unit `matching-notifying`; role `concept-worker`; phase `implementation`. The prior same-phase role contract remains authoritative.

# Access

This grant replaces prior access; other rules remain.

Current grant:

```json
{"readableAreas":[{"area":"application","path":"design/concepts"},{"area":"application","path":"package.json"},{"area":"application","path":"src/text.d.ts"},{"area":"application","path":"tsconfig.json"}],"writableAreas":[{"area":"owned-concept","path":"src/concepts"},{"area":"owned-test","path":"src/concepts"}],"toolKinds":["repository-read","repository-write"],"projectShell":"project-local","network":false,"generatedOutput":false,"longRunningProcesses":false}
```

# Guidance

Unchanged from the prior same-agent context. Apply it to the task and changed context below.

# Context

## Task

**.sync-engine/work/matching-notifying/inputs/concept-continue-task.md**

# Continue: blocker resolved, finish and re-verify

The context blocker is resolved: `@node-rs/argon2` 2.0.2 (the version the catalog pins) is
now an exact runtime dependency and installed. `bunx tsc --noEmit` should pass without any
change to the vendored files.

One implementation repair: the team's product design states that text containing only
spaces counts as empty. Make Notifying `notify` refuse `EMPTY_MESSAGE` for a message that is
empty after trimming whitespace, and add a test for it. No other changes.

Rerun `bun test src/concepts` and `bunx tsc --noEmit` and report both outcomes.

## Brief

**.sync-engine/work/matching-notifying/brief.md**

Unchanged from the prior same-agent context.

## Concept specifications

**design/concepts/MutualMatching.md**

Unchanged from the prior same-agent context.

**design/concepts/Notifying.md**

Unchanged from the prior same-agent context.

## Exact starting paths

**.sync-engine/work/matching-notifying/inputs/concept-starting-paths.md**

- src/concepts/ (create)
- design/concepts/MutualMatching.md, design/concepts/Notifying.md (read-only contracts)
- tsconfig.json, package.json (read-only)

# Result

Unless the task requests another format, use these prior fields: `## Status`, `## Changed`, `## Checks`, `## Blockers`, `## Concerns` (optional).

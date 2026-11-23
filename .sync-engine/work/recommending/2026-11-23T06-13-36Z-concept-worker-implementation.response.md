## Status

Complete

Implemented ProfileSetting and Recommending exactly as contracted, with unit tests.

- `Entries` is `string[]`; `User` is `string`; Profile identities come from an injectable
  `freshProfile` (default `randomUUID`), following Notifying.
- Optional preference numbers treat `undefined` and `null` as omitted.
- `_getFeed` sorts stably, so equal scores keep creation order.
- `greatCircleKm` is a module-level export (not on the prototype) for tests.

## Changed

- src/concepts/ProfileSetting.ts, src/concepts/ProfileSetting.test.ts
- src/concepts/Recommending.ts, src/concepts/Recommending.test.ts

## Questions

None.

## Checks

- `bun test src/concepts`: 102 pass, 0 fail.
- `bunx tsc --noEmit`: clean.

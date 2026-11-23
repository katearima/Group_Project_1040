# Role and objective

Continue work unit `recommending`; role `critic`; phase `verification`. The prior same-phase role contract remains authoritative.

# Access

This grant replaces prior access; other rules remain.

Current grant:

```json
{"readableAreas":[{"area":"work-unit","path":"brief.md"},{"area":"design","path":"compositions/Matching.md"},{"area":"design","path":"compositions/Profiles.md"},{"area":"design","path":"compositions/Recommendations.md"},{"area":"design","path":"concepts/ProfileSetting.md"},{"area":"design","path":"concepts/Recommending.md"},{"area":"design","path":"types.md"}],"writableAreas":[],"toolKinds":["repository-read"],"projectShell":"none","network":false,"generatedOutput":false,"longRunningProcesses":false}
```

# Guidance

Unchanged from the prior same-agent context. Apply it to the task and changed context below.

# Context

## Verification task

**.sync-engine/work/recommending/inputs/verify2-task.md**

# Verify repair for routed implementation blocker B1

Verify only routed blocker B1 (the application worker's report, supplied as original
findings) against the repaired Profiles.md and Recommendations.md: the refresh moved from
the endpoint reactions to four linked internal reactions; endpoints answer after the flow
settles. Confirm the approved refresh behavior, acknowledgement order, failure and
concurrency semantics are preserved and that no effect is owned twice. Do not raise new
findings. Return a Verdict of Approve, Revise, or Blocked with one line for B1.

## Brief

**.sync-engine/work/recommending/brief.md**

Unchanged from the prior same-agent context.

## Original finding or routed blocker IDs

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

## Revised candidate context

**design/compositions/Profiles.md**

# Profiles

Signed-in users create, edit, and publish their own profile. Every endpoint first calls
Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any profile or recommendation action,
without changing state. The session user is always the profile owner; a request never
names whose profile it changes.

ProfileSetting checks and changes each profile atomically and owns every validation and
publication rule. The composition forwards its refusals without separate checks.

## Recommendation refresh

Publishing (Reaction 1), updating a profile, and setting a startup pitch (Reaction 2) each
cause the same recommendation refresh, owned by one internal reaction per trigger: a
successful ProfileSetting `publishProfile` [refreshes the user's recommendations](reaction:Profiles.Refreshing.RefreshOnPublish),
as do a successful `updateProfile` [after an update](reaction:Profiles.Refreshing.RefreshOnUpdate)
and a successful `setStartupPitch` [after a new pitch](reaction:Profiles.Refreshing.RefreshOnPitch).
Recommendations triggers the same refresh after saved preferences. A refused action
triggers nothing. After its trigger, the reaction reads ProfileSetting
`_recommendationData` for that user fresh. Only when that profile is
visible does it read ProfileSetting `_visibleCandidates` for the session user: every
visible profile with the opposite role, oldest first. For each candidate it calls
Recommending `refreshRecommendation` twice, once with the session user as viewer and once
with the candidate as viewer, each time passing the viewer's data first and the
candidate's data second. Recommending scores the pair from that data and its own stored
preferences, creating an AVAILABLE recommendation or updating the score while keeping an
existing status.

Each triggering endpoint answers only after its flow settles, that is, after every refresh
the change caused has completed, including when there is nothing to refresh. A hidden profile refreshes
nothing; its changes take effect when it is next published. Same-role users never receive
recommendations for each other because `_visibleCandidates` returns only the opposite role.
Profile data that ProfileSetting accepted is always valid recommendation data, and the
candidates exclude the session user, so the refreshes are not expected to refuse.

Skills and interests lists travel unchanged: the endpoints pass the request lists to
ProfileSetting as supplied, and the refresh passes the lists returned by ProfileSetting
queries to Recommending as returned.

Refreshes for different pairs are separate Recommending actions and are not atomic with
the profile change or with each other. If a refresh faults, the endpoint reports the fault;
the profile change and any refreshes already made remain. Retrying the same request is safe
for publish (publishing a visible profile succeeds again), updates and set pitch (the same
values are written again), and set preferences (see Recommendations), and any later
publish, update, pitch, or preference change recomputes every pair of that user.

Flows for different users are not serialized against each other. When two users' changes
interleave, a pair's score can be computed from the other user's slightly older data and
stays stale until either user's next publish, update, pitch, or preference change refreshes
that pair. Statuses are never affected. This is an accepted deviation from the prose
design's rule that reactions finish before the next request involving the same users.

## Create profile

A signed-in user may [create their profile](reaction:Profiles.Requests.Create) with a
role, name, university, major, graduation year, skills, experience, interests, location
with latitude and longitude, and weekly availability. ProfileSetting `createProfile`
refuses a second profile (`PROFILE_ALREADY_EXISTS`) and invalid data (`INVALID_PROFILE`).
On success the profile is hidden, has no startup pitch, and the endpoint returns its
identity. No recommendations are created until it is published.

```endpoints
Profiles.Requests.Create at /profiles/create
```

## Update profile

A signed-in user may [update their profile](reaction:Profiles.Requests.Update), supplying
every editable field. ProfileSetting `updateProfile` refuses a missing profile
(`UPDATE_PROFILE_NOT_FOUND`), invalid data (`INVALID_PROFILE_UPDATE`), and changes that
would leave a visible profile incomplete (`UPDATE_WOULD_UNPUBLISH`). Refusals change
nothing and refresh nothing. On success the role, startup pitch, and visibility are
unchanged, the recommendation refresh runs, and the endpoint returns success.

```endpoints
Profiles.Requests.Update at /profiles/update
```

## Set startup pitch

A signed-in founder may [set their startup pitch](reaction:Profiles.Requests.SetPitch).
ProfileSetting `setStartupPitch` refuses a missing profile (`PITCH_PROFILE_NOT_FOUND`), a
builder (`PITCH_NOT_FOUNDER`), and an empty pitch (`EMPTY_PITCH`). On success the
recommendation refresh runs and the endpoint returns success. Pitch text adds no points to
any score.

```endpoints
Profiles.Requests.SetPitch at /profiles/set-pitch
```

## Publish profile

A signed-in user may [publish their profile](reaction:Profiles.Requests.Publish).
ProfileSetting `publishProfile` refuses a missing profile (`PUBLISH_PROFILE_NOT_FOUND`)
and an incomplete one (`PROFILE_INCOMPLETE`) without changes. On success the profile is
visible, the recommendation refresh runs (Reaction 1), and the endpoint returns success.
Publishing an already visible profile succeeds again and refreshes again. Publishing a
previously hidden profile keeps every earlier recommendation status.

```endpoints
Profiles.Requests.Publish at /profiles/publish
```

## Read own profile

A signed-in user may [read their own profile](reaction:Profiles.Reads.Mine). ProfileSetting
`_getProfile` supplies every field, including the coordinates, which only the owner sees.
When the session user has no profile, the endpoint returns `NO_PROFILE`. Reading changes
no state. Reading other people's profiles is deferred.

```endpoints
Profiles.Reads.Mine at /profiles/mine
```

## Deferred

- Hiding a profile and Reaction 3 (deactivating its recommendations). ProfileSetting
  `hideProfile` exists, but no endpoint calls it, so a published profile stays visible.
- Viewing another person's visible or matched profile.
- The ProfileSetting guard on Show Interest and the sender's name in interest
  notifications (see Matching).

**design/compositions/Recommendations.md**

# Recommendations

Signed-in users set their matching preferences and read their ranked feed. Every endpoint
first calls Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any read or change, without changing state.
Preferences and feeds belong only to the session user.

Recommendations are created and recalculated only by the refresh described in Profiles
(Reactions 1 and 2), never by a direct request.

## Set preferences

A signed-in user may [set their preferences](reaction:Recommendations.Requests.SetPreferences):
preferred skills, interests, and universities, and optionally a maximum distance in
kilometers and a minimum weekly availability. The three lists are required and may be
empty; they are passed to Recommending unchanged. An omitted or null number means no
preference for that factor and clears any earlier one. The endpoint applies
[a supplied-number test](computation:numberSupplied) once to distance and once to
availability, and passes each number to `setPreferences` only when its test is true.

The reaction first reads ProfileSetting `_recommendationData` for the session user. When
the user has no profile it returns `PREFERENCES_NEED_PROFILE` without changes. Otherwise
Recommending `setPreferences` replaces all of the user's preferences, refusing negative
numbers or empty entries (`INVALID_PREFERENCES`) without changes. Repeating the same
request succeeds again.

After the preferences are saved, a successful Recommending `setPreferences`
[refreshes the user's recommendations](reaction:Recommendations.Refreshing.RefreshOnPreferences)
(Reaction 2) as an internal reaction. It reads ProfileSetting `_recommendationData` again,
rather than reusing the guard read, and only when that fresh read shows the profile visible
does it run the recommendation refresh described in Profiles: both directions for every
visible candidate with the opposite role, so the new preferences change the user's scores
for others and others' scores for the user (through the skills factor). A hidden profile
refreshes nothing until it is published. The endpoint answers success only after its flow
settles, after every refresh has completed; that answer is disjoint from
`PREFERENCES_NEED_PROFILE`, which is answered only when the user has no profile. It has
the same best-effort failure and concurrency behavior as the Profiles
refresh: saved preferences stay saved, and any later change or publish recomputes every
pair.

```endpoints
Recommendations.Requests.SetPreferences at /recommendations/set-preferences
```

```computations
numberSupplied(value?: Number) : Flag
  Produces true when an optional numeric request field holds a number, and false when it was omitted or null.
```

## Read preferences

A signed-in user may [read their preferences](reaction:Recommendations.Reads.Preferences).
Recommending `_getPreferences` returns the saved skills, interests, universities, and any
distance and availability. A user who never saved preferences receives empty sets and no
numbers, the same defaults scoring uses. Reading changes no state.

```endpoints
Recommendations.Reads.Preferences at /recommendations/preferences
```

## Feed

A signed-in user may [read their feed](reaction:Recommendations.Reads.Feed). Recommending
`_getFeed` returns account identities with scores for the session user's eligible
AVAILABLE recommendations, highest score first and ties oldest first. It returns an empty
list when there are none. Passed, interested, and see-later recommendations are excluded.
Reading changes no state.

```endpoints
Recommendations.Reads.Feed at /recommendations/feed
```

## Deferred

- Reaction 4 (`markInterested` after Show Interest), Reaction 5 (`markPassed` after a pass),
  passing from the feed, and the Recommending half of Reaction 10 (unmatch).
- See Later and Begin Browsing (`seeLater`, `startNewSession`) endpoints.
- Reaction 3 (deactivating recommendations on hide), awaiting a hide endpoint.

These integrations are not linked. Until Reactions 4 and 5 exist, showing interest in or
passing on someone does not remove them from the feed.

## Retained review guidance

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/design/boundary.md**

Unchanged from the prior same-agent context.

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/design/contracts.md**

Unchanged from the prior same-agent context.

**node_modules/@mit-sdg/sync-engine-skill/skills/sync-engine/prompts/guidance/design/ssf-reading.md**

Unchanged from the prior same-agent context.

# Result

Unless the task requests another format, use these prior fields: `## Verdict`, `## Findings`.

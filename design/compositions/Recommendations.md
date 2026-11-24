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
visible candidate with a complementary role, so the new preferences change the user's scores
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

## Leaving feeds after unmatching

When MutualMatching `unmatch` succeeds (Reaction 10, Recommending half), two internal
reactions remove the pair from each other's feeds, one per direction:
[the unmatching user's recommendation of the other](reaction:Recommendations.Unmatching.PassForward)
and [the other's recommendation of the unmatching user](reaction:Recommendations.Unmatching.PassBack).
Each reads Recommending `_recommendation` for its direction and, only when one exists and
is not already PASSED, calls Recommending `markPassed`. A direction with no recommendation,
for example because a profile was never published, is skipped rather than refused.

Unmatching sets both MutualMatching decisions to PASSED, so neither person can show
interest again; marking the recommendations PASSED keeps the feed from offering a person
the app would refuse. A later refresh keeps the PASSED status, so they do not return.
Unmatch answers only after its flow settles, so both feeds are already updated when the
endpoint reports success. The marking is best-effort like the other reactions: the unmatch
stays if `markPassed` faults.

## Deferred

- Reaction 4 (`markInterested` after Show Interest), Reaction 5 (`markPassed` after a pass),
  and passing from the feed.
- See Later and Begin Browsing (`seeLater`, `startNewSession`) endpoints.
- Reaction 3 (deactivating recommendations on hide), awaiting a hide endpoint.

These integrations are not linked. Until Reactions 4 and 5 exist, showing interest in or
passing on someone does not remove them from the feed.

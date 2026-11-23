# Recommendations

Signed-in users read their ranked feed. Every endpoint
first calls Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any read or change, without changing state.
Feeds belong only to the session user.

Recommendations are created and recalculated only by the refresh described in Profiles
(Reaction 1), never by a direct request.

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

- Setting and reading preferences, and recalculating recommendations after preference
  changes (Reaction 2).
- Reaction 4 (`markInterested` after Show Interest), Reaction 5 (`markPassed` after a pass),
  passing from the feed, and the Recommending half of Reaction 10 (unmatch).
- See Later and Begin Browsing (`seeLater`, `startNewSession`) endpoints.
- Reaction 3 (deactivating recommendations on hide), awaiting a hide endpoint.

These integrations are not linked. Until Reactions 4 and 5 exist, showing interest in or
passing on someone does not remove them from the feed.

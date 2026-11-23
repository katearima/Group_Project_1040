# Profiles

Signed-in users create and publish their own profile. Every endpoint first calls
Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any profile or recommendation action,
without changing state. The session user is always the profile owner; a request never
names whose profile it changes.

ProfileSetting checks and changes each profile atomically and owns every validation and
publication rule. The composition forwards its refusals without separate checks.

## Recommendation refresh

Publishing (Reaction 1) causes the recommendation refresh, owned by an internal reaction:
a successful ProfileSetting `publishProfile` [refreshes the user's recommendations](reaction:Profiles.Refreshing.RefreshOnPublish).
A refused publish triggers nothing. After its trigger, the reaction reads ProfileSetting
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
for publish (publishing a visible profile succeeds again), and any later publish
recomputes every pair of that user.

Flows for different users are not serialized against each other. When two users' changes
interleave, a pair's score can be computed from the other user's slightly older data and
stays stale until either user's next publish refreshes
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

## Set startup pitch

A signed-in founder may [set their startup pitch](reaction:Profiles.Requests.SetPitch).
ProfileSetting `setStartupPitch` refuses a missing profile (`PITCH_PROFILE_NOT_FOUND`), a
builder (`PITCH_NOT_FOUNDER`), and an empty pitch (`EMPTY_PITCH`). On success the endpoint
returns success. A founder needs a pitch before publishing. Pitch text adds no points to any
score.

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
- Updating a profile, and recalculating recommendations after a profile, pitch, or
  preference change (Reaction 2).
- The ProfileSetting guard on Show Interest and the sender's name in interest
  notifications (see Matching).

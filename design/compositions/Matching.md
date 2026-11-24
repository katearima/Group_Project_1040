# Matching

Signed-in users can show interest, pass, unmatch, and list incoming interests and matches.
Every endpoint first calls Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any matching or notification action,
without changing state. The session determines who acts; the requested account identity
identifies only the other person.

MutualMatching checks and updates pair rules atomically. The composition forwards its
refusals without separate checks. Concurrent requests cannot create duplicate decisions
or matches.

Deferred integrations:

- ProfileSetting: require visible profiles with complementary roles for Show Interest and
  supply the sender's name for interest notifications.
- Recommending: update feeds after interest or a pass (Reactions 4 and 5), allow passing
  from recommendations, and mark recommendations passed after unmatching (Reaction 10).
- Chatting: create a conversation after matching (Reaction 7), notify about new messages
  (Reaction 9), and close the conversation after unmatching (Reaction 10).

These integrations are not linked. Until the ProfileSetting guard is added, the target
identity is not checked against registered accounts. Interest in an unregistered identity
records a decision and notification that no signed-in user can see.

## Show interest

A signed-in user may [show interest](reaction:Matching.Requests.ShowInterest) in another
person. MutualMatching `showInterest` takes the session user as `from` and the other
person as `to`. It refuses self-interest (`INTEREST_IN_SELF`), an existing match
(`INTEREST_ALREADY_MATCHED`), or any prior decision, including a pass or unmatch
(`INTEREST_ALREADY_DECIDED`). Refusals record nothing and send no notifications;
repeating a successful request is refused.

The same endpoint reaction attempts the notifications for Reactions 6 and 8 before
returning whether a match was created. There is no separate internal reaction. All
notifications use the flow's instant as `createdAt`.

- If a match was created (Reaction 8), Notifying `notify` sends "It's a match!" first to
  the session user, then to the other person, each with
  [their matches link](computation:matchesLink).
- Otherwise (Reaction 6), the reaction reads MutualMatching `_decision` from the other
  person to the session user. Unless it is PASSED, `notify` sends that person
  "Someone is interested in you!" with the [sender's profile link](computation:profileLink).
  The generic message stands in for the deferred sender name and exposes no username.

Notifications are best-effort in this in-memory version. Recording a decision and
creating notifications have separate owners and are not atomic. If `notify` faults,
the endpoint reports the fault instead of the match outcome. The decision, any match,
and any notifications already created remain; one match notification may exist without
the other.

Retrying Show Interest returns `INTEREST_ALREADY_DECIDED` or `INTEREST_ALREADY_MATCHED`
and cannot recover a lost notification. The interested-in-you and matches lists read
MutualMatching directly and remain authoritative. `notify` only refuses empty messages;
these fixed messages are nonempty. Notification recovery is deferred until persistence
is added.

```endpoints
Matching.Requests.ShowInterest at /matching/show-interest
```

```computations
profileLink(user: Authenticating.Account) : String
  Produces the navigation link /profile/<user> for the given account identity.
matchesLink(user: Authenticating.Account) : String
  Produces the recipient's own matches navigation link, /matches, for the given account.
```

## Pass

A signed-in user may [pass](reaction:Matching.Requests.Pass) on incoming interest.
The reaction reads MutualMatching `_decision` from the other person to the session user.
Unless it is INTERESTED, it returns `NO_INCOMING_INTEREST` without changes. This also
rejects self-passes. Passing from recommendations is deferred.

When the guard holds, MutualMatching `pass` uses the session user as `from`. It refuses
an existing match (`PASS_ALREADY_MATCHED`) or prior interest (`PASS_AFTER_INTEREST`).
Otherwise it records PASSED or keeps the existing pass, then returns success. Repeating
an eligible pass succeeds without changes. The person leaves the user's interested-in-you
list, and no notification is sent.

```endpoints
Matching.Requests.Pass at /matching/pass
```

## Unmatch

A signed-in user may [unmatch](reaction:Matching.Requests.Unmatch) a current match.
MutualMatching `unmatch` takes the session user as `user`. If no match connects them to
the other person, including a self-request or a pair they don't belong to, it returns
`NOT_MATCHED` without changes.

On success, one atomic action removes the match and sets both decisions to PASSED.
The endpoint then returns success. Neither person can show interest again, and a repeated
unmatch returns `NOT_MATCHED`. Unmatching sends no notification and leaves existing
notifications untouched.

```endpoints
Matching.Requests.Unmatch at /matching/unmatch
```

## Interested in you

A signed-in user may [list incoming interests](reaction:Matching.Reads.InterestedInYou).
MutualMatching `_getInterestedInYou` returns account identities for the session user,
earliest interest first, excluding people they passed on or matched with. It returns an
empty list when there are none. Users cannot read someone else's incoming interests;
reading changes no state.

```endpoints
Matching.Reads.InterestedInYou at /matching/interested-in-you
```

## Matches

A signed-in user may [list their matches](reaction:Matching.Reads.Matches).
MutualMatching `_getMatches` returns account identities for the session user, oldest
match first, or an empty list. Users cannot read someone else's matches; reading changes
no state.

```endpoints
Matching.Reads.Matches at /matching/matches
```

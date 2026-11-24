<!-- Generated from the Application assembly. Do not edit. -->
<!-- Manifest producer: @mit-sdg/sync-engine@1.1.0; concept specification: sync-engine.concept-specification@1; renderer: @mit-sdg/sync-engine@1.1.0. -->

# Application — assembled read-back

_Assembled by sync-engine from registered concepts and composition. Edit the concept_
_specifications and composition source, then regenerate this file._

## Concepts

### Authenticating

Defined in [Authenticating](../design/concepts/Authenticating.md), line 1.

#### Actions

- `register(username: String, password: String) : returns (account: Account)`
  - Refuses `INVALID_USERNAME`: A username must contain 3 to 32 letters, numbers, underscores, or hyphens.
  - Refuses `WEAK_PASSWORD`: A password must contain 8 to 128 characters.
  - Refuses `USERNAME_TAKEN`: That username is already registered.
- `authenticate(username: String, password: String) : returns (account: Account)`
  - Refuses `INVALID_CREDENTIALS`: The username or password is incorrect.
- `changePassword(username: String, currentPassword: String, newPassword: String) : returns (account: Account)`
  - Refuses `WEAK_PASSWORD`: A password must contain 8 to 128 characters.
  - Refuses `INVALID_CREDENTIALS`: The username or password is incorrect.
- `unregister(username: String, password: String) : returns (account: Account)`
  - Refuses `INVALID_CREDENTIALS`: The username or password is incorrect.

#### Queries

- `_registered(username: String) : one (registered: Flag)`

#### Instances

- `Authenticating` — instance of `Authenticating` — [Application types and instances](../design/types.md), line 10.

### MutualMatching

Defined in [MutualMatching](../design/concepts/MutualMatching.md), line 1.

#### Actions

- `showInterest(from: User, to: User) : returns (matched: Flag)`
  - Refuses `INTEREST_IN_SELF`: You cannot show interest in yourself.
  - Refuses `INTEREST_ALREADY_MATCHED`: You are already matched with this person.
  - Refuses `INTEREST_ALREADY_DECIDED`: You have already decided about this person.
- `pass(from: User, to: User) : returns ()`
  - Refuses `PASS_ON_SELF`: You cannot pass on yourself.
  - Refuses `PASS_ALREADY_MATCHED`: You are matched with this person; unmatch instead.
  - Refuses `PASS_AFTER_INTEREST`: You have already shown interest in this person.
- `unmatch(user: User, other: User) : returns ()`
  - Refuses `NOT_MATCHED`: You do not have an active match with this person.

#### Queries

- `_getInterestedInYou(user: User) : many (from: User)`
- `_getMatches(user: User) : many (other: User)`
- `_decision(from: User, to: User) : optional (status: DecisionStatus)`

#### Instances

- `MutualMatching` — instance of `MutualMatching` — [Application types and instances](../design/types.md), line 15.
  - `User` is `Authenticating.Account` — [Application types and instances](../design/types.md), line 16.

### Notifying

Defined in [Notifying](../design/concepts/Notifying.md), line 1.

#### Actions

- `notify(recipient: User, message: String, link: String, createdAt: DateTime) : returns (notification: Notification)`
  - Refuses `EMPTY_MESSAGE`: A notification message must not be empty.
- `markAsRead(user: User, notification: Notification) : returns (notification: Notification)`
  - Refuses `READ_TARGET_NOT_FOUND`: No such notification.
  - Refuses `READ_TARGET_DISMISSED`: This notification has been dismissed.
- `dismissNotification(user: User, notification: Notification) : returns (notification: Notification)`
  - Refuses `DISMISS_TARGET_NOT_FOUND`: No such notification.

#### Queries

- `_getNotifications(user: User) : many (notification: Notification, message: String, link: String, createdAt: DateTime, status: NotificationStatus)`
- `_getUnreadNotifications(user: User) : many (notification: Notification, message: String, link: String, createdAt: DateTime)`

#### Instances

- `Notifying` — instance of `Notifying` — [Application types and instances](../design/types.md), line 18.
  - `User` is `Authenticating.Account` — [Application types and instances](../design/types.md), line 19.

### ProfileSetting

Defined in [ProfileSetting](../design/concepts/ProfileSetting.md), line 1.

#### Actions

- `createProfile(user: User, role: Role, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number) : returns (profile: Profile)`
  - Refuses `PROFILE_ALREADY_EXISTS`: You already have a profile.
  - Refuses `INVALID_PROFILE`: Graduation year, coordinates, availability, skills, and interests must be valid.
- `setStartupPitch(user: User, pitch: String) : returns ()`
  - Refuses `PITCH_PROFILE_NOT_FOUND`: Create a profile first.
  - Refuses `PITCH_NOT_FOUNDER`: Only founders can have a startup pitch.
  - Refuses `EMPTY_PITCH`: A startup pitch must not be empty.
- `updateProfile(user: User, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number) : returns ()`
  - Refuses `UPDATE_PROFILE_NOT_FOUND`: Create a profile first.
  - Refuses `INVALID_PROFILE_UPDATE`: Graduation year, coordinates, availability, skills, and interests must be valid.
  - Refuses `UPDATE_WOULD_UNPUBLISH`: A visible profile must stay complete; hide it before removing required details.
- `publishProfile(user: User) : returns ()`
  - Refuses `PUBLISH_PROFILE_NOT_FOUND`: Create a profile first.
  - Refuses `PROFILE_INCOMPLETE`: Add a name, location, at least one skill and interest, and, for founders, a startup pitch before publishing.
- `hideProfile(user: User) : returns ()`
  - Refuses `PROFILE_NOT_VISIBLE`: You do not have a visible profile.

#### Queries

- `_getProfile(user: User) : optional (profile: Profile, role: Role, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number, startupPitch?: String, visible: Flag)`
- `_getVisibleProfiles() : many (profile: Profile, owner: User)`
- `_recommendationData(user: User) : optional (role: Role, visible: Flag, skills: Entries, interests: Entries, university: String, latitude: Number, longitude: Number, availability: Number)`
- `_visibleCandidates(user: User) : many (candidate: User, skills: Entries, interests: Entries, university: String, latitude: Number, longitude: Number, availability: Number)`

#### Instances

- `ProfileSetting` — instance of `ProfileSetting` — [Application types and instances](../design/types.md), line 21.
  - `User` is `Authenticating.Account` — [Application types and instances](../design/types.md), line 22.

### Recommending

Defined in [Recommending](../design/concepts/Recommending.md), line 1.

#### Actions

- `setPreferences(user: User, skills: Entries, interests: Entries, universities: Entries, distance?: Number, availability?: Number) : returns ()`
  - Refuses `INVALID_PREFERENCES`: Preferred distance and availability must be nonnegative, and preferred entries must not be empty.
- `refreshRecommendation(viewer: User, candidate: User, viewerSkills: Entries, viewerInterests: Entries, viewerUniversity: String, viewerLatitude: Number, viewerLongitude: Number, viewerAvailability: Number, candidateSkills: Entries, candidateInterests: Entries, candidateUniversity: String, candidateLatitude: Number, candidateLongitude: Number, candidateAvailability: Number) : returns (score: Number)`
  - Refuses `SELF_RECOMMENDATION`: A person cannot be recommended to themselves.
  - Refuses `INVALID_RECOMMENDATION_DATA`: Recommendation data must have nonempty entries, valid coordinates, and nonnegative availability.
- `seeLater(viewer: User, candidate: User) : returns ()`
  - Refuses `NOT_IN_FEED`: This person is not in your current feed.
- `markPassed(viewer: User, candidate: User) : returns ()`
  - Refuses `PASS_RECOMMENDATION_NOT_FOUND`: There is no recommendation of this person.
- `markInterested(viewer: User, candidate: User) : returns ()`
  - Refuses `INTEREST_RECOMMENDATION_NOT_FOUND`: There is no recommendation of this person.
  - Refuses `RECOMMENDATION_ALREADY_DECIDED`: You have already decided about this recommendation.
- `startNewSession(viewer: User) : returns ()`
- `deactivateRecommendation(viewer: User, candidate: User) : returns ()`
  - Refuses `DEACTIVATE_RECOMMENDATION_NOT_FOUND`: There is no recommendation of this person.

#### Queries

- `_getFeed(viewer: User) : many (candidate: User, score: Number)`
- `_getPreferences(user: User) : optional (skills: Entries, interests: Entries, universities: Entries, distance?: Number, availability?: Number)`
- `_recommendation(viewer: User, candidate: User) : optional (score: Number, status: RecommendationStatus, eligible: Flag)`

#### Instances

- `Recommending` — instance of `Recommending` — [Application types and instances](../design/types.md), line 24.
  - `User` is `Authenticating.Account` — [Application types and instances](../design/types.md), line 25.

### Sessioning

Defined in [Sessioning](../design/concepts/Sessioning.md), line 1.

#### Actions

- `start(subject: Subject, lifetime: Number, now: DateTime) : returns (session: Session, expiresAt: DateTime)`
  - Refuses `INVALID_SESSION_LIFETIME`: A session lifetime must be a positive number of milliseconds.
- `current(session: Session, now: DateTime) : returns (subject: Subject)`
  - Refuses `UNKNOWN_SESSION`: This session is not active.
- `end(session: Session, now: DateTime) : returns (ended: Flag)`
  - Refuses `UNKNOWN_SESSION`: This session is not active.

#### Queries

- `_active(session: Session, now: DateTime) : optional (subject: Subject, expiresAt: DateTime)`

#### Instances

- `Sessioning` — instance of `Sessioning` — [Application types and instances](../design/types.md), line 12.
  - `Subject` is `Authenticating.Account` — [Application types and instances](../design/types.md), line 13.

## Computations

- `currentInstant() : DateTime` — [Application types and instances](../design/types.md), line 35.
- `matchesLink(user: Authenticating.Account) : String` — [Matching](../design/compositions/Matching.md), line 67.
- `numberSupplied(value?: Number) : Flag` — [Recommendations](../design/compositions/Recommendations.md), line 47.
- `profileLink(user: Authenticating.Account) : String` — [Matching](../design/compositions/Matching.md), line 65.
- `sessionLifetime() : Number` — [Accounts](../design/compositions/Accounts.md), line 10.

## Formers

_Formers name result shapes evaluated when asked. The source former owns_
_the authored explanation; this section records the generated shape._

### the feed of (viewer)

```former
Former "the feed of (viewer)" — inputs (viewer); bindings (candidate, score); promises exactly one record — forms:
  each Recommending._getFeed (viewer) has (candidate, score)
    form a record of
      score
      user: candidate
```

### the matches of (user)

```former
Former "the matches of (user)" — inputs (user); bindings (other); promises exactly one record — forms:
  each MutualMatching._getMatches (user) has (other)
    form a record of
      user: other
```

### the notifications of (user)

```former
Former "the notifications of (user)" — inputs (user); bindings (notification, message, link, createdAt, status); promises exactly one record — forms:
  each Notifying._getNotifications (user) has (createdAt, link, message, notification, status)
    form a record of
      createdAt
      link
      message
      notification
      status
```

### the unread notifications of (user)

```former
Former "the unread notifications of (user)" — inputs (user); bindings (notification, message, link, createdAt); promises exactly one record — forms:
  each Notifying._getUnreadNotifications (user) has (createdAt, link, message, notification)
    form a record of
      createdAt
      link
      message
      notification
```

### the users interested in (user)

```former
Former "the users interested in (user)" — inputs (user); bindings (from); promises exactly one record — forms:
  each MutualMatching._getInterestedInYou (user) has (from)
    form a record of
      user: from
```

## Reactions

### Accounts.Sessions.Register

Authored path: `Accounts.Sessions.Register`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 16.
- Covered by [Accounts](../design/compositions/Accounts.md), line 27.

```reaction
when RequestBoundary.request (password, path: "/accounts/register", requestId, username)
then
  Authenticating.register (password, username)
```

### Accounts.Sessions.Register#2

Authored path: `Accounts.Sessions.Register`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 16.
- Covered by [Accounts](../design/compositions/Accounts.md), line 27.

```reaction
when Authenticating.register (password, username, account), asked by Accounts.Sessions.Register
where
  time is the current flow's instant
  lifetime is sessionLifetime
then
  Sessioning.start (lifetime, now: time, subject: account)
```

### Accounts.Sessions.Register#3

Authored path: `Accounts.Sessions.Register`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 16.
- Covered by [Accounts](../design/compositions/Accounts.md), line 27.

```reaction
when Sessioning.start (lifetime, now: time, subject: account, expiresAt, session), asked by Accounts.Sessions.Register#2
where
  earlier, RequestBoundary.request (password, path: "/accounts/register", requestId, username)
then
  RequestBoundary.respond (account, expiresAt, requestId, session)
```

### Accounts.Sessions.SignIn

Authored path: `Accounts.Sessions.SignIn`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 32.
- Covered by [Accounts](../design/compositions/Accounts.md), line 42.

```reaction
when RequestBoundary.request (password, path: "/accounts/sign-in", requestId, username)
then
  Authenticating.authenticate (password, username)
```

### Accounts.Sessions.SignIn#2

Authored path: `Accounts.Sessions.SignIn`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 32.
- Covered by [Accounts](../design/compositions/Accounts.md), line 42.

```reaction
when Authenticating.authenticate (password, username, account), asked by Accounts.Sessions.SignIn
where
  time is the current flow's instant
  lifetime is sessionLifetime
then
  Sessioning.start (lifetime, now: time, subject: account)
```

### Accounts.Sessions.SignIn#3

Authored path: `Accounts.Sessions.SignIn`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 32.
- Covered by [Accounts](../design/compositions/Accounts.md), line 42.

```reaction
when Sessioning.start (lifetime, now: time, subject: account, expiresAt, session), asked by Accounts.Sessions.SignIn#2
where
  earlier, RequestBoundary.request (password, path: "/accounts/sign-in", requestId, username)
then
  RequestBoundary.respond (account, expiresAt, requestId, session)
```

### Accounts.Sessions.SignOut

Authored path: `Accounts.Sessions.SignOut`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 47.
- Covered by [Accounts](../design/compositions/Accounts.md), line 55.

```reaction
when RequestBoundary.request (path: "/accounts/sign-out", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.end (now: time, session)
```

### Accounts.Sessions.SignOut#2

Authored path: `Accounts.Sessions.SignOut`.
- Covered by [Accounts](../design/compositions/Accounts.md), line 47.
- Covered by [Accounts](../design/compositions/Accounts.md), line 55.

```reaction
when Sessioning.end (now: time, session, ended), asked by Accounts.Sessions.SignOut
where
  earlier, RequestBoundary.request (path: "/accounts/sign-out", requestId, session)
then
  RequestBoundary.respond (ended, requestId)
```

### DeliverFaultToAsker

```reaction
when any action is faulted, not asked by DeliverFaultToAsker
where
  earlier, RequestBoundary.request (requestId)
then
  RequestBoundary.respondFramework (error: "INTERNAL_ERROR", requestId)
```

### DeliverRefusalToAsker

```reaction
when any action is refused (message), except RequestBoundary
where
  earlier, RequestBoundary.request (requestId)
then
  RequestBoundary.respond (error: message, requestId)
```

### Matching.Reads.InterestedInYou

Authored path: `Matching.Reads.InterestedInYou`.
- Covered by [Matching](../design/compositions/Matching.md), line 106.
- Covered by [Matching](../design/compositions/Matching.md), line 113.

```reaction
when RequestBoundary.request (path: "/matching/interested-in-you", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Matching.Reads.InterestedInYou#2

Authored path: `Matching.Reads.InterestedInYou`.
- Covered by [Matching](../design/compositions/Matching.md), line 106.
- Covered by [Matching](../design/compositions/Matching.md), line 113.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Matching.Reads.InterestedInYou
where
  earlier, RequestBoundary.request (path: "/matching/interested-in-you", requestId, session)
then
  RequestBoundary.respond (interested: former "the users interested in (user)" with (user), requestId)
```

### Matching.Reads.Matches

Authored path: `Matching.Reads.Matches`.
- Covered by [Matching](../design/compositions/Matching.md), line 118.
- Covered by [Matching](../design/compositions/Matching.md), line 124.

```reaction
when RequestBoundary.request (path: "/matching/matches", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Matching.Reads.Matches#2

Authored path: `Matching.Reads.Matches`.
- Covered by [Matching](../design/compositions/Matching.md), line 118.
- Covered by [Matching](../design/compositions/Matching.md), line 124.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Matching.Reads.Matches
where
  earlier, RequestBoundary.request (path: "/matching/matches", requestId, session)
then
  RequestBoundary.respond (matches: former "the matches of (user)" with (user), requestId)
```

### Matching.Requests.Pass

Authored path: `Matching.Requests.Pass`.
- Covered by [Matching](../design/compositions/Matching.md), line 73.
- Covered by [Matching](../design/compositions/Matching.md), line 85.

```reaction
when RequestBoundary.request (other, path: "/matching/pass", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Matching.Requests.Pass:incoming-interest#2

Authored path: `Matching.Requests.Pass`.
- Covered by [Matching](../design/compositions/Matching.md), line 73.
- Covered by [Matching](../design/compositions/Matching.md), line 85.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.Pass
where
  earlier, RequestBoundary.request (other, path: "/matching/pass", requestId, session)
  MutualMatching._decision (from: other, to: user) has (status: "INTERESTED")
then
  MutualMatching.pass (from: user, to: other)
```

### Matching.Requests.Pass:incoming-interest#3

Authored path: `Matching.Requests.Pass`.
- Covered by [Matching](../design/compositions/Matching.md), line 73.
- Covered by [Matching](../design/compositions/Matching.md), line 85.

```reaction
when MutualMatching.pass (from: user, to: other), asked by Matching.Requests.Pass:incoming-interest#2
where
  earlier, RequestBoundary.request (other, path: "/matching/pass", requestId, session)
then
  RequestBoundary.respond (passed: true, requestId)
```

### Matching.Requests.Pass:no-incoming-interest#2

Authored path: `Matching.Requests.Pass`.
- Covered by [Matching](../design/compositions/Matching.md), line 73.
- Covered by [Matching](../design/compositions/Matching.md), line 85.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.Pass
where
  earlier, RequestBoundary.request (other, path: "/matching/pass", requestId, session)
  no MutualMatching._decision (from: other, to: user) has (status: "INTERESTED")
then
  RequestBoundary.respond (error: "NO_INCOMING_INTEREST", requestId)
```

### Matching.Requests.ShowInterest

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when RequestBoundary.request (other, path: "/matching/show-interest", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Matching.Requests.ShowInterest#2

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.ShowInterest
where
  earlier, RequestBoundary.request (other, path: "/matching/show-interest", requestId, session)
then
  MutualMatching.showInterest (from: user, to: other)
```

### Matching.Requests.ShowInterest:interest-after-pass#3

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
where
  matched is among [false]
  MutualMatching._decision (from: other, to: user) has (status: "PASSED")
  earlier, RequestBoundary.request (other, path: "/matching/show-interest", requestId, session)
then
  RequestBoundary.respond (matched, requestId)
```

### Matching.Requests.ShowInterest:interest-after-pass#4

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when RequestBoundary.respond (matched, requestId), asked by Matching.Requests.ShowInterest:interest-after-pass#3
where
  matched is among [true]
  earlier, Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.ShowInterest
  earlier, MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
  otherLink is matchesLink (user: other)
then
  Notifying.notify (createdAt: time, link: otherLink, message: "It's a match!", recipient: other)
```

### Matching.Requests.ShowInterest:interest-after-pass#5

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when Notifying.notify (createdAt: time, link: otherLink, message: "It's a match!", recipient: other), asked by Matching.Requests.ShowInterest:interest-after-pass#4
where
  earlier, MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
  earlier, RequestBoundary.respond (matched, requestId), asked by Matching.Requests.ShowInterest:interest-after-pass#3
then
  RequestBoundary.respond (matched, requestId)
```

### Matching.Requests.ShowInterest:interest-notifies-other#3

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
where
  matched is among [false]
  no MutualMatching._decision (from: other, to: user) has (status: "PASSED")
  profile is profileLink (user)
  earlier, Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.ShowInterest
then
  Notifying.notify (createdAt: time, link: profile, message: "Someone is interested in you!", recipient: other)
```

### Matching.Requests.ShowInterest:interest-notifies-other#4

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when Notifying.notify (createdAt: time, link: profile, message: "Someone is interested in you!", recipient: other), asked by Matching.Requests.ShowInterest:interest-notifies-other#3
where
  earlier, MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
  earlier, RequestBoundary.request (other, path: "/matching/show-interest", requestId, session)
then
  RequestBoundary.respond (matched, requestId)
```

### Matching.Requests.ShowInterest:interest-notifies-other#5

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when RequestBoundary.respond (matched, requestId), asked by Matching.Requests.ShowInterest:interest-notifies-other#4
where
  matched is among [true]
  earlier, Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.ShowInterest
  earlier, MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
  otherLink is matchesLink (user: other)
then
  Notifying.notify (createdAt: time, link: otherLink, message: "It's a match!", recipient: other)
```

### Matching.Requests.ShowInterest:interest-notifies-other#6

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when Notifying.notify (createdAt: time, link: otherLink, message: "It's a match!", recipient: other), asked by Matching.Requests.ShowInterest:interest-notifies-other#5
where
  earlier, MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
  earlier, RequestBoundary.respond (matched, requestId), asked by Matching.Requests.ShowInterest:interest-notifies-other#4
then
  RequestBoundary.respond (matched, requestId)
```

### Matching.Requests.ShowInterest:match-notifies-session-user#3

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
where
  matched is among [true]
  userLink is matchesLink (user)
  earlier, Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.ShowInterest
then
  Notifying.notify (createdAt: time, link: userLink, message: "It's a match!", recipient: user)
```

### Matching.Requests.ShowInterest:match-notifies-session-user#4

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when Notifying.notify (createdAt: time, link: userLink, message: "It's a match!", recipient: user), asked by Matching.Requests.ShowInterest:match-notifies-session-user#3
where
  earlier, MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
  matched is among [true]
  otherLink is matchesLink (user: other)
then
  Notifying.notify (createdAt: time, link: otherLink, message: "It's a match!", recipient: other)
```

### Matching.Requests.ShowInterest:match-notifies-session-user#5

Authored path: `Matching.Requests.ShowInterest`.
- Covered by [Matching](../design/compositions/Matching.md), line 29.
- Covered by [Matching](../design/compositions/Matching.md), line 61.

```reaction
when Notifying.notify (createdAt: time, link: otherLink, message: "It's a match!", recipient: other), asked by Matching.Requests.ShowInterest:match-notifies-session-user#4
where
  earlier, MutualMatching.showInterest (from: user, to: other, matched), asked by Matching.Requests.ShowInterest#2
  earlier, RequestBoundary.request (other, path: "/matching/show-interest", requestId, session)
then
  RequestBoundary.respond (matched, requestId)
```

### Matching.Requests.Unmatch

Authored path: `Matching.Requests.Unmatch`.
- Covered by [Matching](../design/compositions/Matching.md), line 90.
- Covered by [Matching](../design/compositions/Matching.md), line 101.

```reaction
when RequestBoundary.request (other, path: "/matching/unmatch", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Matching.Requests.Unmatch#2

Authored path: `Matching.Requests.Unmatch`.
- Covered by [Matching](../design/compositions/Matching.md), line 90.
- Covered by [Matching](../design/compositions/Matching.md), line 101.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Matching.Requests.Unmatch
where
  earlier, RequestBoundary.request (other, path: "/matching/unmatch", requestId, session)
then
  MutualMatching.unmatch (other, user)
```

### Matching.Requests.Unmatch#3

Authored path: `Matching.Requests.Unmatch`.
- Covered by [Matching](../design/compositions/Matching.md), line 90.
- Covered by [Matching](../design/compositions/Matching.md), line 101.

```reaction
when MutualMatching.unmatch (other, user), asked by Matching.Requests.Unmatch#2
where
  earlier, RequestBoundary.request (other, path: "/matching/unmatch", requestId, session)
then
  RequestBoundary.respond (requestId, unmatched: true)
```

### Notifications.Reads.List

Authored path: `Notifications.Reads.List`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 18.
- Covered by [Notifications](../design/compositions/Notifications.md), line 25.

```reaction
when RequestBoundary.request (path: "/notifications/list", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Notifications.Reads.List#2

Authored path: `Notifications.Reads.List`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 18.
- Covered by [Notifications](../design/compositions/Notifications.md), line 25.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Notifications.Reads.List
where
  earlier, RequestBoundary.request (path: "/notifications/list", requestId, session)
then
  RequestBoundary.respond (notifications: former "the notifications of (user)" with (user), requestId)
```

### Notifications.Reads.ListUnread

Authored path: `Notifications.Reads.ListUnread`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 30.
- Covered by [Notifications](../design/compositions/Notifications.md), line 36.

```reaction
when RequestBoundary.request (path: "/notifications/unread", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Notifications.Reads.ListUnread#2

Authored path: `Notifications.Reads.ListUnread`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 30.
- Covered by [Notifications](../design/compositions/Notifications.md), line 36.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Notifications.Reads.ListUnread
where
  earlier, RequestBoundary.request (path: "/notifications/unread", requestId, session)
then
  RequestBoundary.respond (notifications: former "the unread notifications of (user)" with (user), requestId)
```

### Notifications.Requests.Dismiss

Authored path: `Notifications.Requests.Dismiss`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 56.
- Covered by [Notifications](../design/compositions/Notifications.md), line 65.

```reaction
when RequestBoundary.request (notification, path: "/notifications/dismiss", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Notifications.Requests.Dismiss#2

Authored path: `Notifications.Requests.Dismiss`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 56.
- Covered by [Notifications](../design/compositions/Notifications.md), line 65.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Notifications.Requests.Dismiss
where
  earlier, RequestBoundary.request (notification, path: "/notifications/dismiss", requestId, session)
then
  Notifying.dismissNotification (notification, user)
```

### Notifications.Requests.Dismiss#3

Authored path: `Notifications.Requests.Dismiss`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 56.
- Covered by [Notifications](../design/compositions/Notifications.md), line 65.

```reaction
when Notifying.dismissNotification (notification, user), asked by Notifications.Requests.Dismiss#2
where
  earlier, RequestBoundary.request (notification, path: "/notifications/dismiss", requestId, session)
then
  RequestBoundary.respond (notification, requestId)
```

### Notifications.Requests.MarkAsRead

Authored path: `Notifications.Requests.MarkAsRead`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 41.
- Covered by [Notifications](../design/compositions/Notifications.md), line 51.

```reaction
when RequestBoundary.request (notification, path: "/notifications/mark-read", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Notifications.Requests.MarkAsRead#2

Authored path: `Notifications.Requests.MarkAsRead`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 41.
- Covered by [Notifications](../design/compositions/Notifications.md), line 51.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Notifications.Requests.MarkAsRead
where
  earlier, RequestBoundary.request (notification, path: "/notifications/mark-read", requestId, session)
then
  Notifying.markAsRead (notification, user)
```

### Notifications.Requests.MarkAsRead#3

Authored path: `Notifications.Requests.MarkAsRead`.
- Covered by [Notifications](../design/compositions/Notifications.md), line 41.
- Covered by [Notifications](../design/compositions/Notifications.md), line 51.

```reaction
when Notifying.markAsRead (notification, user), asked by Notifications.Requests.MarkAsRead#2
where
  earlier, RequestBoundary.request (notification, path: "/notifications/mark-read", requestId, session)
then
  RequestBoundary.respond (notification, requestId)
```

### Profiles.Reads.Mine

Authored path: `Profiles.Reads.Mine`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 110.
- Covered by [Profiles](../design/compositions/Profiles.md), line 116.

```reaction
when RequestBoundary.request (path: "/profiles/mine", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Profiles.Reads.Mine:has-profile#2

Authored path: `Profiles.Reads.Mine`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 110.
- Covered by [Profiles](../design/compositions/Profiles.md), line 116.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Profiles.Reads.Mine
where
  ProfileSetting._getProfile (user) has (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, profile, role, skills, university, visible)
  whether ProfileSetting._getProfile (user) has (startupPitch)
  earlier, RequestBoundary.request (path: "/profiles/mine", requestId, session)
then
  RequestBoundary.respond (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, profile, requestId, role, skills, startupPitch, university, visible)
```

### Profiles.Reads.Mine:no-profile#2

Authored path: `Profiles.Reads.Mine`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 110.
- Covered by [Profiles](../design/compositions/Profiles.md), line 116.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Profiles.Reads.Mine
where
  no ProfileSetting._getProfile (user)
  earlier, RequestBoundary.request (path: "/profiles/mine", requestId, session)
then
  RequestBoundary.respond (error: "NO_PROFILE", requestId)
```

### Profiles.Refreshing.RefreshOnPitch

Authored path: `Profiles.Refreshing.RefreshOnPitch`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 19.

```reaction
when ProfileSetting.setStartupPitch (user)
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityForward, interests: userInterestsForward, latitude: userLatitudeForward, longitude: userLongitudeForward, skills: userSkillsForward, university: userUniversityForward, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityForward, candidate: candidateForward, interests: candidateInterestsForward, latitude: candidateLatitudeForward, longitude: candidateLongitudeForward, skills: candidateSkillsForward, university: candidateUniversityForward)
then
  Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward)
```

### Profiles.Refreshing.RefreshOnPitch#2

Authored path: `Profiles.Refreshing.RefreshOnPitch`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 19.

```reaction
when Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward), asked by Profiles.Refreshing.RefreshOnPitch
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityBack, interests: userInterestsBack, latitude: userLatitudeBack, longitude: userLongitudeBack, skills: userSkillsBack, university: userUniversityBack, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityBack, candidate: candidateBack, interests: candidateInterestsBack, latitude: candidateLatitudeBack, longitude: candidateLongitudeBack, skills: candidateSkillsBack, university: candidateUniversityBack)
then
  Recommending.refreshRecommendation (candidate: user, candidateAvailability: userAvailabilityBack, candidateInterests: userInterestsBack, candidateLatitude: userLatitudeBack, candidateLongitude: userLongitudeBack, candidateSkills: userSkillsBack, candidateUniversity: userUniversityBack, viewer: candidateBack, viewerAvailability: candidateAvailabilityBack, viewerInterests: candidateInterestsBack, viewerLatitude: candidateLatitudeBack, viewerLongitude: candidateLongitudeBack, viewerSkills: candidateSkillsBack, viewerUniversity: candidateUniversityBack)
```

### Profiles.Refreshing.RefreshOnPublish

Authored path: `Profiles.Refreshing.RefreshOnPublish`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 17.

```reaction
when ProfileSetting.publishProfile (user)
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityForward, interests: userInterestsForward, latitude: userLatitudeForward, longitude: userLongitudeForward, skills: userSkillsForward, university: userUniversityForward, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityForward, candidate: candidateForward, interests: candidateInterestsForward, latitude: candidateLatitudeForward, longitude: candidateLongitudeForward, skills: candidateSkillsForward, university: candidateUniversityForward)
then
  Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward)
```

### Profiles.Refreshing.RefreshOnPublish#2

Authored path: `Profiles.Refreshing.RefreshOnPublish`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 17.

```reaction
when Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward), asked by Profiles.Refreshing.RefreshOnPublish
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityBack, interests: userInterestsBack, latitude: userLatitudeBack, longitude: userLongitudeBack, skills: userSkillsBack, university: userUniversityBack, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityBack, candidate: candidateBack, interests: candidateInterestsBack, latitude: candidateLatitudeBack, longitude: candidateLongitudeBack, skills: candidateSkillsBack, university: candidateUniversityBack)
then
  Recommending.refreshRecommendation (candidate: user, candidateAvailability: userAvailabilityBack, candidateInterests: userInterestsBack, candidateLatitude: userLatitudeBack, candidateLongitude: userLongitudeBack, candidateSkills: userSkillsBack, candidateUniversity: userUniversityBack, viewer: candidateBack, viewerAvailability: candidateAvailabilityBack, viewerInterests: candidateInterestsBack, viewerLatitude: candidateLatitudeBack, viewerLongitude: candidateLongitudeBack, viewerSkills: candidateSkillsBack, viewerUniversity: candidateUniversityBack)
```

### Profiles.Refreshing.RefreshOnUpdate

Authored path: `Profiles.Refreshing.RefreshOnUpdate`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 18.

```reaction
when ProfileSetting.updateProfile (user)
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityForward, interests: userInterestsForward, latitude: userLatitudeForward, longitude: userLongitudeForward, skills: userSkillsForward, university: userUniversityForward, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityForward, candidate: candidateForward, interests: candidateInterestsForward, latitude: candidateLatitudeForward, longitude: candidateLongitudeForward, skills: candidateSkillsForward, university: candidateUniversityForward)
then
  Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward)
```

### Profiles.Refreshing.RefreshOnUpdate#2

Authored path: `Profiles.Refreshing.RefreshOnUpdate`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 18.

```reaction
when Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward), asked by Profiles.Refreshing.RefreshOnUpdate
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityBack, interests: userInterestsBack, latitude: userLatitudeBack, longitude: userLongitudeBack, skills: userSkillsBack, university: userUniversityBack, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityBack, candidate: candidateBack, interests: candidateInterestsBack, latitude: candidateLatitudeBack, longitude: candidateLongitudeBack, skills: candidateSkillsBack, university: candidateUniversityBack)
then
  Recommending.refreshRecommendation (candidate: user, candidateAvailability: userAvailabilityBack, candidateInterests: userInterestsBack, candidateLatitude: userLatitudeBack, candidateLongitude: userLongitudeBack, candidateSkills: userSkillsBack, candidateUniversity: userUniversityBack, viewer: candidateBack, viewerAvailability: candidateAvailabilityBack, viewerInterests: candidateInterestsBack, viewerLatitude: candidateLatitudeBack, viewerLongitude: candidateLongitudeBack, viewerSkills: candidateSkillsBack, viewerUniversity: candidateUniversityBack)
```

### Profiles.Requests.Create

Authored path: `Profiles.Requests.Create`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 59.
- Covered by [Profiles](../design/compositions/Profiles.md), line 67.

```reaction
when RequestBoundary.request (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, path: "/profiles/create", requestId, role, session, skills, university)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Profiles.Requests.Create#2

Authored path: `Profiles.Requests.Create`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 59.
- Covered by [Profiles](../design/compositions/Profiles.md), line 67.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Profiles.Requests.Create
where
  earlier, RequestBoundary.request (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, path: "/profiles/create", requestId, role, session, skills, university)
then
  ProfileSetting.createProfile (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, role, skills, university, user)
```

### Profiles.Requests.Create#3

Authored path: `Profiles.Requests.Create`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 59.
- Covered by [Profiles](../design/compositions/Profiles.md), line 67.

```reaction
when ProfileSetting.createProfile (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, role, skills, university, user, profile), asked by Profiles.Requests.Create#2
where
  earlier, RequestBoundary.request (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, path: "/profiles/create", requestId, role, session, skills, university)
then
  RequestBoundary.respond (profile, requestId)
```

### Profiles.Requests.Publish

Authored path: `Profiles.Requests.Publish`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 97.
- Covered by [Profiles](../design/compositions/Profiles.md), line 105.

```reaction
when RequestBoundary.request (path: "/profiles/publish", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Profiles.Requests.Publish#2

Authored path: `Profiles.Requests.Publish`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 97.
- Covered by [Profiles](../design/compositions/Profiles.md), line 105.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Profiles.Requests.Publish
then
  ProfileSetting.publishProfile (user)
```

### Profiles.Requests.Publish#3

Authored path: `Profiles.Requests.Publish`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 97.
- Covered by [Profiles](../design/compositions/Profiles.md), line 105.

```reaction
when ProfileSetting.publishProfile (user), asked by Profiles.Requests.Publish#2
at the flow's settlement frontier
where
  earlier, RequestBoundary.request (path: "/profiles/publish", requestId, session)
then
  RequestBoundary.respond (published: true, requestId)
```

### Profiles.Requests.SetPitch

Authored path: `Profiles.Requests.SetPitch`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 85.
- Covered by [Profiles](../design/compositions/Profiles.md), line 92.

```reaction
when RequestBoundary.request (path: "/profiles/set-pitch", pitch, requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Profiles.Requests.SetPitch#2

Authored path: `Profiles.Requests.SetPitch`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 85.
- Covered by [Profiles](../design/compositions/Profiles.md), line 92.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Profiles.Requests.SetPitch
where
  earlier, RequestBoundary.request (path: "/profiles/set-pitch", pitch, requestId, session)
then
  ProfileSetting.setStartupPitch (pitch, user)
```

### Profiles.Requests.SetPitch#3

Authored path: `Profiles.Requests.SetPitch`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 85.
- Covered by [Profiles](../design/compositions/Profiles.md), line 92.

```reaction
when ProfileSetting.setStartupPitch (pitch, user), asked by Profiles.Requests.SetPitch#2
at the flow's settlement frontier
where
  earlier, RequestBoundary.request (path: "/profiles/set-pitch", pitch, requestId, session)
then
  RequestBoundary.respond (pitchSet: true, requestId)
```

### Profiles.Requests.Update

Authored path: `Profiles.Requests.Update`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 72.
- Covered by [Profiles](../design/compositions/Profiles.md), line 80.

```reaction
when RequestBoundary.request (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, path: "/profiles/update", requestId, session, skills, university)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Profiles.Requests.Update#2

Authored path: `Profiles.Requests.Update`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 72.
- Covered by [Profiles](../design/compositions/Profiles.md), line 80.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Profiles.Requests.Update
where
  earlier, RequestBoundary.request (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, path: "/profiles/update", requestId, session, skills, university)
then
  ProfileSetting.updateProfile (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, skills, university, user)
```

### Profiles.Requests.Update#3

Authored path: `Profiles.Requests.Update`.
- Covered by [Profiles](../design/compositions/Profiles.md), line 72.
- Covered by [Profiles](../design/compositions/Profiles.md), line 80.

```reaction
when ProfileSetting.updateProfile (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, skills, university, user), asked by Profiles.Requests.Update#2
at the flow's settlement frontier
where
  earlier, RequestBoundary.request (availability, experience, graduationYear, interests, latitude, location, longitude, major, name, path: "/profiles/update", requestId, session, skills, university)
then
  RequestBoundary.respond (requestId, updated: true)
```

### Recommendations.Reads.Feed

Authored path: `Recommendations.Reads.Feed`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 64.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 71.

```reaction
when RequestBoundary.request (path: "/recommendations/feed", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Recommendations.Reads.Feed#2

Authored path: `Recommendations.Reads.Feed`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 64.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 71.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Reads.Feed
where
  earlier, RequestBoundary.request (path: "/recommendations/feed", requestId, session)
then
  RequestBoundary.respond (feed: former "the feed of (viewer)" with (viewer: user), requestId)
```

### Recommendations.Reads.Preferences

Authored path: `Recommendations.Reads.Preferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 53.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 59.

```reaction
when RequestBoundary.request (path: "/recommendations/preferences", requestId, session)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Recommendations.Reads.Preferences:defaults#2

Authored path: `Recommendations.Reads.Preferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 53.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 59.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Reads.Preferences
where
  no Recommending._getPreferences (user)
  earlier, RequestBoundary.request (path: "/recommendations/preferences", requestId, session)
then
  RequestBoundary.respond (availability: null, distance: null, interests: [], requestId, skills: [], universities: [])
```

### Recommendations.Reads.Preferences:saved#2

Authored path: `Recommendations.Reads.Preferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 53.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 59.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Reads.Preferences
where
  Recommending._getPreferences (user) has (interests, skills, universities)
  whether Recommending._getPreferences (user) has (distance)
  whether Recommending._getPreferences (user) has (availability)
  earlier, RequestBoundary.request (path: "/recommendations/preferences", requestId, session)
then
  RequestBoundary.respond (availability, distance, interests, requestId, skills, universities)
```

### Recommendations.Refreshing.RefreshOnPreferences

Authored path: `Recommendations.Refreshing.RefreshOnPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 29.

```reaction
when Recommending.setPreferences (user)
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityForward, interests: userInterestsForward, latitude: userLatitudeForward, longitude: userLongitudeForward, skills: userSkillsForward, university: userUniversityForward, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityForward, candidate: candidateForward, interests: candidateInterestsForward, latitude: candidateLatitudeForward, longitude: candidateLongitudeForward, skills: candidateSkillsForward, university: candidateUniversityForward)
then
  Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward)
```

### Recommendations.Refreshing.RefreshOnPreferences#2

Authored path: `Recommendations.Refreshing.RefreshOnPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 29.

```reaction
when Recommending.refreshRecommendation (candidate: candidateForward, candidateAvailability: candidateAvailabilityForward, candidateInterests: candidateInterestsForward, candidateLatitude: candidateLatitudeForward, candidateLongitude: candidateLongitudeForward, candidateSkills: candidateSkillsForward, candidateUniversity: candidateUniversityForward, viewer: user, viewerAvailability: userAvailabilityForward, viewerInterests: userInterestsForward, viewerLatitude: userLatitudeForward, viewerLongitude: userLongitudeForward, viewerSkills: userSkillsForward, viewerUniversity: userUniversityForward), asked by Recommendations.Refreshing.RefreshOnPreferences
where
  ProfileSetting._recommendationData (user) has (availability: userAvailabilityBack, interests: userInterestsBack, latitude: userLatitudeBack, longitude: userLongitudeBack, skills: userSkillsBack, university: userUniversityBack, visible: true)
  ProfileSetting._visibleCandidates (user) has (availability: candidateAvailabilityBack, candidate: candidateBack, interests: candidateInterestsBack, latitude: candidateLatitudeBack, longitude: candidateLongitudeBack, skills: candidateSkillsBack, university: candidateUniversityBack)
then
  Recommending.refreshRecommendation (candidate: user, candidateAvailability: userAvailabilityBack, candidateInterests: userInterestsBack, candidateLatitude: userLatitudeBack, candidateLongitude: userLongitudeBack, candidateSkills: userSkillsBack, candidateUniversity: userUniversityBack, viewer: candidateBack, viewerAvailability: candidateAvailabilityBack, viewerInterests: candidateInterestsBack, viewerLatitude: candidateLatitudeBack, viewerLongitude: candidateLongitudeBack, viewerSkills: candidateSkillsBack, viewerUniversity: candidateUniversityBack)
```

### Recommendations.Requests.SetPreferences

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
where
  time is the current flow's instant
then
  Sessioning.current (now: time, session)
```

### Recommendations.Requests.SetPreferences:availability-only#2

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Requests.SetPreferences
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
  hasDistance is numberSupplied (value: distance)
  hasDistance is among [false]
  hasAvailability is numberSupplied (value: availability)
  hasAvailability is among [true]
then
  Recommending.setPreferences (availability, interests, skills, universities, user)
```

### Recommendations.Requests.SetPreferences:availability-only#3

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Recommending.setPreferences (availability, interests, skills, universities, user), asked by Recommendations.Requests.SetPreferences:availability-only#2
at the flow's settlement frontier
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
then
  RequestBoundary.respond (requestId, saved: true)
```

### Recommendations.Requests.SetPreferences:distance-and-availability#2

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Requests.SetPreferences
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
  hasDistance is numberSupplied (value: distance)
  hasDistance is among [true]
  hasAvailability is numberSupplied (value: availability)
  hasAvailability is among [true]
then
  Recommending.setPreferences (availability, distance, interests, skills, universities, user)
```

### Recommendations.Requests.SetPreferences:distance-and-availability#3

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Recommending.setPreferences (availability, distance, interests, skills, universities, user), asked by Recommendations.Requests.SetPreferences:distance-and-availability#2
at the flow's settlement frontier
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
then
  RequestBoundary.respond (requestId, saved: true)
```

### Recommendations.Requests.SetPreferences:distance-only#2

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Requests.SetPreferences
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
  hasDistance is numberSupplied (value: distance)
  hasDistance is among [true]
  hasAvailability is numberSupplied (value: availability)
  hasAvailability is among [false]
then
  Recommending.setPreferences (distance, interests, skills, universities, user)
```

### Recommendations.Requests.SetPreferences:distance-only#3

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Recommending.setPreferences (distance, interests, skills, universities, user), asked by Recommendations.Requests.SetPreferences:distance-only#2
at the flow's settlement frontier
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
then
  RequestBoundary.respond (requestId, saved: true)
```

### Recommendations.Requests.SetPreferences:no-numbers#2

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Requests.SetPreferences
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
  hasDistance is numberSupplied (value: distance)
  hasDistance is among [false]
  hasAvailability is numberSupplied (value: availability)
  hasAvailability is among [false]
then
  Recommending.setPreferences (interests, skills, universities, user)
```

### Recommendations.Requests.SetPreferences:no-numbers#3

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Recommending.setPreferences (interests, skills, universities, user), asked by Recommendations.Requests.SetPreferences:no-numbers#2
at the flow's settlement frontier
where
  ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
then
  RequestBoundary.respond (requestId, saved: true)
```

### Recommendations.Requests.SetPreferences:no-profile#2

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when Sessioning.current (now: time, session, subject: user), asked by Recommendations.Requests.SetPreferences
where
  no ProfileSetting._recommendationData (user)
  earlier, RequestBoundary.request (availability, distance, interests, path: "/recommendations/set-preferences", requestId, session, skills, universities)
then
  RequestBoundary.respond (error: "PREFERENCES_NEED_PROFILE", requestId)
```

### Recommendations.Requests.SetPreferences:no-profile#3

Authored path: `Recommendations.Requests.SetPreferences`.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 14.
- Covered by [Recommendations](../design/compositions/Recommendations.md), line 43.

```reaction
when RequestBoundary.respond (error: "PREFERENCES_NEED_PROFILE", requestId), asked by Recommendations.Requests.SetPreferences:no-profile#2
at the flow's settlement frontier
where
  earlier, Sessioning.current (now: time, session, subject: user), asked by Recommendations.Requests.SetPreferences
  ProfileSetting._recommendationData (user)
then
  RequestBoundary.respond (requestId, saved: true)
```

## Endpoint input contracts

Before recording an action ask, the boundary rejects a body that is not an
object or lacks a required key. The response uses `INVALID_INPUT` and names
the path or missing key. A declared default fills an absent key. Endpoints
not listed here have no explicit input contract.

- `/accounts/register` — requires `username`, `password`
- `/accounts/sign-in` — requires `username`, `password`
- `/accounts/sign-out` — fills `session` with "" when absent
- `/matching/interested-in-you` — fills `session` with "" when absent
- `/matching/matches` — fills `session` with "" when absent
- `/matching/pass` — requires `other`; fills `session` with "" when absent
- `/matching/show-interest` — requires `other`; fills `session` with "" when absent
- `/matching/unmatch` — requires `other`; fills `session` with "" when absent
- `/notifications/dismiss` — requires `notification`; fills `session` with "" when absent
- `/notifications/list` — fills `session` with "" when absent
- `/notifications/mark-read` — requires `notification`; fills `session` with "" when absent
- `/notifications/unread` — fills `session` with "" when absent
- `/profiles/create` — requires `role`, `name`, `university`, `major`, `graduationYear`, `skills`, `experience`, `interests`, `location`, `latitude`, `longitude`, `availability`; fills `session` with "" when absent
- `/profiles/mine` — fills `session` with "" when absent
- `/profiles/publish` — fills `session` with "" when absent
- `/profiles/set-pitch` — requires `pitch`; fills `session` with "" when absent
- `/profiles/update` — requires `name`, `university`, `major`, `graduationYear`, `skills`, `experience`, `interests`, `location`, `latitude`, `longitude`, `availability`; fills `session` with "" when absent
- `/recommendations/feed` — fills `session` with "" when absent
- `/recommendations/preferences` — fills `session` with "" when absent
- `/recommendations/set-preferences` — requires `skills`, `interests`, `universities`; fills `availability` with null when absent; fills `distance` with null when absent; fills `session` with "" when absent

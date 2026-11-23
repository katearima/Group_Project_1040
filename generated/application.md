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

- `currentInstant() : DateTime` — [Application types and instances](../design/types.md), line 26.
- `matchesLink(user: Authenticating.Account) : String` — [Matching](../design/compositions/Matching.md), line 67.
- `profileLink(user: Authenticating.Account) : String` — [Matching](../design/compositions/Matching.md), line 65.
- `sessionLifetime() : Number` — [Accounts](../design/compositions/Accounts.md), line 10.

## Formers

_Formers name result shapes evaluated when asked. The source former owns_
_the authored explanation; this section records the generated shape._

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

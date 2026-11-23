## 3. MutualMatching

### Purpose

To help people identify when their interest in working together is mutual, so they can focus on potential collaborators who are also interested in them.

### Operational Principle

When a user finds someone interesting, they can press **Show Interest** on that person's profile.

For example, Keti sees Bumba's startup pitch and thinks his idea is interesting. She presses Show Interest.

Bumba can see that Keti is interested in him through the separate **Interested in You** section.

Bumba opens Keti's profile and reads about her skills and experience. If he also presses Show Interest, they become a match.

A match only happens when both people express interest in each other.

If Bumba is not interested, he can pass instead. Keti will not receive a notification that he passed.

Users can also unmatch later if they no longer want to stay connected. Passing is permanent in this version. Unmatching records a pass in both directions, so the same pair cannot match again.

### State

```text
concept MutualMatching [User]

types
  DecisionStatus is INTERESTED or PASSED

state
  a set of Decisions with
    a from User
    a to User
    a status DecisionStatus
    unique from and to

  a set of Matches with
    a first User
    a second User

  Rule: Users cannot express interest in themselves.
  Rule: A match is an unordered pair of users.
  Rule: A pair can have at most one active match.
  Rule: A match exists exactly when both users have INTERESTED decisions about each other.
```

### Actions

**showInterest**

```text
showInterest(from: User, to: User)
  where from and to are different users
  and they are not already matched
  and from has not already made a decision about to
  then
    record that from is INTERESTED in to

    if to has already expressed interest in from:
      create a match between from and to
```

**pass**

```text
pass(from: User, to: User)
  where from and to are different users
  and they are not already matched
  and from has not already expressed interest in to
  then
    create a PASSED decision from from to to if none exists
    otherwise keep the existing PASSED decision without
      creating a second record
```

**unmatch**

```text
unmatch(user: User, other: User)
  where user and other have an active match
  then
    remove the match
    change the two existing decisions to PASSED
```

### Queries

**\_getInterestedInYou**

```text
_getInterestedInYou(user: User):
  many (from: User)
```

Returns all users with an INTERESTED decision about the given user, excluding people the user has already passed on or matched with. Returns no results when there are none, including an unknown user. Their order is unspecified.

**\_getMatches**

```text
_getMatches(user: User):
  many (other: User)
```

Returns all users who currently have an active match with the given user, or no results when there are none, including an unknown user. Their order is unspecified.

---

## 4. Notifying

### Purpose

To help users stay informed about relevant activity without having to constantly check the platform, so they don't miss opportunities to connect with people who are interested in them.

### Operational Principle

When something relevant happens, the user receives a notification.

For example, Keti presses Show Interest on Bumba's profile. Bumba gets a notification saying that Keti is interested in him.

Bumba can open the notification to view Keti's profile.

If Bumba also shows interest in Keti, both receive a notification that they matched.

Users can also receive notifications when someone they have matched with sends a new message.

Reading a notification marks it as read, but it stays in the notification list until the user dismisses it. Dismissing a notification does not undo the action that caused it.

### State

```text
concept Notifying [User]

types
  NotificationStatus is UNREAD or READ or DISMISSED

state
  a set of Notifications with
    a recipient User
    a message String
    a link String
    a createdAt DateTime
    a status NotificationStatus

  Rule: Every notification has exactly one recipient.
  Rule: New notifications are initially UNREAD.
```

### Actions

**notify**

```text
notify(
  recipient: User,
  message: String,
  link: String
): returns (notification: Notification)
  where message is not empty
  then
    create a notification
    set its recipient, message, and link to the supplied values
    set its status to UNREAD
    record the creation time
    return notification
```

**markAsRead**

```text
markAsRead(user: User, notification: Notification)
  where notification belongs to user
  and notification is not DISMISSED
  then
    change status to READ
```

**dismissNotification**

```text
dismissNotification(
  user: User,
  notification: Notification
)
  where notification belongs to user
  then
    change status to DISMISSED
```

### Queries

**\_getNotifications**

```text
_getNotifications(user: User):
  many (notification: Notification)
```

Returns the user's notifications, excluding dismissed notifications, ordered from newest to oldest. Returns no results when there are none, including an unknown user. Notifications created at the same time may appear in any order.

**\_getUnreadNotifications**

```text
_getUnreadNotifications(user: User):
  many (notification: Notification)
```

Returns all notifications belonging to the user that are marked `UNREAD`, ordered from newest to oldest. Returns no results when there are none, including an unknown user. Notifications created at the same time may appear in any order.

---

## 5. Chatting

### Purpose

To help people who have connected discuss their ideas and expectations privately, so they can decide whether they would actually want to work together.

### Operational Principle

When two people connect, they can start a private conversation.

For example, Keti and Bumba have both expressed interest in each other. A chat becomes available between them.

Keti can ask Bumba more about his startup idea, and Bumba can ask about her experience, interests, and availability.

They can continue exchanging messages and decide whether they would want to meet or try working on something together.

Their messages are saved so they can return to the conversation later.

If their connection ends, the conversation can be closed. They can no longer send new messages, but the previous messages are preserved.

### State

```text
concept Chatting [User]

types
  ConversationStatus is OPEN or CLOSED

state
  a set of Conversations with
    a firstUser User
    a secondUser User
    a status ConversationStatus

  a set of Messages with
    a conversation Conversation
    a sender User
    a content String
    a sentAt DateTime

  Rule: Every conversation has two different users.
  Rule: A pair of users has at most one conversation.
  Rule: A message sender must be a participant in the conversation.
  Rule: Messages must contain nonempty text.
```

### Actions

**createConversation**

```text
createConversation(
  firstUser: User,
  secondUser: User
): returns (conversation: Conversation)
  where users are different
  and no conversation exists between them
  then
    create a conversation between the users
    set its status to OPEN
    return conversation
```

**sendMessage**

```text
sendMessage(
  conversation: Conversation,
  sender: User,
  content: String
): returns (message: Message)
  where conversation exists
  and status is OPEN
  and sender is a participant
  and content is not empty
  then
    create a message with the given content
    associate it with the conversation
    record the sender and current time
    return message
```

**closeConversation**

```text
closeConversation(conversation: Conversation)
  where conversation exists
  and status is OPEN
  then
    set status to CLOSED
```

### Queries

**\_getConversations**

```text
_getConversations(user: User):
  many (conversation: Conversation)
```

Returns all conversations in which the user is a participant, including closed conversations so they can return to their previous messages. Open and closed conversations are shown separately by the app. Returns no results when there are none, including an unknown user. Their order is unspecified.

**\_getMessages**

```text
_getMessages(
  user: User,
  conversation: Conversation
): many (message: Message)
```

Returns all messages in the conversation, ordered from oldest to newest, if the user is a participant. Returns no results if the conversation does not exist, has no messages, or the user is not a participant, including an unknown user. Messages sent at the same time may appear in any order.

Participants can still view previous messages after a conversation is closed, but they cannot send new ones.

---

# 6. Reactions

Reactions define how the five concepts work together. Each concept has its own state and actions, and reactions connect their behaviors without requiring the concepts to call one another directly.

### Requests from Users

The five concepts do not call each other or check each other's state. The app accepts requests from signed-in users and uses reactions to decide which concept actions can happen. `Requesting` below represents this application boundary, not a sixth main feature concept. The signed-in user comes from the authenticated session; someone cannot supply another person's identity to act as them.

Only the requests listed below are available to users. Recommendation refreshes, feed-status updates, notification creation, and conversation creation and closing happen only through reactions. A request that does not meet its conditions does not cause the concept action to happen. The app finishes the resulting reactions before handling another request involving the same users or conversation.

| Request                          | Conditions and resulting action                                                                                                                                                                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create a profile                 | `Requesting.createProfile(user, ...)` triggers `ProfileSetting.createProfile` through a reaction for the signed-in user with the supplied fields. The action's validation still applies.                                                                                           |
| Edit, publish, or hide a profile | `Requesting.updateProfile`, `setStartupPitch`, `publishProfile`, and `hideProfile` act only on the signed-in user's profile. Each triggers the corresponding ProfileSetting action when its preconditions hold.                                                                    |
| Set preferences                  | `Requesting.setPreferences(user, ...)` requires that the signed-in user has a profile, then triggers `Recommending.setPreferences` for that user. Preferences belong only to that user.                                                                                            |
| Show Interest                    | `Requesting.showInterest(user, other)` follows the guarded reaction below.                                                                                                                                                                                                         |
| Pass                             | `Requesting.pass(user, other)` requires an existing recommendation from user to other, or an incoming INTERESTED decision from other to user. It triggers `MutualMatching.pass` only if its preconditions hold. A hidden profile does not prevent dismissing an existing interest. |
| See Later                        | `Requesting.seeLater(user, other)` requires an eligible AVAILABLE recommendation for the signed-in viewer, then triggers `Recommending.seeLater`.                                                                                                                                  |
| Begin browsing                   | `Requesting.startNewSession(user)` requires a visible profile and the beginning of a new browsing session, then triggers `Recommending.startNewSession` for that user.                                                                                                             |
| Unmatch                          | `Requesting.unmatch(user, other)` requires an active match involving the signed-in user, then triggers `MutualMatching.unmatch`.                                                                                                                                                   |
| Send a message                   | `Requesting.sendMessage(user, conversation, content)` follows the guarded reaction below.                                                                                                                                                                                          |
| Read or dismiss a notification   | `Requesting.markAsRead` and `dismissNotification` require that the notification belongs to the signed-in user, then trigger the corresponding Notifying action when its preconditions hold.                                                                                        |

```text
when Requesting.showInterest(user, other)

where ProfileSetting:
  user and other have visible profiles with opposite roles
and MutualMatching:
  user and other are different and are not already matched
  user has not already made a decision about other

then
  MutualMatching.showInterest(user, other)
```

```text
when Requesting.sendMessage(user, conversation, content)

where Chatting:
  conversation exists and is OPEN
  user is a participant and other is the other participant
  content is nonempty
and MutualMatching:
  user and other have an active match

then
  Chatting.sendMessage(conversation, user, content)
```

The app also limits reading to the signed-in user's own feed, preferences, incoming interests, matches, conversations, and notifications. Message history is available only to the two conversation participants, including after unmatching. A user can view their own profile, visible profiles, and the profile of someone with whom they already have a match or conversation. Hiding a profile removes it from discovery but does not end existing connections. Incoming interests from hidden users can still be passed on, but Show Interest requires both profiles to be visible.

Queries that return a Profile, Preference, Conversation, Message, or Notification return its identity. To display its details, the app reads the relevant fields through the owning concept under the same access rules; it does not treat the identity as an object containing fields from other concepts.

`profileLink`, `matchesLink`, and `conversationLink` below produce navigation links to the relevant profile, the recipient's own matches, or the conversation. Having a link does not bypass these access rules.

## Reaction 1: Creating Recommendations

When someone publishes their profile, the platform generates recommendations between that user and other visible users with the opposite role.

```text
when ProfileSetting.publishProfile(user)

where ProfileSetting:
  user and candidate have visible profiles with opposite roles
  userData and candidateData contain their skills, interests,
    university, latitude, and longitude

then
  Recommending.refreshRecommendation(
    user, candidate, userData, candidateData
  )

  Recommending.refreshRecommendation(
    candidate, user, candidateData, userData
  )
```

This reaction runs for each eligible candidate.

The reaction supplies the two `RecommendationData` values. Recommending calculates the score using its own preferences and the five equally weighted factors. This also applies when a hidden profile is published again; existing decisions are preserved.

## Reaction 2: Updating Recommendations

When someone changes their profile or preferences, their recommendations are recalculated.

```text
when Recommending.setPreferences(user, ...)

where ProfileSetting:
  user and candidate have visible profiles with opposite roles
  userData and candidateData contain their skills, interests,
    university, latitude, and longitude

then
  Recommending.refreshRecommendation(
    user, candidate, userData, candidateData
  )

  Recommending.refreshRecommendation(
    candidate, user, candidateData, userData
  )
```

Two more reactions have exactly the same conditions and effects, triggered separately by `ProfileSetting.updateProfile(user, information)` and `ProfileSetting.setStartupPitch(user, pitch)`. Each reaction runs for every eligible candidate and uses the latest profile information. Startup pitch text does not itself add points. Changes made while hidden take effect when the profile is published again.

Previously passed profiles stay passed even if their compatibility score changes.

## Reaction 3: Hiding a Profile

When someone hides their profile, they should no longer appear in other users' recommendations.

```text
when ProfileSetting.hideProfile(user)

where Recommending:
  a recommendation exists with user
  as either viewer or candidate

then
  Recommending.deactivateRecommendation(
    viewer,
    candidate
  )
```

This reaction applies to every recommendation involving that user.

Hiding a profile does not automatically delete existing matches or conversations.

## Reaction 4: Showing Interest

When a user shows interest in someone, that person is removed from their recommendation feed.

```text
when MutualMatching.showInterest(from, to)

where Recommending:
  a recommendation with viewer from and candidate to exists
  its status is AVAILABLE or SEE_LATER

then
  Recommending.markInterested(from, to)
```

The interest is stored in `MutualMatching`, while `Recommending` only records that the person should no longer appear in the discovery feed.

## Reaction 5: Passing

When a user passes on someone, the decision is reflected in their recommendations.

```text
when MutualMatching.pass(from, to)

where Recommending:
  a recommendation with viewer from and candidate to exists

then
  Recommending.markPassed(from, to)
```

This prevents the passed profile from appearing again.

The same decision applies whether the user passes from their discovery feed or the Interested in You section.

## Reaction 6: Notifying Someone About Interest

When Keti shows interest in Bumba, and they have not matched yet, Bumba receives a notification.

```text
when MutualMatching.showInterest(from, to)

where MutualMatching:
  no match exists between from and to
  to has not already passed on from
and ProfileSetting:
  from has a profile with name fromName

then
  Notifying.notify(
    to,
    "[fromName] is interested in you!",
    profileLink(from)
  )
```

Here, `[fromName]` is replaced with the name read by the reaction. Bumba can click the notification to see Keti's profile.

Keti will also appear in his Interested in You section, which gets its information directly from `MutualMatching`.

If Bumba dismisses the notification, Keti still appears in Interested in You.

## Reaction 7: Creating a Chat After a Match

When both users show interest in each other, a match is created and a chat becomes available.

```text
when MutualMatching.showInterest(from, to)

where MutualMatching:
  a match now exists between from and to
and Chatting:
  no conversation exists between them

then
  Chatting.createConversation(from, to)
```

The `showInterest` precondition means the pair was not matched before this action. If a match exists afterward, this action created it. For example, Keti has already shown interest in Bumba. When Bumba shows interest back, a match is created and their private conversation becomes available.

## Reaction 8: Sending Match Notifications

When a new match is created, both people receive a notification.

```text
when MutualMatching.showInterest(from, to)

where MutualMatching:
  a match now exists between from and to

then
  Notifying.notify(
    from,
    "It's a match!",
    matchesLink(from)
  )

  Notifying.notify(
    to,
    "It's a match!",
    matchesLink(to)
  )
```

The users can open their Matches section and start chatting.

## Reaction 9: Notifying About New Messages

When one person sends a message, the other person receives a notification.

```text
when Chatting.sendMessage(
  conversation,
  sender,
  content
)

where Chatting:
  recipient is the other participant
  in the conversation

then
  Notifying.notify(
    recipient,
    "You have a new message!",
    conversationLink(conversation)
  )
```

For example, Keti sends Bumba a message asking about his startup. Bumba receives a notification and can open their conversation.

## Reaction 10: Closing Chat After Unmatching

When either person unmatches, their chat is closed.

```text
when MutualMatching.unmatch(user, other)

where Chatting:
  an OPEN conversation exists
  between user and other

then
  Chatting.closeConversation(conversation)
```

Neither person can send new messages after unmatching.

Their previous messages remain saved, but the conversation is no longer active.

Unmatching also removes both people from each other's discovery feeds:

```text
when MutualMatching.unmatch(user, other)

where Recommending:
  a recommendation exists with viewer and candidate
    equal to user and other in either direction

then
  Recommending.markPassed(viewer, candidate)
```

This applies to each existing direction, keeping the feed decisions consistent with the passes recorded by MutualMatching.


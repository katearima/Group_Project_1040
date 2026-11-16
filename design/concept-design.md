# Startup Matching App — Concept Design

## 1. ProfileSetting

### Purpose

To help people present their skills, interests, and what they are looking for, so potential collaborators can understand whether they would be a good fit without having to reach out to everyone individually.

### Operational Principle

When someone joins the platform, they create a profile and choose whether they are a founder looking for teammates or a student looking to join a startup. A user can only choose one role.

Both founders and builders enter their name, university, major, graduation year, skills, experience, interests, location, and availability.

Founders also describe their startup idea and what kind of teammates they need.

Both sides can also enter their matching preferences during the same setup process. These preferences belong to Recommending, which uses them to decide which people to show first.

For example, Keti is an MIT student interested in working at an early-stage startup. She creates a profile, adds her software engineering skills, and indicates that she is interested in data tools and can commit 10 hours per week.

Bumba is a BU student with a startup idea. He creates a founder profile describing his idea and the skills he needs in a co-founder.

Both can update their profiles as their interests change. They can publish their profiles when they are ready for other people to discover them, and hide them when they want to stop appearing in recommendations.

### State

```text
concept ProfileSetting [User]

types
  Role is FOUNDER or BUILDER

state
  a set of Profiles with
    a unique owner User
    a role Role
    a name String
    a university String
    a major String
    a graduationYear Number
    a skills set of String
    an experience String
    an interests set of String
    a location String
    a latitude Number
    a longitude Number
    an availabilityHours Number
    an optional startupPitch String
    a visible Flag

  Rule: A user has at most one profile.
  Rule: A user can have only one role.
  Rule: Only founders can have startup pitches.
  Rule: Availability cannot be negative.
  Rule: Graduation year is a positive whole number.
  Rule: Latitude is between -90 and 90 and longitude is between -180 and 180.
  Rule: A visible profile meets the publication requirements below.
```

The location is a named place, such as a campus or neighborhood, with latitude and longitude in degrees. It does not need to be a home address. Coordinates must be valid even while a profile is hidden.

For a profile to be published, its name, university, major, and location must contain nonempty text, and its skills and interests must each contain at least one nonempty entry. Graduation year must be a positive whole number, and availability must be zero or more hours per week. Experience can be empty. Founders must also have a nonempty startup pitch.

Here and below, text containing only spaces counts as empty. Skill and interest entries cannot be empty. Draft profiles can have empty text fields or empty sets until they are ready to be published.

### Actions

**createProfile**

```text
createProfile(
  user: User,
  role: Role,
  name: String,
  university: String,
  major: String,
  graduationYear: Number,
  skills: set of String,
  experience: String,
  interests: set of String,
  location: String,
  latitude: Number,
  longitude: Number,
  availabilityHours: Number
)
  where user does not already have a profile
  and availabilityHours is nonnegative
  and graduationYear is a positive whole number
  and latitude and longitude are within their allowed ranges
  and every supplied skill and interest entry is nonempty
  then
    create a profile with the given information and owner user
    leave startupPitch absent
    set visible to false
```

**setStartupPitch**

```text
setStartupPitch(user: User, pitch: String)
  where user has a profile with role FOUNDER
  and pitch is nonempty
  then
    set startupPitch to pitch
```

**updateProfile**

```text
updateProfile(user: User, information: ProfileData)
  where user has a profile
  and information has nonnegative availabilityHours
  and information has a positive whole-number graduationYear
  and its latitude and longitude are within their allowed ranges
  and every supplied skill and interest entry is nonempty
  and, if the profile is visible, the updated profile still
      meets all publication requirements
  then
    replace the editable profile fields with information
    keep the owner, role, startupPitch, and visibility unchanged
```

Here, `ProfileData` is a value containing `name: String`, `university: String`, `major: String`, `graduationYear: Number`, `skills: set of String`, `experience: String`, `interests: set of String`, `location: String`, `latitude: Number`, `longitude: Number`, and `availabilityHours: Number`. All these fields are supplied when updating a profile. It does not include owner, role, startup pitch, preferences, or visibility. Startup pitches are changed only through `setStartupPitch`.

**publishProfile**

```text
publishProfile(user: User)
  where user has a profile
  and the profile meets all publication requirements above
  then
    set visible to true
```

**hideProfile**

```text
hideProfile(user: User)
  where user has a visible profile
  then
    set visible to false
```

### Queries

**_getProfile**

```text
_getProfile(user: User): optional (profile: Profile)
```

Returns the user's profile, or no result if it does not exist.

**_getVisibleProfiles**

```text
_getVisibleProfiles(): many (profile: Profile)
```

Returns all profiles currently visible on the platform, or no results if there are none. Their order is unspecified.

---

## 2. Recommending

### Purpose

To reduce choice overload by prioritizing people who are likely to be a good fit, so users don't have to go through hundreds of unrelated startup listings and potentially miss someone compatible.

### Operational Principle

Instead of showing everyone in one long list, the platform recommends people based on their compatibility. Users can choose the skills, interests, universities, distance, and availability they prefer, and change these preferences later.

Recommendations consider shared interests, complementary skills, university preferences, availability, and physical proximity. All five factors have equal weight in the ranking. A factor with no stated preference does not lower the score; for interests, the user's own interests are used instead.

For example, Keti has software engineering experience and is interested in data tools. Bumba is building a data tool and needs a technical co-founder. Even though they attend different universities, Bumba appears high in Keti's recommendations because their interests and skills align.

When Keti sees a profile, she can choose:

- **Show Interest:** She wants to connect with that person.
- **Pass:** She is not interested and doesn't want to see that profile again.
- **See Later:** She is not sure yet, so the profile is removed from her current feed but may be recommended again in a future browsing session.

The feed changes as users update their preferences, new people join, and users make decisions about the profiles they see.

### State

```text
concept Recommending [User]

types
  RecommendationStatus is AVAILABLE or SEE_LATER or PASSED or INTERESTED

state
  a set of Preferences with
    a unique owner User
    a preferredSkills set of String
    a preferredInterests set of String
    a preferredUniversities set of String
    an optional preferredDistance Number
    an optional preferredAvailability Number

  a set of Recommendations with
    a viewer User
    a candidate User
    a score Number
    a status RecommendationStatus
    an eligible Flag
    unique viewer and candidate

  Rule: A user cannot be recommended to themselves.
  Rule: Each viewer-candidate pair has at most one recommendation.
  Rule: Preferred distance and availability, when present, cannot be negative.
  Rule: Scores are between 0 and 1.
```

Empty preference sets mean that the user has not selected a preference. An absent preferred distance means there is no distance preference, and an absent preferred availability means there is no minimum time commitment. Distance is measured in kilometers, and availability is measured in hours per week. A user who has never saved preferences uses these same defaults.

`RecommendationData` is a value containing `skills: set of String`, `interests: set of String`, `university: String`, `latitude: Number`, `longitude: Number`, and `availabilityHours: Number`. Its sets contain nonempty entries, its university is nonempty, latitude is between -90 and 90, longitude is between -180 and 180, and availability is nonnegative. These are copies of relevant information supplied to an action, not profile objects that Recommending can look inside or change.

### How the Score Is Calculated

For the initial version, each of the five factors gets a score between 0 and 1. The final score is their average. Skills, interests, and university names are compared after removing spaces at the beginning and end and ignoring capitalization. Entries that become the same after this step count only once.

- **Skills:** First, find the fraction of the viewer's preferred skills that the candidate has. Then find the fraction of the candidate's preferred skills that the viewer has. Average these two numbers. An empty set of preferred skills gives 1 for that direction. This means Bumba's preference for software engineering can help him match with Keti even if Keti has not selected any preferred skills herself.
- **Interests:** Find the fraction of the viewer's preferred interests that the candidate has. If the viewer has not chosen preferred interests, use the viewer's own interests instead. If that set is also empty, this factor is 1.
- **University:** Give 1 if the viewer has no university preference or the candidate attends one of the selected universities. Otherwise, give 0. No university gets extra points because of its name or reputation.
- **Availability:** Give 1 if the viewer has no preferred minimum or the minimum is zero. Otherwise, divide the candidate's availability by the viewer's preferred minimum, with a maximum of 1.
- **Proximity:** Give 1 if the viewer has no preferred distance. Otherwise, the score is `max(0, 1 - distance / preferredDistance)`. If preferred distance is zero, give 1 only when the distance is zero, and 0 otherwise.

Distance is the shortest distance between the two coordinates along the Earth's surface, in kilometers, without following roads or transit routes. Use the great-circle distance on a sphere with radius 6,371 kilometers. Two locations with the same coordinates have distance zero, even if their names differ.

For example, if the five factor scores are 1, 0.5, 1, 1, and 0.5, the final score is 0.8. A preference affects ranking, not whether a visible person with the opposite role can appear at all. Scores in the two directions can differ because the users may have different preferences.

### Actions

**setPreferences**

```text
setPreferences(
  user: User,
  skills: set of String,
  interests: set of String,
  universities: set of String,
  distance?: Number,
  availability?: Number
)
  where distance and availability, when supplied, are nonnegative
  and every supplied skill, interest, and university entry is nonempty
  then
    create a preference record with owner user if one does not exist
    replace preferredSkills, preferredInterests, and
      preferredUniversities with the supplied sets
    set preferredDistance and preferredAvailability to
      the supplied numbers, clearing either if omitted
```

**refreshRecommendation**

```text
refreshRecommendation(
  viewer: User,
  candidate: User,
  viewerData: RecommendationData,
  candidateData: RecommendationData
)
  where viewer and candidate are different users
  and both data values meet the requirements described above
  then
    calculate the score using the five-factor rule,
      the supplied data, and the preferences stored here
      for viewer and candidate, or their defaults
    if no recommendation exists for this viewer-candidate pair:
      create one with the given viewer and candidate,
        the calculated score, status AVAILABLE, and eligible true
    otherwise:
      update its score and set eligible true
      preserve its existing status
```

**seeLater**

```text
seeLater(viewer: User, candidate: User)
  where a recommendation exists for this viewer-candidate pair
  and it is eligible
  and its status is AVAILABLE
  then
    change its status to SEE_LATER
```

**markPassed**

```text
markPassed(viewer: User, candidate: User)
  where a recommendation exists for this viewer-candidate pair
  then
    change its status to PASSED
```

**markInterested**

```text
markInterested(viewer: User, candidate: User)
  where a recommendation exists for this viewer-candidate pair
  and its status is AVAILABLE or SEE_LATER
  then
    change its status to INTERESTED
```

**startNewSession**

```text
startNewSession(viewer: User)
  then
    change all SEE_LATER recommendations
    belonging to viewer back to AVAILABLE
```

**deactivateRecommendation**

```text
deactivateRecommendation(
  viewer: User,
  candidate: User
)
  where a recommendation exists for this viewer-candidate pair
  then
    set eligible to false
```

### Queries

**_getFeed**

```text
_getFeed(viewer: User):
  many (candidate: User, score: Number)
```

Returns only recommendations whose viewer is the supplied viewer, where `eligible` is true and status is `AVAILABLE`, ordered from highest to lowest score. Equal scores may appear in any order. If the viewer has no available recommendations, including an unknown viewer, the query returns no results.

Profiles marked `PASSED` or `INTERESTED` are excluded from the feed. Profiles marked `SEE_LATER` are excluded until a new browsing session. A new browsing session begins when the user opens discovery after leaving it; refreshing the current feed does not start a new session.

**_getPreferences**

```text
_getPreferences(user: User): optional (preferences: Preference)
```

Returns the user's saved preferences, or no result if they have never saved any, including an unknown user. An absent numeric value means no preference. The same defaults apply when there is no preference record.

---

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

**_getInterestedInYou**

```text
_getInterestedInYou(user: User):
  many (from: User)
```

Returns all users with an INTERESTED decision about the given user, excluding people the user has already passed on or matched with. Returns no results when there are none, including an unknown user. Their order is unspecified.

**_getMatches**

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

**_getNotifications**

```text
_getNotifications(user: User):
  many (notification: Notification)
```

Returns the user's notifications, excluding dismissed notifications, ordered from newest to oldest. Returns no results when there are none, including an unknown user. Notifications created at the same time may appear in any order.

**_getUnreadNotifications**

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

**_getConversations**

```text
_getConversations(user: User):
  many (conversation: Conversation)
```

Returns all conversations in which the user is a participant, including closed conversations so they can return to their previous messages. Open and closed conversations are shown separately by the app. Returns no results when there are none, including an unknown user. Their order is unspecified.

**_getMessages**

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

| Request | Conditions and resulting action |
|---|---|
| Create a profile | `Requesting.createProfile(user, ...)` triggers `ProfileSetting.createProfile` through a reaction for the signed-in user with the supplied fields. The action's validation still applies. |
| Edit, publish, or hide a profile | `Requesting.updateProfile`, `setStartupPitch`, `publishProfile`, and `hideProfile` act only on the signed-in user's profile. Each triggers the corresponding ProfileSetting action when its preconditions hold. |
| Set preferences | `Requesting.setPreferences(user, ...)` requires that the signed-in user has a profile, then triggers `Recommending.setPreferences` for that user. Preferences belong only to that user. |
| Show Interest | `Requesting.showInterest(user, other)` follows the guarded reaction below. |
| Pass | `Requesting.pass(user, other)` requires an existing recommendation from user to other, or an incoming INTERESTED decision from other to user. It triggers `MutualMatching.pass` only if its preconditions hold. A hidden profile does not prevent dismissing an existing interest. |
| See Later | `Requesting.seeLater(user, other)` requires an eligible AVAILABLE recommendation for the signed-in viewer, then triggers `Recommending.seeLater`. |
| Begin browsing | `Requesting.startNewSession(user)` requires a visible profile and the beginning of a new browsing session, then triggers `Recommending.startNewSession` for that user. |
| Unmatch | `Requesting.unmatch(user, other)` requires an active match involving the signed-in user, then triggers `MutualMatching.unmatch`. |
| Send a message | `Requesting.sendMessage(user, conversation, content)` follows the guarded reaction below. |
| Read or dismiss a notification | `Requesting.markAsRead` and `dismissNotification` require that the notification belongs to the signed-in user, then trigger the corresponding Notifying action when its preconditions hold. |

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
    university, latitude, longitude, and availabilityHours

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
    university, latitude, longitude, and availabilityHours

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

---
# Example User Journey

**1. ProfileSetting**

Keti registers as a builder at MIT. She adds her software engineering skills, her interest in traveling and exploring new places, and her availability of 10 hours per week. She indicates that she is looking to join an early-stage startup related to travel.

Bumba registers as a founder at BU. He is building an app that helps solo travelers meet other travelers, find activities to do together, and explore new cities. He is looking for a technical co-founder to help develop the app.

**2. Recommending**

Keti and Bumba both list travel among their interests. Keti selects travel as a preferred interest, and Bumba selects software engineering as a preferred skill. Both publish their completed profiles. Recommending sees that Keti's interests in traveling and her software engineering skills align with what Bumba is looking for.

Bumba appears in Keti's recommended feed, even though they attend different universities. Keti is excited to find a startup working on something she is genuinely interested in.

**3. MutualMatching**

Keti reads Bumba's pitch about making solo traveling easier and helping travelers connect with people who have similar interests. She likes the idea and presses **Show Interest**.

Bumba can see Keti in his **Interested in You** section. He reads her profile, sees her technical skills and passion for traveling, and also presses Show Interest.

They become a match.

**4. Notifying**

Bumba receives a notification when Keti first expresses interest.

When they match, both receive a match notification.

**5. Chatting**

A private conversation becomes available between Keti and Bumba.

Keti asks Bumba more about his solo traveling app and how he plans to help travelers meet each other. Bumba explains his idea and what kind of technical help he needs.

They discuss their expectations, availability, and whether they would want to work together.

The goal is to help people like Keti find startups working on ideas they genuinely care about, without having to scroll through hundreds of listings or rely only on their existing university networks.

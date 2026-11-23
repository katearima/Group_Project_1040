# Startup Matching App — Concept Design

## 1. ProfileSetting

### Purpose

To help people present their skills, interests, and what they are looking for, so potential collaborators can understand whether they would be a good fit without having to reach out to everyone individually.

### Operational Principle

When someone joins the platform, they create a profile and choose whether they are a founder looking for teammates or a student looking to join a startup. A user can only choose one role.

Both founders and builders enter their name, university, major, graduation year, skills, experience, interests, location, and availability.

Founders also describe their startup idea and what kind of teammates they need.

Both sides can also enter their matching preferences during the same setup process. These preferences belong to Recommending, which uses them to decide which people to show first.

For example, Keti is an MIT student interested in working at an early-stage startup. She creates a profile, adds her software engineering skills, and indicates that she is interested in data tools.

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

The user's name will be in the form \[First] \[Last initial]. We deliberately obfuscate last names to prevent race/ethnicity based discrimination.

The location is a named place, such as a campus or neighborhood, with latitude and longitude in degrees. It does not need to be a home address. Coordinates must be valid even while a profile is hidden. Coordiates are not shared publicly for security but used on the backend to determine proximity.

For a profile to be published, its name and location must contain nonempty text, and its skills and interests must each contain at least one nonempty entry. Users will be highly recommended to include university, major, and graduation year information. Experience can be empty. Founders must also have a nonempty startup pitch.

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
)
  where user does not already have a profile
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
  and information has a positive whole-number graduationYear
  and its latitude and longitude are within their allowed ranges
  and every supplied skill and interest entry is nonempty
  and, if the profile is visible, the updated profile still
      meets all publication requirements
  then
    replace the editable profile fields with information
    keep the owner, role, startupPitch, and visibility unchanged
```

Here, `ProfileData` is a value containing `name: String`, `university: String`, `major: String`, `graduationYear: Number`, `skills: set of String`, `experience: String`, `interests: set of String`, `location: String`, `latitude: Number`, and `longitude: Number`. All these fields are supplied when updating a profile. It does not include owner, role, startup pitch, preferences, or visibility. Startup pitches are changed only through `setStartupPitch`.

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

**\_getProfile**

```text
_getProfile(user: User): optional (profile: Profile)
```

Returns the user's profile, or no result if it does not exist.

**\_getVisibleProfiles**

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

Empty preference sets mean that the user has not selected a preference. An absent preferred distance means there is no distance preference, and an absent preferred availability means there is no minimum time commitment. Distance is measured in kilometers. A user who has never saved preferences uses these same defaults.

`RecommendationData` is a value containing `skills: set of String`, `interests: set of String`, `university: String`, `latitude: Number`, and `longitude: Number`. Its sets contain nonempty entries, its university is nonempty, latitude is between -90 and 90, longitude is between -180 and 180, and availability is nonnegative. These are copies of relevant information supplied to an action, not profile objects that Recommending can look inside or change.

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

**\_getFeed**

```text
_getFeed(viewer: User):
  many (candidate: User, score: Number)
```

Returns only recommendations whose viewer is the supplied viewer, where `eligible` is true and status is `AVAILABLE`, ordered from highest to lowest score. Equal scores may appear in any order. If the viewer has no available recommendations, including an unknown viewer, the query returns no results.

Profiles marked `PASSED` or `INTERESTED` are excluded from the feed. Profiles marked `SEE_LATER` are excluded until a new browsing session. A new browsing session begins when the user opens discovery after leaving it; refreshing the current feed does not start a new session.

**\_getPreferences**

```text
_getPreferences(user: User): optional (preferences: Preference)
```

Returns the user's saved preferences, or no result if they have never saved any, including an unknown user. An absent numeric value means no preference. The same defaults apply when there is no preference record.


# 6. Reactions (excerpt)
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


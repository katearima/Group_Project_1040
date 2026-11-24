# ProfileSetting

## Purpose

Let each person present one profile, as a founder or as a builder, that others can
discover once it is complete and published. A profile is a self-description that its owner
controls, not a record that other people edit, rate, or annotate.

## Principle

Keti creates a builder profile with her name "Keti A", university MIT, skill "software
engineering", interest "data tools", location "MIT campus" at 42.36, -71.09, and 10 hours a
week of availability. It starts hidden. She publishes it, and it becomes visible. Bumba
creates a profile that is both a founder and a builder. Like Keti, he enters his builder information,
but is barred from publishing his profile until he sets a startup pitch because he is also a founder.
He sets a pitch, "A data tool for solo travelers". After that he publishes his profile.
Later Keti adds the skill "data engineering" with an update; her role, visibility, and lack of a
pitch stay as they were. An update that would empty the skills of her visible profile is refused.

## Types

```types
external User
  The opaque identity of the person who owns a profile.
opaque Entries
  A finite list of text entries, such as skills or interests, exactly as supplied.
Role is FOUNDER or BUILDER or BOTH
  Whether the person is a founder seeking teammates or a builder seeking a startup, or both.
```

## State

```state
a seq of Profiles with
  a unique owner User
  a Role
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
  an availability Number
  an optional startupPitch String
  a visible Flag

Rule: A User has at most one Profile, and its role never changes after creation.
Rule: If a Profile whose role is FOUNDER or BOTH, startupPitch is nonempty.
Rule: graduationYear is a positive whole number; availability, in hours per week, is a nonnegative number.
Rule: latitude is between -90 and 90 and longitude is between -180 and 180, inclusive, in degrees, even while the Profile is hidden.
Rule: Every skills and interests entry is nonempty after trimming leading and trailing whitespace; entries are stored exactly as supplied, without trimming or removing duplicates.
Rule: Text containing only whitespace counts as empty.
Rule: A Profile is complete when its name and location are nonempty, its skills and its interests each have at least one entry, and, when its role is FOUNDER or BOTH, its startupPitch is present.
Rule: Every visible Profile is complete.
Rule: Profiles are kept in creation order.
Rule: The profile data is invalid when graduationYear is not a positive whole number, latitude or longitude is out of range, availability is negative, or any skills or interests entry is empty after trimming.
Rule: Each action checks and changes a Profile atomically, so concurrent requests cannot create two Profiles for one User or leave a visible Profile incomplete.
```

## Actions

```actions
createProfile (user: User, role: Role, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number) : returns (profile: Profile)
  where a Profile with owner user exists
  then
    refuses PROFILE_ALREADY_EXISTS "You already have a profile."
  where no Profile with owner user exists and the profile data is invalid
  then
    refuses INVALID_PROFILE "Graduation year, coordinates, availability, skills, and interests must be valid."
  where no Profile with owner user exists and the profile data is valid
  then
    append a Profile with owner user and the supplied role, name, university, major, graduationYear, skills, experience, interests, location, latitude, longitude, and availability, no startupPitch, and visible false
    bind profile to that Profile
    returns profile

setStartupPitch (user: User, pitch: String) : returns ()
  where no Profile with owner user exists
  then
    refuses PITCH_PROFILE_NOT_FOUND "Create a profile first."
  where the Profile with owner user has role BUILDER
  then
    refuses PITCH_NOT_FOUNDER "Only founders can have a startup pitch."
  where the Profile with owner user has role FOUNDER or BOTH and pitch is empty
  then
    refuses EMPTY_PITCH "A startup pitch must not be empty."
  where the Profile with owner user has role FOUNDER or BOTH and pitch is not empty
  then
    set that Profile's startupPitch to pitch
    returns

updateProfile (user: User, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number) : returns ()
  where no Profile with owner user exists
  then
    refuses UPDATE_PROFILE_NOT_FOUND "Create a profile first."
  where a Profile with owner user exists and the supplied profile data is invalid
  then
    refuses INVALID_PROFILE_UPDATE "Graduation year, coordinates, availability, skills, and interests must be valid."
  where a Profile with owner user exists, the supplied profile data is valid, the Profile is visible, and the Profile with the supplied fields would not be complete
  then
    refuses UPDATE_WOULD_UNPUBLISH "A visible profile must stay complete; hide it before removing required details."
  where a Profile with owner user exists, the supplied profile data is valid, and the Profile is hidden or would stay complete
  then
    replace that Profile's name, university, major, graduationYear, skills, experience, interests, location, latitude, longitude, and availability with the supplied values
    keep its owner, role, startupPitch, and visible unchanged
    returns

publishProfile (user: User) : returns ()
  where no Profile with owner user exists
  then
    refuses PUBLISH_PROFILE_NOT_FOUND "Create a profile first."
  where the Profile with owner user is not complete
  then
    refuses PROFILE_INCOMPLETE "Add a name, location, at least one skill and interest, and, for founders, a startup pitch before publishing."
  where the Profile with owner user is complete
  then
    set that Profile's visible to true
    returns

hideProfile (user: User) : returns ()
  where no Profile with owner user is visible
  then
    refuses PROFILE_NOT_VISIBLE "You do not have a visible profile."
  where the Profile with owner user is visible
  then
    set that Profile's visible to false
    returns
```

## Queries

```queries
_getProfile (user: User) : optional (profile: Profile, role: Role, name: String, university: String, major: String, graduationYear: Number, skills: Entries, experience: String, interests: Entries, location: String, latitude: Number, longitude: Number, availability: Number, startupPitch?: String, visible: Flag)
  answers the Profile whose owner is user, with all its fields
  answers no row when user has no Profile, including for an unknown user

_getVisibleProfiles () : many (profile: Profile, owner: User)
  answers each visible Profile with its owner
  answers no rows when no Profile is visible
  orders rows by Profile creation order, oldest first

_recommendationData (user: User) : optional (role: Role, visible: Flag, skills: Entries, interests: Entries, university: String, latitude: Number, longitude: Number, availability: Number)
  answers the role, visibility, and recommendation data of the Profile whose owner is user
  answers no row when user has no Profile, including for an unknown user

_visibleCandidates (user: User) : many (candidate: User, skills: Entries, interests: Entries, university: String, latitude: Number, longitude: Number, availability: Number)
  answers the owner and recommendation data of each visible Profile whose role differs from the role of user's Profile
  answers no rows when user has no Profile, including for an unknown user, or when no such Profile is visible
  orders rows by Profile creation order, oldest first
```

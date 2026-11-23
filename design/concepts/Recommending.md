# Recommending

## Purpose

Rank the people a viewer could work with by a compatibility score built from preferences
and supplied profile data, and remember what the viewer decided about each person, so the
feed shows likely fits first and never re-shows someone the viewer set aside. It ranks; it
does not decide who may appear, and it never reads profiles itself.

## Principle

Keti prefers the interest "data tools"; Bumba prefers the skill "software engineering".
When both profiles are refreshed as a pair, Keti's recommendation of Bumba is created as
AVAILABLE with score 1 because every factor is satisfied, and it tops her feed. She chooses
See Later, so Bumba leaves her feed until she starts a new browsing session, when he
returns. Later Bumba's data changes and the pair is refreshed again: the score is
recalculated, but a recommendation Keti had marked PASSED stays PASSED and out of her feed.
Deactivating a recommendation hides it from the feed until the next refresh makes it
eligible again.

## Types

```types
external User
  The opaque identity of a person who views or is recommended.
opaque Entries
  A finite list of text entries, such as skills, interests, or universities, exactly as supplied.
RecommendationStatus is AVAILABLE or SEE_LATER or PASSED or INTERESTED
  What the viewer decided about a recommended candidate.
```

## State

```state
a set of Preferences with
  a unique owner User
  a preferredSkills set of String
  a preferredInterests set of String
  a preferredUniversities set of String
  an optional preferredDistance Number
  an optional preferredAvailability Number

a seq of Recommendations with
  a viewer User
  a candidate User
  a score Number
  a status RecommendationStatus
  an eligible Flag
  unique viewer and candidate

Rule: No Recommendation has the same User as viewer and candidate.
Rule: Each viewer and candidate pair has at most one Recommendation.
Rule: A present preferredDistance (kilometers) or preferredAvailability (hours per week) is nonnegative, and every preferred entry is nonempty after trimming; preferred entries are stored exactly as supplied.
Rule: A User without Preferences, or with empty preferred sets or absent numbers, has no preference for that factor.
Rule: Every score is between 0 and 1 inclusive.
Rule: Text containing only whitespace counts as empty.
Rule: Entries are compared after trimming leading and trailing whitespace and ignoring letter case; entries equal after this normalization count once.
Rule: Recommendation data is one person's skills, interests, university, latitude, longitude, and availability, supplied by the caller; Recommending never stores it.
Rule: Recommendation data is invalid when a skills or interests entry is empty, latitude is outside -90 to 90, longitude is outside -180 to 180, or availability is negative; an empty university is valid and matches no university preference.
Rule: The skills factor is the average of two directions: the fraction of the viewer's preferred skills found in the candidate's skills, and the fraction of the candidate's preferred skills found in the viewer's skills; a direction whose preferred set is empty is 1.
Rule: The interests factor is the fraction of the viewer's preferred interests found in the candidate's interests; when the viewer prefers none, the viewer's own interests are used instead; when that set is also empty, the factor is 1.
Rule: The university factor is 1 when the viewer prefers no university or the candidate's university, trimmed and compared ignoring letter case, is among the preferred universities, and 0 otherwise.
Rule: The availability factor is 1 when the viewer has no preferred availability or it is 0, and otherwise the candidate's availability divided by the preferred availability, capped at 1.
Rule: The proximity factor is 1 when the viewer has no preferred distance; when the preferred distance is 0 it is 1 at distance 0 and 0 otherwise; otherwise it is max(0, 1 - distance / preferredDistance).
Rule: Distance is the great-circle distance between the two coordinates on a sphere of radius 6371 kilometers; equal coordinates are distance 0.
Rule: A score is the average of the skills, interests, university, availability, and proximity factors, each between 0 and 1.
Rule: Recommendations are kept in creation order; refreshing or changing status keeps a Recommendation's position.
Rule: Each action checks and changes these facts atomically, so concurrent refreshes cannot create two Recommendations for one pair.
```

## Actions

```actions
setPreferences (user: User, skills: Entries, interests: Entries, universities: Entries, distance?: Number, availability?: Number) : returns ()
  where a supplied number is negative or any skills, interests, or universities entry is empty
  then
    refuses INVALID_PREFERENCES "Preferred distance and availability must be nonnegative, and preferred entries must not be empty."
  where every supplied number is nonnegative and every entry is nonempty
  then
    create Preferences with owner user when none exist
    replace its preferredSkills, preferredInterests, and preferredUniversities with skills, interests, and universities
    set its preferredDistance to distance and its preferredAvailability to availability, clearing each one that is omitted
    returns

refreshRecommendation (viewer: User, candidate: User, viewerSkills: Entries, viewerInterests: Entries, viewerUniversity: String, viewerLatitude: Number, viewerLongitude: Number, viewerAvailability: Number, candidateSkills: Entries, candidateInterests: Entries, candidateUniversity: String, candidateLatitude: Number, candidateLongitude: Number, candidateAvailability: Number) : returns (score: Number)
  where viewer is candidate
  then
    refuses SELF_RECOMMENDATION "A person cannot be recommended to themselves."
  where viewer is not candidate and the viewer data or the candidate data is invalid
  then
    refuses INVALID_RECOMMENDATION_DATA "Recommendation data must have nonempty entries, valid coordinates, and nonnegative availability."
  where viewer is not candidate, both data are valid, and no Recommendation has viewer viewer and candidate candidate
  then
    calculate score from the supplied data and the Preferences of viewer and candidate, or their defaults
    append a Recommendation with viewer, candidate, score, status AVAILABLE, and eligible true
    returns score
  where viewer is not candidate, both data are valid, and a Recommendation has viewer viewer and candidate candidate
  then
    calculate score from the supplied data and the Preferences of viewer and candidate, or their defaults
    set that Recommendation's score to score and its eligible to true, keeping its status
    returns score

seeLater (viewer: User, candidate: User) : returns ()
  where no eligible Recommendation with viewer viewer and candidate candidate has status AVAILABLE
  then
    refuses NOT_IN_FEED "This person is not in your current feed."
  where the Recommendation with viewer viewer and candidate candidate is eligible and has status AVAILABLE
  then
    set its status to SEE_LATER
    returns

markPassed (viewer: User, candidate: User) : returns ()
  where no Recommendation has viewer viewer and candidate candidate
  then
    refuses PASS_RECOMMENDATION_NOT_FOUND "There is no recommendation of this person."
  where a Recommendation has viewer viewer and candidate candidate
  then
    set its status to PASSED
    returns

markInterested (viewer: User, candidate: User) : returns ()
  where no Recommendation has viewer viewer and candidate candidate
  then
    refuses INTEREST_RECOMMENDATION_NOT_FOUND "There is no recommendation of this person."
  where the Recommendation with viewer viewer and candidate candidate has status PASSED or INTERESTED
  then
    refuses RECOMMENDATION_ALREADY_DECIDED "You have already decided about this recommendation."
  where the Recommendation with viewer viewer and candidate candidate has status AVAILABLE or SEE_LATER
  then
    set its status to INTERESTED
    returns

startNewSession (viewer: User) : returns ()
  where true
  then
    set the status of every Recommendation with viewer viewer and status SEE_LATER to AVAILABLE
    returns

deactivateRecommendation (viewer: User, candidate: User) : returns ()
  where no Recommendation has viewer viewer and candidate candidate
  then
    refuses DEACTIVATE_RECOMMENDATION_NOT_FOUND "There is no recommendation of this person."
  where a Recommendation has viewer viewer and candidate candidate
  then
    set its eligible to false
    returns
```

## Queries

```queries
_getFeed (viewer: User) : many (candidate: User, score: Number)
  answers the candidate and score of each eligible Recommendation with viewer viewer and status AVAILABLE
  answers no rows when there are none, including for an unknown viewer
  orders rows by score highest first, and equal scores by Recommendation creation order oldest first

_getPreferences (user: User) : optional (skills: Entries, interests: Entries, universities: Entries, distance?: Number, availability?: Number)
  answers the preferred skills, interests, universities, distance, and availability of the Preferences with owner user
  answers no row when user has never set preferences, including for an unknown user

_recommendation (viewer: User, candidate: User) : optional (score: Number, status: RecommendationStatus, eligible: Flag)
  answers the score, status, and eligibility of the Recommendation with viewer viewer and candidate candidate
  answers no row when there is none, including for unknown users
```

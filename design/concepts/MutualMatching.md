# MutualMatching

## Purpose

Connect two people only when both independently show interest. Each person gets one
decision about the other. One-sided interest creates no connection, and passing or
unmatching prevents a future match.

## Principle

Keti shows interest in Bumba and appears in his interested-in-you list. They aren't
matched yet. When Bumba shows interest back, that same action records his decision and
creates their match. Both see each other in their matches, and Keti leaves his
interested-in-you list. Repeating Show Interest is refused.

Later, Keti unmatches Bumba. Their match disappears and both decisions become PASSED,
preventing either from showing interest again. Separately, Bumba passes on Ana's incoming
interest. Ana leaves his interested-in-you list; passing again succeeds without a change.

## Types

```types
external User
  The opaque identity of a person who decides about other people.
DecisionStatus is INTERESTED or PASSED
  Whether a directed decision is interest or a permanent pass.
```

## State

```state
a seq of Decisions with
  a from User
  a to User
  a status DecisionStatus
  unique from and to

a seq of Matches with
  a first User
  a second User

Rule: No Decision has the same User as from and to.
Rule: A Match is an unordered pair of two different Users; first and second carry no meaning beyond membership.
Rule: A pair of Users has at most one Match, whichever User is first.
Rule: A Match exists between two Users exactly when each has an INTERESTED Decision about the other.
Rule: A PASSED Decision never becomes INTERESTED again.
Rule: Decisions are kept in the order they were first recorded and Matches in the order they were created; changing a Decision's status keeps its position.
Rule: Each action checks and changes these facts atomically, so concurrent requests for the same pair cannot create two Decisions for one ordered pair or two Matches for one pair.
```

## Actions

```actions
showInterest (from: User, to: User) : returns (matched: Flag)
  where from is to
  then
    refuses INTEREST_IN_SELF "You cannot show interest in yourself."
  where from is not to and a Match pairs from and to
  then
    refuses INTEREST_ALREADY_MATCHED "You are already matched with this person."
  where from is not to, no Match pairs from and to, and a Decision from from to to already exists
  then
    refuses INTEREST_ALREADY_DECIDED "You have already decided about this person."
  where from is not to, no Match pairs from and to, no Decision from from to to exists, and the Decision from to to from has status INTERESTED
  then
    append a Decision from from to to with status INTERESTED
    append a Match with first from and second to
    set matched to true
    returns matched
  where from is not to, no Match pairs from and to, no Decision from from to to exists, and no Decision from to to from has status INTERESTED
  then
    append a Decision from from to to with status INTERESTED
    set matched to false
    returns matched

pass (from: User, to: User) : returns ()
  where from is to
  then
    refuses PASS_ON_SELF "You cannot pass on yourself."
  where from is not to and a Match pairs from and to
  then
    refuses PASS_ALREADY_MATCHED "You are matched with this person; unmatch instead."
  where from is not to, no Match pairs from and to, and the Decision from from to to has status INTERESTED
  then
    refuses PASS_AFTER_INTEREST "You have already shown interest in this person."
  where from is not to, no Match pairs from and to, and the Decision from from to to has status PASSED
  then
    keep the existing PASSED Decision without adding another
    returns
  where from is not to, no Match pairs from and to, and no Decision from from to to exists
  then
    append a Decision from from to to with status PASSED
    returns

unmatch (user: User, other: User) : returns ()
  where no Match pairs user and other
  then
    refuses NOT_MATCHED "You do not have an active match with this person."
  where a Match pairs user and other
  then
    delete that Match
    set the status of the Decision from user to other and of the Decision from other to user to PASSED
    returns
```

## Queries

```queries
_getInterestedInYou (user: User) : many (from: User)
  answers each User with an INTERESTED Decision about user, excluding Users that user has a PASSED Decision about and Users matched with user
  answers no rows when there are none, including for an unknown user
  orders rows by the position of each from User's Decision about user, earliest recorded first

_getMatches (user: User) : many (other: User)
  answers each User that currently has a Match with user
  answers no rows when there are none, including for an unknown user
  orders rows by Match creation order, oldest first

_decision (from: User, to: User) : optional (status: DecisionStatus)
  answers the status of the Decision from from to to
  answers no row when from has not decided about to, including for unknown users
```

# Application types and instances

Every person in the application is identified by the Account that Authenticating
established. A session's subject, the users of MutualMatching, and the recipients of
Notifying are all that same Account identity, so the signed-in user resolved from a session
is directly the user who decides, matches, and receives notifications. Callers never supply
their own identity.

```instances
instantiate Authenticating

instantiate Sessioning with
  Subject is Authenticating.Account

instantiate MutualMatching with
  User is Authenticating.Account

instantiate Notifying with
  User is Authenticating.Account

instantiate ProfileSetting with
  User is Authenticating.Account

instantiate Recommending with
  User is Authenticating.Account
```

Profile owners and the viewers and candidates of recommendations are the same Account
identity, so the session user's profile, preferences, and feed all key on one identity.

Every flow binds one instant when it enters the application and passes that same instant
to each session check, session start or end, and notification it causes.

```computations
currentInstant() : DateTime
  Produces the instant at which the current flow entered the application; it is read once per flow and reused for every step of that flow.
```

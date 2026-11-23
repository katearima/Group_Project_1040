# Accounts

Visitors can register, sign in, and sign out. Registration and sign-in each start a
30-minute session, using the flow's [current instant](computation:currentInstant) and
[fixed session lifetime](computation:sessionLifetime). All other application endpoints
use Sessioning to identify the signed-in user from that session.
A username or account identity alone cannot authenticate a request.

```computations
sessionLifetime() : Number
  Produces 1800000, the 30-minute session lifetime in milliseconds.
```

## Register

Anyone may [register](reaction:Accounts.Sessions.Register) with a username and password.
Authenticating rejects invalid usernames (`INVALID_USERNAME`), passwords of the wrong
length (`WEAK_PASSWORD`), and taken usernames (`USERNAME_TAKEN`). A refusal creates
neither an account nor a session.

After registration, Sessioning starts the session. The endpoint then returns the account
identity, session, and expiry. These steps have separate owners and are not atomic.
If session creation faults, the account remains: the visitor can sign in, but registering
again returns `USERNAME_TAKEN`.

```endpoints
Accounts.Sessions.Register at /accounts/register
```

## Sign in

Anyone may [sign in](reaction:Accounts.Sessions.SignIn) with a username and password.
An unknown username and a wrong password both return `INVALID_CREDENTIALS`, with no
session created. On success, Sessioning starts a 30-minute session from the flow's
instant; the endpoint then returns the account identity, session, and expiry.

Each sign-in creates an independent session. Earlier sessions remain active until ended
or expired. If session creation faults, the endpoint returns no session; the visitor can
try signing in again.

```endpoints
Accounts.Sessions.SignIn at /accounts/sign-in
```

## Sign out

A session holder may [sign out](reaction:Accounts.Sessions.SignOut). Sessioning ends the
supplied session at the flow's instant, then the endpoint confirms it ended. Missing,
ended, expired, and invented sessions all return `UNKNOWN_SESSION` without changes,
so signing out twice refuses the second attempt.

Only the supplied session ends. Matching decisions, matches, and notifications stay intact.

```endpoints
Accounts.Sessions.SignOut at /accounts/sign-out
```

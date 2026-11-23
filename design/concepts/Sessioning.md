# Sessioning

## Purpose

Give an external identity temporary access through an opaque session. The caller chooses
its lifetime; expiry leaves the identity unchanged.

## Principle

At noon Ari starts session `v1` for `ari`, valid for 20 minutes. At 12:10, `_active`
returns `ari` and the 12:20 expiry; `current` returns `ari`. Ari ends `v1` at 12:11,
and `current` refuses it. A second session, started at 12:12 for eight minutes, is refused
at 12:20 just like an invented session.

## Types

```types
external Subject
  The external identity represented by a session.
```

## State

```state
a set of Sessions with
  a subject Subject
  an expiresAt DateTime
```

## Actions

```actions
start (subject: Subject, lifetime: Number, now: DateTime) : returns (session: Session, expiresAt: DateTime)
  where lifetime is not a positive finite number of milliseconds
  then
    refuses INVALID_SESSION_LIFETIME "A session lifetime must be a positive number of milliseconds."
  where lifetime is a positive finite number of milliseconds
  then
    add a new opaque Session for subject with expiresAt lifetime milliseconds after now
    returns session, expiresAt

current (session: Session, now: DateTime) : returns (subject: Subject)
  where session is unknown or ended, or its expiresAt is at or before now
  then
    refuses UNKNOWN_SESSION "This session is not active."
  where session is known and its expiresAt is after now
  then
    bind subject to the Session's subject
    returns subject

end (session: Session, now: DateTime) : returns (ended: Flag)
  where session is unknown or ended, or its expiresAt is at or before now
  then
    refuses UNKNOWN_SESSION "This session is not active."
  where session is known and its expiresAt is after now
  then
    delete the Session
    set ended to true
    returns ended
```

## Queries

```queries
_active (session: Session, now: DateTime) : optional (subject: Subject, expiresAt: DateTime)
  answers the active Session's subject and expiresAt when expiresAt is after now
  answers no row for an unknown or ended Session, or when expiresAt is at or before now
```

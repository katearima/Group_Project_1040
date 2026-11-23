# Notifying

## Purpose

Keep users informed through a personal inbox of short messages and navigation links.
Store each notification's read and dismissed status. Dismissing it hides the message
without undoing the activity behind it.

## Principle

At 10:00 Bumba receives "Someone is interested in you!" linking to `/profile/keti`.
At 10:05 he receives "It's a match!" linking to `/matches`. Both are UNREAD; the newer
message appears first in both his notification and unread lists.

Bumba marks the 10:00 notification as read. It leaves his unread list but stays in his inbox
as READ. Keti cannot mark it as read or dismiss it; either attempt is refused as if it didn't exist.
Bumba then dismisses it. It leaves both lists and can no longer be marked as read.

## Types

```types
external User
  The opaque identity of a notification recipient.
NotificationStatus is UNREAD or READ or DISMISSED
  The lifecycle stage of one notification.
```

## State

```state
a seq of Notifications with
  a recipient User
  a message String
  a link String
  a createdAt DateTime
  a status NotificationStatus

Rule: Every Notification has exactly one recipient, fixed at creation.
Rule: A new Notification is UNREAD; message, link, and createdAt never change.
Rule: A DISMISSED Notification never becomes UNREAD or READ again, and a READ Notification never becomes UNREAD again.
Rule: createdAt is supplied by the caller of notify; Notifying never reads a clock.
Rule: Notifications are kept in creation order, which breaks ties between equal createdAt values.
Rule: notify does not deduplicate; each successful call adds a distinct Notification. Marking a READ Notification as read and dismissing a DISMISSED Notification succeed again without change.
```

## Actions

```actions
notify (recipient: User, message: String, link: String, createdAt: DateTime) : returns (notification: Notification)
  where message is empty
  then
    refuses EMPTY_MESSAGE "A notification message must not be empty."
  where message is not empty
  then
    append a new Notification with recipient, message, link, createdAt, and status UNREAD
    bind notification to that Notification
    returns notification

markAsRead (user: User, notification: Notification) : returns (notification: Notification)
  where notification is not in Notifications or its recipient is not user
  then
    refuses READ_TARGET_NOT_FOUND "No such notification."
  where notification's recipient is user and its status is DISMISSED
  then
    refuses READ_TARGET_DISMISSED "This notification has been dismissed."
  where notification's recipient is user and its status is UNREAD or READ
  then
    set notification's status to READ
    returns notification

dismissNotification (user: User, notification: Notification) : returns (notification: Notification)
  where notification is not in Notifications or its recipient is not user
  then
    refuses DISMISS_TARGET_NOT_FOUND "No such notification."
  where notification's recipient is user
  then
    set notification's status to DISMISSED
    returns notification
```

## Queries

```queries
_getNotifications (user: User) : many (notification: Notification, message: String, link: String, createdAt: DateTime, status: NotificationStatus)
  answers each Notification whose recipient is user and whose status is UNREAD or READ, with its message, link, createdAt, and status
  answers no rows when there are none, including for an unknown user
  orders rows by createdAt newest first, and equal createdAt values by creation order newest first

_getUnreadNotifications (user: User) : many (notification: Notification, message: String, link: String, createdAt: DateTime)
  answers each Notification whose recipient is user and whose status is UNREAD, with its message, link, and createdAt
  answers no rows when there are none, including for an unknown user
  orders rows by createdAt newest first, and equal createdAt values by creation order newest first
```

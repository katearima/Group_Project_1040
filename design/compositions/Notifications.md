# Notifications

Signed-in users can read and manage their own notifications. Every endpoint first calls
Sessioning `current` with the supplied session and the flow's
[current instant](computation:currentInstant). Missing, ended, expired, and invented
sessions all return `UNKNOWN_SESSION` before any notification action, without changes.
Notifications are created by matching activity, never by a direct user request.

Notifying `markAsRead` and `dismissNotification` check ownership atomically with the
change, using the session user and requested notification identity. Missing notifications
and those belonging to someone else receive identical refusals, concealing their existence.

New-message notifications (Reaction 9) and sender names in interest notifications await
Chatting and ProfileSetting.

## List notifications

A signed-in user may [list their notifications](reaction:Notifications.Reads.List).
Notifying `_getNotifications` returns the session user's UNREAD and READ notifications
with message, link, creation time, and status. Results are newest first; ties use most
recently created first. Dismissed notifications are excluded. The list is empty when
there are none, and reading changes no state.

```endpoints
Notifications.Reads.List at /notifications/list
```

## List unread notifications

A signed-in user may [list unread notifications](reaction:Notifications.Reads.ListUnread).
Notifying `_getUnreadNotifications` returns only the session user's UNREAD notifications,
with message, link, and creation time, in the same newest-first order. It returns an empty
list when there are none.

```endpoints
Notifications.Reads.ListUnread at /notifications/unread
```

## Mark as read

A signed-in user may [mark a notification as read](reaction:Notifications.Requests.MarkAsRead).
Notifying `markAsRead` returns `READ_TARGET_NOT_FOUND` for a missing notification or one
belonging to someone else, and `READ_TARGET_DISMISSED` for the user's own dismissed
notification. Refusals change nothing.

Otherwise, the notification becomes READ and leaves the unread list but stays in the
notification list. Marking it again succeeds without changes. The endpoint returns the
notification identity after the update.

```endpoints
Notifications.Requests.MarkAsRead at /notifications/mark-read
```

## Dismiss

A signed-in user may [dismiss a notification](reaction:Notifications.Requests.Dismiss).
Notifying `dismissNotification` returns `DISMISS_TARGET_NOT_FOUND` for a missing
notification or one belonging to someone else, without changes.

Otherwise, the notification becomes DISMISSED and leaves both lists. Dismissing it again
succeeds without changes. The endpoint returns the notification identity after the update.
The underlying interest or match remains in MutualMatching and its lists.

```endpoints
Notifications.Requests.Dismiss at /notifications/dismiss
```

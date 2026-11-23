import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { each, former, now, where } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const { Notifying, Sessioning } = concepts;

const NotificationRows = former(
  "the notifications of (user)",
  ({ user }, { notification, message, link, createdAt, status }) =>
    each(
      Notifying._getNotifications({ user }).is({ notification, message, link, createdAt, status }),
    ).form({ notification, message, link, createdAt, status }),
);

const UnreadNotificationRows = former(
  "the unread notifications of (user)",
  ({ user }, { notification, message, link, createdAt }) =>
    each(
      Notifying._getUnreadNotifications({ user }).is({ notification, message, link, createdAt }),
    ).form({ notification, message, link, createdAt }),
);

const List = endpoint(
  "/notifications/list",
  ({ session, user, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        respond({ notifications: NotificationRows({ user }) }),
      ),
  { input: { defaults: { session: "" } } },
);

const ListUnread = endpoint(
  "/notifications/unread",
  ({ session, user, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        respond({ notifications: UnreadNotificationRows({ user }) }),
      ),
  { input: { defaults: { session: "" } } },
);

const MarkAsRead = endpoint(
  "/notifications/mark-read",
  ({ session, user, time, notification }) =>
    receive({ session, notification })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(Notifying.markAsRead({ user, notification }).responds({ notification }))
      .then(respond({ notification })),
  { input: { required: ["notification"], defaults: { session: "" } } },
);

const Dismiss = endpoint(
  "/notifications/dismiss",
  ({ session, user, time, notification }) =>
    receive({ session, notification })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(Notifying.dismissNotification({ user, notification }).responds({ notification }))
      .then(respond({ notification })),
  { input: { required: ["notification"], defaults: { session: "" } } },
);

export const composition = {
  Reads: { List, ListUnread },
  Requests: { MarkAsRead, Dismiss },
};

import { randomUUID } from "node:crypto";

export type User = string;
export type Notification = string;
export type NotificationStatus = "UNREAD" | "READ" | "DISMISSED";

export interface NotificationRecord {
  notification: Notification;
  recipient: User;
  message: string;
  link: string;
  createdAt: Date;
  status: NotificationStatus;
}

export interface NotifyingDependencies {
  /** Source of fresh opaque Notification identities. */
  freshNotification?: () => Notification;
  /** Notifications to start from, in creation order. */
  initial?: Iterable<NotificationRecord>;
}

export const EMPTY_MESSAGE_DETAIL = "A notification message must not be empty.";
export const READ_TARGET_NOT_FOUND_DETAIL = "No such notification.";
export const READ_TARGET_DISMISSED_DETAIL = "This notification has been dismissed.";
export const DISMISS_TARGET_NOT_FOUND_DETAIL = "No such notification.";

/** Refusal EMPTY_MESSAGE. */
export class EmptyMessage extends Error {}
/** Refusal READ_TARGET_NOT_FOUND. */
export class ReadTargetNotFound extends Error {}
/** Refusal READ_TARGET_DISMISSED. */
export class ReadTargetDismissed extends Error {}
/** Refusal DISMISS_TARGET_NOT_FOUND. */
export class DismissTargetNotFound extends Error {}

const NOTIFICATION_ID_ATTEMPTS = 32;

interface StoredNotification extends NotificationRecord {
  /** Creation position; breaks ties between equal createdAt values. */
  position: number;
}

function newestFirst(a: StoredNotification, b: StoredNotification): number {
  return b.createdAt.getTime() - a.createdAt.getTime() || b.position - a.position;
}

export class NotifyingConcept {
  #notifications = new Map<Notification, StoredNotification>();
  #nextPosition = 0;
  #freshNotification: () => Notification;

  constructor({ freshNotification = randomUUID, initial = [] }: NotifyingDependencies = {}) {
    this.#freshNotification = freshNotification;
    for (const record of initial) {
      this.#store({ ...record, createdAt: new Date(record.createdAt.getTime()) });
    }
  }

  notify({
    recipient,
    message,
    link,
    createdAt,
  }: {
    recipient: User;
    message: string;
    link: string;
    createdAt: Date;
  }): { notification: Notification } {
    // Text containing only whitespace counts as empty (team product design).
    if (message.trim().length === 0) throw new EmptyMessage(EMPTY_MESSAGE_DETAIL);
    const notification = this.#allocate();
    this.#store({
      notification,
      recipient,
      message,
      link,
      createdAt: new Date(createdAt.getTime()),
      status: "UNREAD",
    });
    return { notification };
  }

  markAsRead({
    user,
    notification,
  }: {
    user: User;
    notification: Notification;
  }): { notification: Notification } {
    const found = this.#notifications.get(notification);
    if (found === undefined || found.recipient !== user) {
      throw new ReadTargetNotFound(READ_TARGET_NOT_FOUND_DETAIL);
    }
    if (found.status === "DISMISSED") throw new ReadTargetDismissed(READ_TARGET_DISMISSED_DETAIL);
    found.status = "READ";
    return { notification };
  }

  dismissNotification({
    user,
    notification,
  }: {
    user: User;
    notification: Notification;
  }): { notification: Notification } {
    const found = this.#notifications.get(notification);
    if (found === undefined || found.recipient !== user) {
      throw new DismissTargetNotFound(DISMISS_TARGET_NOT_FOUND_DETAIL);
    }
    found.status = "DISMISSED";
    return { notification };
  }

  _getNotifications({ user }: { user: User }): Array<{
    notification: Notification;
    message: string;
    link: string;
    createdAt: Date;
    status: NotificationStatus;
  }> {
    return this.#inbox(user, (status) => status !== "DISMISSED").map(
      ({ notification, message, link, createdAt, status }) => ({
        notification,
        message,
        link,
        createdAt: new Date(createdAt.getTime()),
        status,
      }),
    );
  }

  _getUnreadNotifications({ user }: { user: User }): Array<{
    notification: Notification;
    message: string;
    link: string;
    createdAt: Date;
  }> {
    return this.#inbox(user, (status) => status === "UNREAD").map(
      ({ notification, message, link, createdAt }) => ({
        notification,
        message,
        link,
        createdAt: new Date(createdAt.getTime()),
      }),
    );
  }

  #inbox(user: User, include: (status: NotificationStatus) => boolean): StoredNotification[] {
    const rows: StoredNotification[] = [];
    for (const stored of this.#notifications.values()) {
      if (stored.recipient === user && include(stored.status)) rows.push(stored);
    }
    return rows.sort(newestFirst);
  }

  #allocate(): Notification {
    for (let attempt = 0; attempt < NOTIFICATION_ID_ATTEMPTS; attempt += 1) {
      const notification = this.#freshNotification();
      if (!this.#notifications.has(notification)) return notification;
    }
    throw new Error("The notification identity source repeatedly returned an existing value.");
  }

  #store(record: NotificationRecord): void {
    this.#notifications.set(record.notification, { ...record, position: this.#nextPosition });
    this.#nextPosition += 1;
  }
}

import { describe, expect, test } from "bun:test";
import {
  DismissTargetNotFound,
  EmptyMessage,
  NotifyingConcept,
  ReadTargetDismissed,
  ReadTargetNotFound,
} from "./Notifying.ts";

const at = (hhmm: string) => new Date(`2026-11-22T${hhmm}:00.000Z`);

function counter() {
  let next = 0;
  return () => `n${++next}`;
}

function snapshot(concept: NotifyingConcept, users: string[]) {
  return users.map((user) => ({
    all: concept._getNotifications({ user }),
    unread: concept._getUnreadNotifications({ user }),
  }));
}

const USERS = ["bumba", "keti"];

describe("NotifyingConcept construction", () => {
  test("constructs with no arguments and has zero runtime arity", () => {
    expect(NotifyingConcept.length).toBe(0);
    const concept = new NotifyingConcept();
    expect(concept._getNotifications({ user: "bumba" })).toEqual([]);
    expect(concept._getUnreadNotifications({ user: "bumba" })).toEqual([]);
  });

  test("exposes only declared actions and queries on the prototype", () => {
    const names = Object.getOwnPropertyNames(NotifyingConcept.prototype).sort();
    expect(names).toEqual(
      [
        "constructor",
        "notify",
        "markAsRead",
        "dismissNotification",
        "_getNotifications",
        "_getUnreadNotifications",
      ].sort(),
    );
  });

  test("default identities are fresh opaque strings", () => {
    const concept = new NotifyingConcept();
    const a = concept.notify({ recipient: "bumba", message: "x", link: "/", createdAt: at("10:00") });
    const b = concept.notify({ recipient: "bumba", message: "x", link: "/", createdAt: at("10:00") });
    expect(typeof a.notification).toBe("string");
    expect(a.notification).not.toBe(b.notification);
  });
});

describe("NotifyingConcept principle", () => {
  test("operational principle", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    const first = n.notify({
      recipient: "bumba",
      message: "Someone is interested in you!",
      link: "/profile/keti",
      createdAt: at("10:00"),
    });
    expect(first).toEqual({ notification: "n1" });
    expect(n._getNotifications({ user: "bumba" })).toEqual([
      {
        notification: "n1",
        message: "Someone is interested in you!",
        link: "/profile/keti",
        createdAt: at("10:00"),
        status: "UNREAD",
      },
    ]);
    expect(n._getUnreadNotifications({ user: "bumba" })).toEqual([
      {
        notification: "n1",
        message: "Someone is interested in you!",
        link: "/profile/keti",
        createdAt: at("10:00"),
      },
    ]);

    const second = n.notify({
      recipient: "bumba",
      message: "It's a match!",
      link: "/matches",
      createdAt: at("10:05"),
    });
    expect(second).toEqual({ notification: "n2" });
    expect(n._getNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual(["n2", "n1"]);
    expect(n._getUnreadNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual([
      "n2",
      "n1",
    ]);

    expect(n.markAsRead({ user: "bumba", notification: "n1" })).toEqual({ notification: "n1" });
    expect(n._getUnreadNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual(["n2"]);
    expect(n._getNotifications({ user: "bumba" })).toEqual([
      {
        notification: "n2",
        message: "It's a match!",
        link: "/matches",
        createdAt: at("10:05"),
        status: "UNREAD",
      },
      {
        notification: "n1",
        message: "Someone is interested in you!",
        link: "/profile/keti",
        createdAt: at("10:00"),
        status: "READ",
      },
    ]);

    expect(() => n.markAsRead({ user: "keti", notification: "n1" })).toThrow(ReadTargetNotFound);
    expect(() => n.dismissNotification({ user: "keti", notification: "n1" })).toThrow(
      DismissTargetNotFound,
    );

    expect(n.dismissNotification({ user: "bumba", notification: "n1" })).toEqual({
      notification: "n1",
    });
    expect(n._getNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual(["n2"]);
    expect(n._getUnreadNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual(["n2"]);
    expect(() => n.markAsRead({ user: "bumba", notification: "n1" })).toThrow(ReadTargetDismissed);
  });
});

describe("notify", () => {
  test("returns the new notification and adds it UNREAD", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    expect(
      n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") }),
    ).toEqual({ notification: "n1" });
    expect(n._getNotifications({ user: "bumba" })[0].status).toBe("UNREAD");
  });

  test("does not deduplicate identical notifications", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    const input = { recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") };
    n.notify(input);
    n.notify(input);
    expect(n._getNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual(["n2", "n1"]);
  });

  test("refuses an empty message without changing state", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") });
    const before = snapshot(n, USERS);
    expect(() =>
      n.notify({ recipient: "bumba", message: "", link: "/x", createdAt: at("09:30") }),
    ).toThrow(EmptyMessage);
    expect(() =>
      n.notify({ recipient: "keti", message: "", link: "/x", createdAt: at("09:30") }),
    ).toThrow("A notification message must not be empty.");
    expect(snapshot(n, USERS)).toEqual(before);
  });

  test("refuses a whitespace-only message without changing state", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") });
    const before = snapshot(n, USERS);
    for (const message of [" ", "   ", "\t\n "]) {
      expect(() =>
        n.notify({ recipient: "bumba", message, link: "/x", createdAt: at("09:30") }),
      ).toThrow(EmptyMessage);
    }
    expect(snapshot(n, USERS)).toEqual(before);
    expect(
      n.notify({ recipient: "bumba", message: "  hi  ", link: "/x", createdAt: at("09:40") }),
    ).toEqual({ notification: "n2" });
    expect(n._getNotifications({ user: "bumba" })[0].message).toBe("  hi  ");
  });

  test("an empty link is accepted", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    expect(
      n.notify({ recipient: "bumba", message: "hi", link: "", createdAt: at("09:00") }),
    ).toEqual({ notification: "n1" });
  });

  test("createdAt is copied, so later mutation of the caller's Date has no effect", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    const createdAt = at("09:00");
    n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt });
    createdAt.setTime(0);
    expect(n._getNotifications({ user: "bumba" })[0].createdAt).toEqual(at("09:00"));
    n._getNotifications({ user: "bumba" })[0].createdAt.setTime(0);
    expect(n._getNotifications({ user: "bumba" })[0].createdAt).toEqual(at("09:00"));
  });
});

describe("markAsRead", () => {
  test("repeating markAsRead on a READ notification succeeds without change", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") });
    expect(n.markAsRead({ user: "bumba", notification: "n1" })).toEqual({ notification: "n1" });
    const before = snapshot(n, USERS);
    expect(n.markAsRead({ user: "bumba", notification: "n1" })).toEqual({ notification: "n1" });
    expect(snapshot(n, USERS)).toEqual(before);
    expect(n._getNotifications({ user: "bumba" })[0].status).toBe("READ");
  });

  test("refuses an unknown notification and another user's notification identically", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") });
    const before = snapshot(n, USERS);
    let notYours: unknown;
    let missing: unknown;
    try {
      n.markAsRead({ user: "keti", notification: "n1" });
    } catch (error) {
      notYours = error;
    }
    try {
      n.markAsRead({ user: "keti", notification: "n999" });
    } catch (error) {
      missing = error;
    }
    expect(notYours).toBeInstanceOf(ReadTargetNotFound);
    expect(missing).toBeInstanceOf(ReadTargetNotFound);
    expect((notYours as Error).message).toBe("No such notification.");
    expect((missing as Error).message).toBe((notYours as Error).message);
    expect(snapshot(n, USERS)).toEqual(before);
  });

  test("refuses another user's dismissed notification as not found, not as dismissed", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") });
    n.dismissNotification({ user: "bumba", notification: "n1" });
    expect(() => n.markAsRead({ user: "keti", notification: "n1" })).toThrow(ReadTargetNotFound);
  });

  test("refuses a dismissed notification without changing state", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "hi", link: "/x", createdAt: at("09:00") });
    n.notify({ recipient: "bumba", message: "yo", link: "/y", createdAt: at("09:10") });
    n.dismissNotification({ user: "bumba", notification: "n1" });
    const before = snapshot(n, USERS);
    expect(() => n.markAsRead({ user: "bumba", notification: "n1" })).toThrow(ReadTargetDismissed);
    expect(() => n.markAsRead({ user: "bumba", notification: "n1" })).toThrow(
      "This notification has been dismissed.",
    );
    expect(snapshot(n, USERS)).toEqual(before);
  });
});

describe("dismissNotification", () => {
  test("dismisses UNREAD and READ notifications, removing them from both lists", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "a", link: "/a", createdAt: at("09:00") });
    n.notify({ recipient: "bumba", message: "b", link: "/b", createdAt: at("09:10") });
    n.notify({ recipient: "bumba", message: "c", link: "/c", createdAt: at("09:20") });
    n.markAsRead({ user: "bumba", notification: "n2" });
    expect(n.dismissNotification({ user: "bumba", notification: "n1" })).toEqual({
      notification: "n1",
    });
    expect(n.dismissNotification({ user: "bumba", notification: "n2" })).toEqual({
      notification: "n2",
    });
    expect(n._getNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual(["n3"]);
    expect(n._getUnreadNotifications({ user: "bumba" }).map((r) => r.notification)).toEqual(["n3"]);
  });

  test("repeating a dismiss succeeds without change", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "a", link: "/a", createdAt: at("09:00") });
    n.dismissNotification({ user: "bumba", notification: "n1" });
    const before = snapshot(n, USERS);
    expect(n.dismissNotification({ user: "bumba", notification: "n1" })).toEqual({
      notification: "n1",
    });
    expect(snapshot(n, USERS)).toEqual(before);
    expect(() => n.markAsRead({ user: "bumba", notification: "n1" })).toThrow(ReadTargetDismissed);
  });

  test("refuses unknown and another user's notification identically without changing state", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "a", link: "/a", createdAt: at("09:00") });
    const before = snapshot(n, USERS);
    expect(() => n.dismissNotification({ user: "keti", notification: "n1" })).toThrow(
      DismissTargetNotFound,
    );
    expect(() => n.dismissNotification({ user: "keti", notification: "n1" })).toThrow(
      "No such notification.",
    );
    expect(() => n.dismissNotification({ user: "keti", notification: "nope" })).toThrow(
      DismissTargetNotFound,
    );
    expect(() => n.dismissNotification({ user: "bumba", notification: "nope" })).toThrow(
      "No such notification.",
    );
    expect(snapshot(n, USERS)).toEqual(before);
  });
});

describe("queries", () => {
  test("order by createdAt newest first, not by creation order", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "mid", link: "/", createdAt: at("10:00") });
    n.notify({ recipient: "bumba", message: "old", link: "/", createdAt: at("09:00") });
    n.notify({ recipient: "bumba", message: "new", link: "/", createdAt: at("11:00") });
    expect(n._getNotifications({ user: "bumba" }).map((r) => r.message)).toEqual([
      "new",
      "mid",
      "old",
    ]);
    expect(n._getUnreadNotifications({ user: "bumba" }).map((r) => r.message)).toEqual([
      "new",
      "mid",
      "old",
    ]);
  });

  test("equal createdAt values break ties by creation order, newest first", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "first", link: "/", createdAt: at("10:00") });
    n.notify({ recipient: "bumba", message: "second", link: "/", createdAt: at("10:00") });
    n.notify({ recipient: "bumba", message: "third", link: "/", createdAt: at("10:00") });
    expect(n._getNotifications({ user: "bumba" }).map((r) => r.message)).toEqual([
      "third",
      "second",
      "first",
    ]);
    expect(n._getUnreadNotifications({ user: "bumba" }).map((r) => r.message)).toEqual([
      "third",
      "second",
      "first",
    ]);
  });

  test("answer only the user's own notifications, and none for unknown users", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "b", link: "/", createdAt: at("10:00") });
    n.notify({ recipient: "keti", message: "k", link: "/", createdAt: at("10:01") });
    expect(n._getNotifications({ user: "bumba" }).map((r) => r.message)).toEqual(["b"]);
    expect(n._getUnreadNotifications({ user: "keti" }).map((r) => r.message)).toEqual(["k"]);
    expect(n._getNotifications({ user: "ghost" })).toEqual([]);
    expect(n._getUnreadNotifications({ user: "ghost" })).toEqual([]);
  });

  test("rows carry exactly the declared fields", () => {
    const n = new NotifyingConcept({ freshNotification: counter() });
    n.notify({ recipient: "bumba", message: "b", link: "/", createdAt: at("10:00") });
    expect(Object.keys(n._getNotifications({ user: "bumba" })[0]).sort()).toEqual(
      ["notification", "message", "link", "createdAt", "status"].sort(),
    );
    expect(Object.keys(n._getUnreadNotifications({ user: "bumba" })[0]).sort()).toEqual(
      ["notification", "message", "link", "createdAt"].sort(),
    );
  });
});

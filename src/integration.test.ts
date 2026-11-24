import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { createApplicationHttpHandler } from "./main.ts";
import { dropTestDatabases, freshTestDatabase } from "./test-database.ts";

/**
 * Black-box tests that drive the assembled application through the
 * @mit-sdg/sync-engine-http package handler (POST/JSON by endpoint pathname).
 * Each test starts from a freshly assembled, in-memory application.
 */

type Handler = ReturnType<typeof createApplicationHttpHandler>;
type Json = Record<string, any>;

interface Reply {
  status: number;
  body: Json;
}

let handler: Handler;

beforeEach(() => {
  handler = createApplicationHttpHandler({ database: freshTestDatabase() });
});

afterAll(dropTestDatabases);

async function post(path: string, body: unknown): Promise<Reply> {
  const response = await handler(
    new Request(`http://localhost/api${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  return { status: response.status, body: (await response.json()) as Json };
}

async function ok(path: string, body: unknown): Promise<Json> {
  const reply = await post(path, body);
  expect(reply.status).toBe(200);
  expect(reply.body.error).toBeUndefined();
  return reply.body;
}

interface User {
  account: string;
  session: string;
}

async function registerUser(username: string): Promise<User> {
  const body = await ok("/accounts/register", { username, password: "correct-horse" });
  expect(body.account).toBe(username);
  expect(typeof body.session).toBe("string");
  return { account: body.account, session: body.session };
}

const interestedIn = async (user: User) =>
  (await ok("/matching/interested-in-you", { session: user.session })).interested as Json[];
const matchesOf = async (user: User) =>
  (await ok("/matching/matches", { session: user.session })).matches as Json[];
const notificationsOf = async (user: User) =>
  (await ok("/notifications/list", { session: user.session })).notifications as Json[];
const unreadOf = async (user: User) =>
  (await ok("/notifications/unread", { session: user.session })).notifications as Json[];

/** Every caller-visible list for the given users, for "no state change" assertions. */
async function snapshot(...users: User[]) {
  const state: Json = {};
  for (const user of users) {
    state[user.account] = {
      interested: await interestedIn(user),
      matches: await matchesOf(user),
      notifications: await notificationsOf(user),
      unread: await unreadOf(user),
    };
  }
  return state;
}

const showInterest = (from: User, other: string) =>
  post("/matching/show-interest", { session: from.session, other });

describe("accounts", () => {
  test("register and sign in start sessions; sign-out ends only that session", async () => {
    const ana = await registerUser("ana");
    const signedIn = await ok("/accounts/sign-in", {
      username: "ana",
      password: "correct-horse",
    });
    expect(signedIn.account).toBe("ana");
    expect(signedIn.session).not.toBe(ana.session);
    expect(new Date(signedIn.expiresAt).getTime()).toBeGreaterThan(Date.now());

    expect(await ok("/accounts/sign-out", { session: ana.session })).toEqual({ ended: true });

    // The ended session no longer resolves to a user anywhere.
    expect(await post("/matching/matches", { session: ana.session })).toEqual({
      status: 401,
      body: { error: "UNAUTHORIZED" },
    });
    expect(await post("/accounts/sign-out", { session: ana.session })).toEqual({
      status: 401,
      body: { error: "UNAUTHORIZED" },
    });
    // The independent sign-in session stays active.
    expect(await ok("/matching/matches", { session: signedIn.session })).toEqual({ matches: [] });
  });

  test("registration and sign-in refusals start no session", async () => {
    await registerUser("ana");
    expect((await post("/accounts/register", { username: "ana", password: "other-pass" })).body)
      .toEqual({ error: "CONFLICT" });
    expect((await post("/accounts/register", { username: "a", password: "correct-horse" })).body)
      .toEqual({ error: "INVALID_REQUEST" });
    expect((await post("/accounts/register", { username: "bea", password: "short" })).body)
      .toEqual({ error: "INVALID_REQUEST" });
    expect(await post("/accounts/sign-in", { username: "ana", password: "wrong-pass" })).toEqual({
      status: 401,
      body: { error: "UNAUTHORIZED" },
    });
    expect(await post("/accounts/sign-in", { username: "nobody", password: "wrong-pass" }))
      .toEqual({ status: 401, body: { error: "UNAUTHORIZED" } });
    expect(await post("/accounts/sign-out", {})).toEqual({
      status: 401,
      body: { error: "UNAUTHORIZED" },
    });
  });
});

describe("show interest and matching", () => {
  test("A shows interest in B: B lists A and gets one UNREAD interest notification", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");

    expect(await ok("/matching/show-interest", { session: a.session, other: "bob" })).toEqual({
      matched: false,
    });

    expect(await interestedIn(b)).toEqual([{ user: "alice" }]);
    const notifications = await notificationsOf(b);
    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toMatchObject({
      message: "Someone is interested in you!",
      link: "/profile/alice",
      status: "UNREAD",
    });
    expect(await unreadOf(b)).toEqual([
      {
        notification: notifications[0].notification,
        message: "Someone is interested in you!",
        link: "/profile/alice",
        createdAt: notifications[0].createdAt,
      },
    ]);
    // The sender gets nothing, and nobody is matched yet.
    expect(await notificationsOf(a)).toEqual([]);
    expect(await matchesOf(a)).toEqual([]);
    expect(await matchesOf(b)).toEqual([]);
  });

  test("mutual interest matches, notifies both, and removes A from B's interested-in-you", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    await ok("/matching/show-interest", { session: a.session, other: "bob" });

    expect(await ok("/matching/show-interest", { session: b.session, other: "alice" })).toEqual({
      matched: true,
    });

    expect(await matchesOf(a)).toEqual([{ user: "bob" }]);
    expect(await matchesOf(b)).toEqual([{ user: "alice" }]);
    expect(await interestedIn(b)).toEqual([]);
    expect(await interestedIn(a)).toEqual([]);

    const aNotes = await notificationsOf(a);
    expect(aNotes).toHaveLength(1);
    expect(aNotes[0]).toMatchObject({ message: "It's a match!", link: "/matches", status: "UNREAD" });

    const bNotes = await notificationsOf(b);
    expect(bNotes.map(({ message, link, status }) => ({ message, link, status }))).toEqual([
      { message: "It's a match!", link: "/matches", status: "UNREAD" },
      { message: "Someone is interested in you!", link: "/profile/alice", status: "UNREAD" },
    ]);
    expect((await unreadOf(b)).map(({ message }) => message)).toEqual([
      "It's a match!",
      "Someone is interested in you!",
    ]);
  });

  test("repeated interest, self-interest, matched-pair interest are refused with no state change", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    await ok("/matching/show-interest", { session: a.session, other: "bob" });
    const before = await snapshot(a, b);

    expect(await showInterest(a, "bob")).toEqual({ status: 409, body: { error: "CONFLICT" } });
    expect(await showInterest(a, "alice")).toEqual({
      status: 400,
      body: { error: "INVALID_REQUEST" },
    });
    expect(await snapshot(a, b)).toEqual(before);

    await ok("/matching/show-interest", { session: b.session, other: "alice" });
    const matched = await snapshot(a, b);
    expect(await showInterest(a, "bob")).toEqual({ status: 409, body: { error: "CONFLICT" } });
    expect(await showInterest(b, "alice")).toEqual({ status: 409, body: { error: "CONFLICT" } });
    expect(await snapshot(a, b)).toEqual(matched);
  });

  test("missing, invented, and ended sessions are refused before any matching action", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    const before = await snapshot(a, b);

    const unauthorized = { status: 401, body: { error: "UNAUTHORIZED" } };
    expect(await post("/matching/show-interest", { other: "bob" })).toEqual(unauthorized);
    expect(await post("/matching/show-interest", { session: "invented", other: "bob" })).toEqual(
      unauthorized,
    );
    expect(await post("/matching/pass", { other: "bob" })).toEqual(unauthorized);
    expect(await post("/matching/unmatch", { session: "invented", other: "bob" })).toEqual(
      unauthorized,
    );
    expect(await post("/matching/interested-in-you", {})).toEqual(unauthorized);
    expect(await post("/notifications/list", { session: "invented" })).toEqual(unauthorized);
    expect(await post("/notifications/unread", {})).toEqual(unauthorized);
    expect(await post("/notifications/mark-read", { notification: "x" })).toEqual(unauthorized);
    expect(await post("/notifications/dismiss", { session: "nope", notification: "x" })).toEqual(
      unauthorized,
    );
    expect(await snapshot(a, b)).toEqual(before);

    const extra = await ok("/accounts/sign-in", { username: "alice", password: "correct-horse" });
    await ok("/accounts/sign-out", { session: extra.session });
    expect(await post("/matching/show-interest", { session: extra.session, other: "bob" })).toEqual(
      unauthorized,
    );
    expect(await snapshot(a, b)).toEqual(before);
  });

  test("the acting user always comes from the session, never from the request", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    // Extra identity fields are not treated as the actor.
    await ok("/matching/show-interest", { session: a.session, other: "bob", from: "bob" });
    expect(await interestedIn(b)).toEqual([{ user: "alice" }]);
    expect(await interestedIn(a)).toEqual([]);
  });
});

describe("pass", () => {
  test("passing on an incoming interest removes it and sends A nothing", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    await ok("/matching/show-interest", { session: a.session, other: "bob" });
    const bNotesBefore = await notificationsOf(b);

    expect(await ok("/matching/pass", { session: b.session, other: "alice" })).toEqual({
      passed: true,
    });

    expect(await interestedIn(b)).toEqual([]);
    expect(await notificationsOf(a)).toEqual([]);
    expect(await notificationsOf(b)).toEqual(bNotesBefore);
    expect(await matchesOf(a)).toEqual([]);

    // Repeating the pass succeeds without change.
    expect(await ok("/matching/pass", { session: b.session, other: "alice" })).toEqual({
      passed: true,
    });
    expect(await interestedIn(b)).toEqual([]);
    // Having passed, B cannot show interest in A, so no match is possible.
    expect(await showInterest(b, "alice")).toEqual({ status: 409, body: { error: "CONFLICT" } });
    expect(await matchesOf(b)).toEqual([]);
  });

  test("pass without incoming interest, after own interest, or on oneself is refused", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    const before = await snapshot(a, b);
    const conflict = { status: 409, body: { error: "CONFLICT" } };

    expect(await post("/matching/pass", { session: b.session, other: "alice" })).toEqual(conflict);
    expect(await post("/matching/pass", { session: b.session, other: "bob" })).toEqual(conflict);
    expect(await snapshot(a, b)).toEqual(before);

    // A showed interest in B; A cannot pass on B (B has no interest in A).
    await ok("/matching/show-interest", { session: a.session, other: "bob" });
    const afterInterest = await snapshot(a, b);
    expect(await post("/matching/pass", { session: a.session, other: "bob" })).toEqual(conflict);
    expect(await snapshot(a, b)).toEqual(afterInterest);
  });
});

describe("unmatch", () => {
  test("unmatch removes the match, prevents rematching, and only participants can unmatch", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    const c = await registerUser("carol");
    await ok("/matching/show-interest", { session: a.session, other: "bob" });
    await ok("/matching/show-interest", { session: b.session, other: "alice" });
    const matched = await snapshot(a, b, c);
    const notFound = { status: 404, body: { error: "NOT_FOUND" } };

    // A non-participant cannot unmatch either side of the pair.
    expect(await post("/matching/unmatch", { session: c.session, other: "alice" })).toEqual(
      notFound,
    );
    expect(await post("/matching/unmatch", { session: c.session, other: "bob" })).toEqual(notFound);
    expect(await post("/matching/unmatch", { session: a.session, other: "alice" })).toEqual(
      notFound,
    );
    expect(await snapshot(a, b, c)).toEqual(matched);

    expect(await ok("/matching/unmatch", { session: a.session, other: "bob" })).toEqual({
      unmatched: true,
    });
    expect(await matchesOf(a)).toEqual([]);
    expect(await matchesOf(b)).toEqual([]);
    // Both decisions are PASSED: neither appears as interested and neither can show interest again.
    expect(await interestedIn(a)).toEqual([]);
    expect(await interestedIn(b)).toEqual([]);
    expect(await showInterest(a, "bob")).toEqual({ status: 409, body: { error: "CONFLICT" } });
    expect(await showInterest(b, "alice")).toEqual({ status: 409, body: { error: "CONFLICT" } });
    // B's decision about A is no longer INTERESTED, so A has no incoming interest to pass on.
    expect(await post("/matching/pass", { session: a.session, other: "bob" })).toEqual({
      status: 409,
      body: { error: "CONFLICT" },
    });
    expect(await matchesOf(a)).toEqual([]);
    // Unmatching leaves existing notifications untouched.
    expect(await notificationsOf(a)).toEqual(matched.alice.notifications);
    expect(await notificationsOf(b)).toEqual(matched.bob.notifications);
    // A repeated unmatch is refused.
    expect(await post("/matching/unmatch", { session: b.session, other: "alice" })).toEqual(
      notFound,
    );
  });
});

describe("notifications", () => {
  test("mark as read and dismiss work only on own notifications without touching matching", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    await ok("/matching/show-interest", { session: a.session, other: "bob" });
    const [interest] = await notificationsOf(b);
    const notFound = { status: 404, body: { error: "NOT_FOUND" } };

    // Another user's notification is refused exactly like one that does not exist.
    const before = await snapshot(a, b);
    const foreignRead = await post("/notifications/mark-read", {
      session: a.session,
      notification: interest.notification,
    });
    const missingRead = await post("/notifications/mark-read", {
      session: a.session,
      notification: "no-such-notification",
    });
    expect(foreignRead).toEqual(notFound);
    expect(missingRead).toEqual(foreignRead);
    const foreignDismiss = await post("/notifications/dismiss", {
      session: a.session,
      notification: interest.notification,
    });
    const missingDismiss = await post("/notifications/dismiss", {
      session: a.session,
      notification: "no-such-notification",
    });
    expect(foreignDismiss).toEqual(notFound);
    expect(missingDismiss).toEqual(foreignDismiss);
    expect(await snapshot(a, b)).toEqual(before);

    // B marks own notification as read: it leaves unread but stays listed as READ.
    expect(
      await ok("/notifications/mark-read", { session: b.session, notification: interest.notification }),
    ).toEqual({ notification: interest.notification });
    expect(await unreadOf(b)).toEqual([]);
    expect(await notificationsOf(b)).toEqual([{ ...interest, status: "READ" }]);
    // Marking again succeeds without change.
    await ok("/notifications/mark-read", { session: b.session, notification: interest.notification });
    expect(await notificationsOf(b)).toEqual([{ ...interest, status: "READ" }]);

    // B matches A, then dismisses both notifications: they leave both lists.
    await ok("/matching/show-interest", { session: b.session, other: "alice" });
    const [match] = await unreadOf(b);
    expect(match.message).toBe("It's a match!");
    expect(
      await ok("/notifications/dismiss", { session: b.session, notification: interest.notification }),
    ).toEqual({ notification: interest.notification });
    await ok("/notifications/dismiss", { session: b.session, notification: match.notification });
    expect(await notificationsOf(b)).toEqual([]);
    expect(await unreadOf(b)).toEqual([]);

    // Dismissing again succeeds; marking a dismissed notification as read is refused.
    await ok("/notifications/dismiss", { session: b.session, notification: match.notification });
    expect(
      await post("/notifications/mark-read", { session: b.session, notification: match.notification }),
    ).toEqual({ status: 409, body: { error: "CONFLICT" } });

    // The interest and match that caused the notifications are unaffected.
    expect(await matchesOf(a)).toEqual([{ user: "bob" }]);
    expect(await matchesOf(b)).toEqual([{ user: "alice" }]);
    // A's own match notification is untouched by B's dismissals.
    expect((await notificationsOf(a)).map(({ message, status }) => ({ message, status }))).toEqual([
      { message: "It's a match!", status: "UNREAD" },
    ]);
  });

  test("dismissing an interest notification keeps the sender in interested-in-you", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    await ok("/matching/show-interest", { session: a.session, other: "bob" });
    const [interest] = await notificationsOf(b);
    await ok("/notifications/dismiss", { session: b.session, notification: interest.notification });
    expect(await notificationsOf(b)).toEqual([]);
    expect(await interestedIn(b)).toEqual([{ user: "alice" }]);
  });

  test("lists are newest first across several interests", async () => {
    const a = await registerUser("alice");
    const b = await registerUser("bob");
    const c = await registerUser("carol");
    await ok("/matching/show-interest", { session: a.session, other: "carol" });
    await ok("/matching/show-interest", { session: b.session, other: "carol" });
    expect((await notificationsOf(c)).map(({ link }) => link)).toEqual([
      "/profile/bob",
      "/profile/alice",
    ]);
    // Interested-in-you is earliest first.
    expect(await interestedIn(c)).toEqual([{ user: "alice" }, { user: "bob" }]);
  });
});

describe("boundary input", () => {
  test("a request missing a required field is rejected", async () => {
    const a = await registerUser("alice");
    expect(await post("/matching/show-interest", { session: a.session })).toEqual({
      status: 400,
      body: { error: "INVALID_REQUEST" },
    });
    expect(await post("/notifications/mark-read", { session: a.session })).toEqual({
      status: 400,
      body: { error: "INVALID_REQUEST" },
    });
  });
});

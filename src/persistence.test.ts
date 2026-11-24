import { afterAll, describe, expect, test } from "bun:test";
import { openStores } from "./assembly.ts";
import { createApplicationHttpHandler } from "./main.ts";
import { dropTestDatabases, freshTestDatabase } from "./test-database.ts";

/**
 * "Restart" tests: run the application against a MongoDB database, drop it, assemble a new one over
 * the same database, and check that what people did is still there.
 */

type Json = Record<string, any>;

afterAll(dropTestDatabases);

async function start(database: ReturnType<typeof freshTestDatabase>) {
  const { stores, flush } = await openStores(database);
  const handler = createApplicationHttpHandler({ database, stores });
  const post = async (path: string, body: unknown): Promise<{ status: number; body: Json }> => {
    const response = await handler(
      new Request(`http://localhost/api${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
    return { status: response.status, body: (await response.json()) as Json };
  };
  return { post, flush };
}

const profile = (name: string, role: string) => ({
  role,
  name,
  university: "MIT",
  major: "CS",
  graduationYear: 2027,
  skills: ["software engineering"],
  experience: "",
  interests: ["data tools"],
  location: "MIT campus",
  latitude: 42.36,
  longitude: -71.09,
  availability: 10,
});

describe("state survives a restart", () => {
  test("accounts, profiles, matches, recommendations, notifications and chats are kept; sessions are not", async () => {
    const database = freshTestDatabase();
    const first = await start(database);

    const founder = (await first.post("/accounts/register", { username: "fran", password: "correct-horse" })).body;
    const builder = (await first.post("/accounts/register", { username: "bob", password: "correct-horse" })).body;
    await first.post("/profiles/create", { ...profile("Fran", "FOUNDER"), session: founder.session });
    await first.post("/profiles/set-pitch", { session: founder.session, pitch: "A data tool" });
    await first.post("/profiles/publish", { session: founder.session });
    await first.post("/profiles/create", { ...profile("Bob", "BUILDER"), session: builder.session });
    await first.post("/profiles/publish", { session: builder.session });
    await first.post("/recommendations/set-preferences", {
      session: builder.session,
      skills: ["sales"],
      interests: [],
      universities: [],
      distance: 25,
    });
    expect((await first.post("/matching/show-interest", { session: founder.session, other: "bob" })).body.matched).toBe(false);
    const answer = await first.post("/matching/show-interest", { session: builder.session, other: "fran" });
    expect(answer.body.matched).toBe(true);
    const chats = (await first.post("/chats/list", { session: founder.session })).body.conversations;
    await first.post("/chats/send", { session: founder.session, conversation: chats[0].conversation, content: "Hello Bob" });
    const feedBefore = (await first.post("/recommendations/feed", { session: builder.session })).body.feed;
    expect(feedBefore).toHaveLength(1);
    await first.flush();

    // A new process over the same database.
    const second = await start(database);

    // Sessions are not kept, so the old token is refused and people sign in again.
    expect((await second.post("/profiles/mine", { session: founder.session })).status).toBe(401);
    const wrong = await second.post("/accounts/sign-in", { username: "fran", password: "wrong-password" });
    expect(wrong.status).toBe(401);
    const fran = (await second.post("/accounts/sign-in", { username: "fran", password: "correct-horse" })).body;
    const bob = (await second.post("/accounts/sign-in", { username: "bob", password: "correct-horse" })).body;
    expect(fran.session).toBeString();

    const mine = (await second.post("/profiles/mine", { session: fran.session })).body;
    expect(mine).toMatchObject({ name: "Fran", role: "FOUNDER", startupPitch: "A data tool", visible: true });

    expect((await second.post("/matching/matches", { session: fran.session })).body.matches).toEqual([{ user: "bob" }]);
    expect((await second.post("/recommendations/preferences", { session: bob.session })).body).toMatchObject({
      skills: ["sales"],
      distance: 25,
    });
    expect((await second.post("/recommendations/feed", { session: bob.session })).body.feed).toEqual(feedBefore);

    const notes = (await second.post("/notifications/list", { session: fran.session })).body.notifications as Json[];
    expect(notes.map((note) => note.message)).toContain("It's a match!");
    expect(notes[0].createdAt).toBeString();

    const conversations = (await second.post("/chats/list", { session: bob.session })).body.conversations;
    const thread = (await second.post("/chats/messages", { session: bob.session, conversation: conversations[0].conversation })).body;
    expect(thread.messages.map((message: Json) => message.content)).toEqual(["Hello Bob"]);

    // The restarted application keeps working: the same username is still taken.
    expect((await second.post("/accounts/register", { username: "fran", password: "correct-horse" })).status).toBe(409);
  });

  test("a new application over an empty database starts empty", async () => {
    const { post } = await start(freshTestDatabase());
    expect((await post("/accounts/sign-in", { username: "nobody", password: "correct-horse" })).status).toBe(401);
  });
});

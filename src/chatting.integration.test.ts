import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { createApplicationHttpHandler } from "./main.ts";
import { dropTestDatabases, freshTestDatabase } from "./test-database.ts";

/**
 * Black-box tests for chatting (Reactions 7, 9, and the Chatting half of 10), driven
 * through the @mit-sdg/sync-engine-http handler. Chatting uses a fresh MongoDB database
 * per test; the other concepts start empty in memory.
 */

type Handler = ReturnType<typeof createApplicationHttpHandler>;
type Json = Record<string, any>;

let handler: Handler;

beforeEach(() => {
  handler = createApplicationHttpHandler({ database: freshTestDatabase() });
});

afterAll(dropTestDatabases);

async function post(path: string, body: unknown): Promise<{ status: number; body: Json }> {
  const response = await handler(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  return { status: response.status, body: (await response.json()) as Json };
}

async function ok(path: string, body: unknown): Promise<Json> {
  const reply = await post(path, body);
  expect(reply.body.error).toBeUndefined();
  expect(reply.status).toBe(200);
  return reply.body;
}

async function refused(path: string, body: unknown, status: number, error: string) {
  const reply = await post(path, body);
  expect(reply.status).toBe(status);
  expect(reply.body.error).toBe(error);
}

async function register(username: string): Promise<string> {
  return (await ok("/accounts/register", { username, password: "correct-horse" })).session;
}

const conversationsOf = async (session: string) =>
  (await ok("/chats/list", { session })).conversations as Json[];
const messagesIn = (session: string, conversation: string) =>
  ok("/chats/messages", { session, conversation });
const send = (session: string, conversation: string, content: string) =>
  post("/chats/send", { session, conversation, content });
const newMessageNotifications = async (session: string) =>
  ((await ok("/notifications/list", { session })).notifications as Json[]).filter(
    (row) => row.message === "You have a new message!",
  );

/** Keti and Bumba match; returns their sessions and their conversation. */
async function matchedPair() {
  const keti = await register("keti");
  const bumba = await register("bumba");
  expect((await ok("/matching/show-interest", { session: keti, other: "bumba" })).matched).toBe(false);
  expect((await ok("/matching/show-interest", { session: bumba, other: "keti" })).matched).toBe(true);
  const [row] = await conversationsOf(keti);
  return { keti, bumba, conversation: row!.conversation as string };
}

describe("opening conversations", () => {
  test("one-sided interest opens no conversation", async () => {
    const keti = await register("keti");
    const bumba = await register("bumba");
    await ok("/matching/show-interest", { session: keti, other: "bumba" });
    expect(await conversationsOf(keti)).toEqual([]);
    expect(await conversationsOf(bumba)).toEqual([]);
  });

  test("a match opens one OPEN conversation that both people see", async () => {
    const { keti, bumba, conversation } = await matchedPair();
    expect(await conversationsOf(keti)).toEqual([{ conversation, other: "bumba", status: "OPEN" }]);
    expect(await conversationsOf(bumba)).toEqual([{ conversation, other: "keti", status: "OPEN" }]);
  });
});

describe("chatting", () => {
  test("messages reach both participants, oldest first, and notify only the recipient", async () => {
    const { keti, bumba, conversation } = await matchedPair();

    expect(typeof (await ok("/chats/send", { session: keti, conversation, content: "Tell me more?" })).message).toBe(
      "string",
    );
    await ok("/chats/send", { session: bumba, conversation, content: "It's a travel app." });

    for (const [session, other] of [
      [keti, "bumba"],
      [bumba, "keti"],
    ] as const) {
      const body = await messagesIn(session, conversation);
      expect(body.other).toBe(other);
      expect(body.status).toBe("OPEN");
      expect(body.messages.map((row: Json) => [row.sender, row.content])).toEqual([
        ["keti", "Tell me more?"],
        ["bumba", "It's a travel app."],
      ]);
    }

    const toBumba = await newMessageNotifications(bumba);
    const toKeti = await newMessageNotifications(keti);
    expect(toBumba).toHaveLength(1);
    expect(toKeti).toHaveLength(1);
    expect(toBumba[0]!.link).toBe(`/chats/${conversation}`);
  });

  test("an empty message is refused and notifies nobody", async () => {
    const { keti, bumba, conversation } = await matchedPair();
    await refused("/chats/send", { session: keti, conversation, content: "   " }, 400, "INVALID_REQUEST");
    expect((await messagesIn(keti, conversation)).messages).toEqual([]);
    expect(await newMessageNotifications(bumba)).toEqual([]);
  });

  test("outsiders can neither send nor read, and get the same answer as for a missing conversation", async () => {
    const { conversation } = await matchedPair();
    const ana = await register("ana");
    await refused("/chats/send", { session: ana, conversation, content: "Hi" }, 404, "NOT_FOUND");
    await refused("/chats/messages", { session: ana, conversation }, 404, "NOT_FOUND");
    await refused("/chats/messages", { session: ana, conversation: "missing" }, 404, "NOT_FOUND");
    expect(await conversationsOf(ana)).toEqual([]);
  });

  test("an invalid session is refused before any chat read or send", async () => {
    const { keti, conversation } = await matchedPair();
    await refused("/chats/list", { session: "invented" }, 401, "UNAUTHORIZED");
    await refused("/chats/messages", { session: "invented", conversation }, 401, "UNAUTHORIZED");
    await refused("/chats/send", { conversation, content: "Hi" }, 401, "UNAUTHORIZED");
    expect((await messagesIn(keti, conversation)).messages).toEqual([]);
  });
});

describe("closing conversations", () => {
  test("unmatching closes the conversation: history stays readable, new messages are refused", async () => {
    const { keti, bumba, conversation } = await matchedPair();
    await ok("/chats/send", { session: keti, conversation, content: "Hello!" });

    await ok("/matching/unmatch", { session: bumba, other: "keti" });

    expect(await conversationsOf(keti)).toEqual([{ conversation, other: "bumba", status: "CLOSED" }]);
    const body = await messagesIn(bumba, conversation);
    expect(body.status).toBe("CLOSED");
    expect(body.messages.map((row: Json) => row.content)).toEqual(["Hello!"]);

    const reply = await send(keti, conversation, "Wait!");
    expect(reply.status).toBe(409);
    expect(reply.body.error).toBe("CONFLICT");
    expect(await newMessageNotifications(bumba)).toHaveLength(1);
  });
});

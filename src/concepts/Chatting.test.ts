import { afterAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { type Db, MongoClient } from "mongodb";
import {
  ChattingConcept,
  CloseTargetNotFound,
  ConversationAlreadyClosed,
  ConversationClosed,
  ConversationExists,
  ConversationNotFound,
  ConversationWithSelf,
  EmptyChatMessage,
} from "./Chatting.ts";

// These tests need the MongoDB from compose.yaml: `bun run db:up`.
const client = new MongoClient(process.env.MONGODB_URL!, { serverSelectionTimeoutMS: 5_000 });
const databases: Db[] = [];

/** A Chatting concept on its own fresh database, dropped after the run. */
function fresh(): ChattingConcept {
  const database = client.db(`chatting-test-${randomUUID()}`);
  databases.push(database);
  return new ChattingConcept(database);
}

afterAll(async () => {
  await Promise.all(databases.map((database) => database.dropDatabase()));
  await client.close();
});

const at = (hhmm: string) => new Date(`2026-11-23T${hhmm}:00.000Z`);

describe("ChattingConcept construction", () => {
  test("has zero runtime arity", () => {
    expect(ChattingConcept.length).toBe(0);
  });

  test("exposes only declared actions and queries on the prototype", () => {
    expect(Object.getOwnPropertyNames(ChattingConcept.prototype).sort()).toEqual(
      [
        "constructor",
        "createConversation",
        "sendMessage",
        "closeConversation",
        "_getConversations",
        "_getMessages",
        "_conversationBetween",
        "_isParticipant",
        "_otherParticipant",
      ].sort(),
    );
  });
});

describe("Chatting principle", () => {
  test("Keti and Bumba chat, Ana is shut out, and closing keeps history but stops new messages", async () => {
    const c = fresh();
    const { conversation } = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });

    await c.sendMessage({ conversation, sender: "keti", content: "What does your app do?", sentAt: at("10:00") });
    await c.sendMessage({ conversation, sender: "bumba", content: "Helps solo travelers meet.", sentAt: at("10:02") });

    const expected = [
      { sender: "keti", content: "What does your app do?", sentAt: at("10:00") },
      { sender: "bumba", content: "Helps solo travelers meet.", sentAt: at("10:02") },
    ];
    for (const user of ["keti", "bumba"]) {
      const rows = await c._getMessages({ user, conversation });
      expect(rows.map(({ message: _m, ...rest }) => rest)).toEqual(expected);
    }
    expect(await c._getConversations({ user: "keti" })).toEqual([
      { conversation, other: "bumba", status: "OPEN" },
    ]);
    expect(await c._getConversations({ user: "bumba" })).toEqual([
      { conversation, other: "keti", status: "OPEN" },
    ]);

    await expect(
      c.sendMessage({ conversation, sender: "ana", content: "Hi", sentAt: at("10:03") }),
    ).rejects.toThrow(ConversationNotFound);
    expect(await c._getMessages({ user: "ana", conversation })).toEqual([]);
    await expect(
      c.sendMessage({ conversation, sender: "keti", content: "   ", sentAt: at("10:04") }),
    ).rejects.toThrow(EmptyChatMessage);

    expect(await c.closeConversation({ conversation })).toEqual({});
    await expect(
      c.sendMessage({ conversation, sender: "keti", content: "Still there?", sentAt: at("10:05") }),
    ).rejects.toThrow(ConversationClosed);
    expect(await c._getMessages({ user: "keti", conversation })).toHaveLength(2);
    expect(await c._getConversations({ user: "keti" })).toEqual([
      { conversation, other: "bumba", status: "CLOSED" },
    ]);
    await expect(c.createConversation({ firstUser: "bumba", secondUser: "keti" })).rejects.toThrow(
      ConversationExists,
    );
  });
});

describe("createConversation", () => {
  test("refuses a conversation with oneself", async () => {
    const c = fresh();
    await expect(c.createConversation({ firstUser: "keti", secondUser: "keti" })).rejects.toThrow(
      ConversationWithSelf,
    );
    expect(await c._getConversations({ user: "keti" })).toEqual([]);
  });

  test("a user may have conversations with several people", async () => {
    const c = fresh();
    const first = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });
    const second = await c.createConversation({ firstUser: "ana", secondUser: "keti" });
    expect((await c._getConversations({ user: "keti" })).map((row) => row.conversation)).toEqual([
      second.conversation,
      first.conversation,
    ]);
  });

  test("concurrent requests for one pair create exactly one conversation", async () => {
    const c = fresh();
    const results = await Promise.allSettled([
      c.createConversation({ firstUser: "keti", secondUser: "bumba" }),
      c.createConversation({ firstUser: "bumba", secondUser: "keti" }),
      c.createConversation({ firstUser: "keti", secondUser: "bumba" }),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    for (const r of results.filter((r) => r.status === "rejected")) {
      expect((r as PromiseRejectedResult).reason).toBeInstanceOf(ConversationExists);
    }
    expect(await c._getConversations({ user: "keti" })).toHaveLength(1);
  });
});

describe("sendMessage", () => {
  test("refuses an unknown conversation", async () => {
    const c = fresh();
    await expect(
      c.sendMessage({ conversation: "nope", sender: "keti", content: "Hi", sentAt: at("10:00") }),
    ).rejects.toThrow(ConversationNotFound);
  });

  test("orders by sentAt, then by send order for equal times", async () => {
    const c = fresh();
    const { conversation } = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });
    await c.sendMessage({ conversation, sender: "keti", content: "late", sentAt: at("10:05") });
    await c.sendMessage({ conversation, sender: "bumba", content: "early", sentAt: at("10:00") });
    await c.sendMessage({ conversation, sender: "keti", content: "early too", sentAt: at("10:00") });
    const rows = await c._getMessages({ user: "bumba", conversation });
    expect(rows.map((row) => row.content)).toEqual(["early", "early too", "late"]);
  });

  test("keeps content exactly as supplied", async () => {
    const c = fresh();
    const { conversation } = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });
    await c.sendMessage({ conversation, sender: "keti", content: "  hi  ", sentAt: at("10:00") });
    expect((await c._getMessages({ user: "keti", conversation }))[0]!.content).toBe("  hi  ");
  });
});

describe("closeConversation", () => {
  test("refuses an unknown conversation and a second close", async () => {
    const c = fresh();
    await expect(c.closeConversation({ conversation: "nope" })).rejects.toThrow(CloseTargetNotFound);
    const { conversation } = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });
    await c.closeConversation({ conversation });
    await expect(c.closeConversation({ conversation })).rejects.toThrow(ConversationAlreadyClosed);
  });
});

describe("lookup queries", () => {
  test("_conversationBetween finds the pair in either order", async () => {
    const c = fresh();
    const { conversation } = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });
    const row = [{ conversation, status: "OPEN" as const }];
    expect(await c._conversationBetween({ user: "keti", other: "bumba" })).toEqual(row);
    expect(await c._conversationBetween({ user: "bumba", other: "keti" })).toEqual(row);
    expect(await c._conversationBetween({ user: "keti", other: "ana" })).toEqual([]);
    expect(await c._conversationBetween({ user: "keti", other: "keti" })).toEqual([]);
  });

  test("_otherParticipant answers only for participants", async () => {
    const c = fresh();
    const { conversation } = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });
    expect(await c._otherParticipant({ conversation, user: "keti" })).toEqual([{ other: "bumba" }]);
    expect(await c._otherParticipant({ conversation, user: "bumba" })).toEqual([{ other: "keti" }]);
    expect(await c._otherParticipant({ conversation, user: "ana" })).toEqual([]);
    expect(await c._otherParticipant({ conversation: "nope", user: "keti" })).toEqual([]);
  });

  test("_isParticipant answers one flag, true only for participants", async () => {
    const c = fresh();
    const { conversation } = await c.createConversation({ firstUser: "keti", secondUser: "bumba" });
    expect(await c._isParticipant({ conversation, user: "keti" })).toEqual({ participant: true });
    expect(await c._isParticipant({ conversation, user: "ana" })).toEqual({ participant: false });
    expect(await c._isParticipant({ conversation: "nope", user: "keti" })).toEqual({
      participant: false,
    });
    await c.closeConversation({ conversation });
    expect(await c._isParticipant({ conversation, user: "bumba" })).toEqual({ participant: true });
  });

  test("queries answer nothing for an unknown user", async () => {
    const c = fresh();
    expect(await c._getConversations({ user: "nobody" })).toEqual([]);
    expect(await c._getMessages({ user: "nobody", conversation: "nope" })).toEqual([]);
  });
});

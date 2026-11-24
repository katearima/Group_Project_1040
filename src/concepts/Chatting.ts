import { type Collection, type Db, MongoServerError, ObjectId } from "mongodb";
import { db as projectDatabase } from "../db.ts";

export type User = string;
export type Conversation = string;
export type Message = string;
export type ConversationStatus = "OPEN" | "CLOSED";

export const CONVERSATION_WITH_SELF_DETAIL = "You cannot start a conversation with yourself.";
export const CONVERSATION_EXISTS_DETAIL = "You already have a conversation with this person.";
export const CONVERSATION_NOT_FOUND_DETAIL = "No such conversation.";
export const CONVERSATION_CLOSED_DETAIL =
  "This conversation is closed; you can no longer send messages.";
export const EMPTY_CHAT_MESSAGE_DETAIL = "A message must not be empty.";
export const CLOSE_TARGET_NOT_FOUND_DETAIL = "No such conversation.";
export const CONVERSATION_ALREADY_CLOSED_DETAIL = "This conversation is already closed.";

/** Refusal CONVERSATION_WITH_SELF. */
export class ConversationWithSelf extends Error {}
/** Refusal CONVERSATION_EXISTS. */
export class ConversationExists extends Error {}
/** Refusal CONVERSATION_NOT_FOUND. */
export class ConversationNotFound extends Error {}
/** Refusal CONVERSATION_CLOSED. */
export class ConversationClosed extends Error {}
/** Refusal EMPTY_MESSAGE (Chatting's own; Notifying has a separate EMPTY_MESSAGE class). */
export class EmptyChatMessage extends Error {}
/** Refusal CLOSE_TARGET_NOT_FOUND. */
export class CloseTargetNotFound extends Error {}
/** Refusal CONVERSATION_ALREADY_CLOSED. */
export class ConversationAlreadyClosed extends Error {}

/**
 * One Conversation. `_id` is an ObjectId's hex string, so sorting by `_id` keeps creation
 * order. `pair` is one string naming both users in sorted order; its unique index makes
 * MongoDB refuse a second conversation for the same pair, even when two requests arrive at once.
 */
interface ConversationDocument {
  _id: Conversation;
  firstUser: User;
  secondUser: User;
  pair: string;
  status: ConversationStatus;
}

/** One Message. Sorting by `_id` keeps send order, which breaks ties between equal sentAt. */
interface MessageDocument {
  _id: Message;
  conversation: Conversation;
  sender: User;
  content: string;
  sentAt: Date;
}

/** Lets two connected people talk privately, keeping their messages after the chat closes. */
export class ChattingConcept {
  readonly #conversations: Collection<ConversationDocument>;
  readonly #messages: Collection<MessageDocument>;
  #indexes: Promise<unknown> | undefined;

  /**
   * Defaults to the project database in `src/db.ts`; tests pass their own. The defaults keep
   * the constructor's arity zero, which the zero-argument `implementations()` needs.
   */
  constructor(database: Db = projectDatabase, name = "Chatting") {
    const prefix = name.toLowerCase();
    this.#conversations = database.collection(`${prefix}.conversations`);
    this.#messages = database.collection(`${prefix}.messages`);
  }

  async createConversation({
    firstUser,
    secondUser,
  }: {
    firstUser: User;
    secondUser: User;
  }): Promise<{ conversation: Conversation }> {
    if (firstUser === secondUser) {
      throw new ConversationWithSelf(CONVERSATION_WITH_SELF_DETAIL);
    }
    await this.#ready();
    const conversation = new ObjectId().toHexString();
    try {
      await this.#conversations.insertOne({
        _id: conversation,
        firstUser,
        secondUser,
        pair: pairOf(firstUser, secondUser),
        status: "OPEN",
      });
    } catch (error) {
      if (isDuplicate(error)) throw new ConversationExists(CONVERSATION_EXISTS_DETAIL);
      throw error;
    }
    return { conversation };
  }

  async sendMessage({
    conversation,
    sender,
    content,
    sentAt,
  }: {
    conversation: Conversation;
    sender: User;
    content: string;
    sentAt: Date;
  }): Promise<{ message: Message }> {
    const found = await this.#conversations.findOne({ _id: conversation });
    if (found === null || !isParticipant(found, sender)) {
      throw new ConversationNotFound(CONVERSATION_NOT_FOUND_DETAIL);
    }
    if (found.status === "CLOSED") throw new ConversationClosed(CONVERSATION_CLOSED_DETAIL);
    // Text containing only whitespace counts as empty (team product design).
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new EmptyChatMessage(EMPTY_CHAT_MESSAGE_DETAIL);
    }
    await this.#ready();
    const message = new ObjectId().toHexString();
    await this.#messages.insertOne({
      _id: message,
      conversation,
      sender,
      content,
      sentAt: new Date(sentAt.getTime()),
    });
    return { message };
  }

  async closeConversation({
    conversation,
  }: {
    conversation: Conversation;
  }): Promise<Record<string, never>> {
    // Closing only an OPEN conversation, in one update, keeps two concurrent closes from both succeeding.
    const { matchedCount } = await this.#conversations.updateOne(
      { _id: conversation, status: "OPEN" },
      { $set: { status: "CLOSED" } },
    );
    if (matchedCount === 1) return {};
    const found = await this.#conversations.findOne({ _id: conversation });
    if (found === null) throw new CloseTargetNotFound(CLOSE_TARGET_NOT_FOUND_DETAIL);
    throw new ConversationAlreadyClosed(CONVERSATION_ALREADY_CLOSED_DETAIL);
  }

  async _getConversations({
    user,
  }: {
    user: User;
  }): Promise<{ conversation: Conversation; other: User; status: ConversationStatus }[]> {
    const found = await this.#conversations
      .find({ $or: [{ firstUser: user }, { secondUser: user }] })
      .sort({ _id: -1 })
      .toArray();
    return found.map((row) => ({
      conversation: row._id,
      other: otherOf(row, user),
      status: row.status,
    }));
  }

  async _getMessages({
    user,
    conversation,
  }: {
    user: User;
    conversation: Conversation;
  }): Promise<{ message: Message; sender: User; content: string; sentAt: Date }[]> {
    const found = await this.#conversations.findOne({ _id: conversation });
    if (found === null || !isParticipant(found, user)) return [];
    const messages = await this.#messages
      .find({ conversation })
      .sort({ sentAt: 1, _id: 1 })
      .toArray();
    return messages.map((row) => ({
      message: row._id,
      sender: row.sender,
      content: row.content,
      sentAt: row.sentAt,
    }));
  }

  async _conversationBetween({
    user,
    other,
  }: {
    user: User;
    other: User;
  }): Promise<{ conversation: Conversation; status: ConversationStatus }[]> {
    if (user === other) return [];
    const found = await this.#conversations.findOne({ pair: pairOf(user, other) });
    return found === null ? [] : [{ conversation: found._id, status: found.status }];
  }

  async _isParticipant({
    conversation,
    user,
  }: {
    conversation: Conversation;
    user: User;
  }): Promise<{ participant: boolean }> {
    const found = await this.#conversations.findOne({ _id: conversation });
    return { participant: found !== null && isParticipant(found, user) };
  }

  async _otherParticipant({
    conversation,
    user,
  }: {
    conversation: Conversation;
    user: User;
  }): Promise<{ other: User }[]> {
    const found = await this.#conversations.findOne({ _id: conversation });
    if (found === null || !isParticipant(found, user)) return [];
    return [{ other: otherOf(found, user) }];
  }

  /** Creates the indexes once. If creating them fails, the next action tries again. */
  #ready(): Promise<unknown> {
    this.#indexes ??= Promise.all([
      this.#conversations.createIndex({ pair: 1 }, { unique: true }),
      this.#conversations.createIndex({ firstUser: 1 }),
      this.#conversations.createIndex({ secondUser: 1 }),
      this.#messages.createIndex({ conversation: 1, sentAt: 1, _id: 1 }),
    ]).catch((error: unknown) => {
      this.#indexes = undefined;
      throw error;
    });
    return this.#indexes;
  }
}

/** One key for the two users, the same whichever user is first. */
function pairOf(a: User, b: User): string {
  return JSON.stringify(a < b ? [a, b] : [b, a]);
}

function isParticipant(row: ConversationDocument, user: User): boolean {
  return row.firstUser === user || row.secondUser === user;
}

function otherOf(row: ConversationDocument, user: User): User {
  return row.firstUser === user ? row.secondUser : row.firstUser;
}

/** 11000 is the code MongoDB gives a write that breaks a unique index. */
function isDuplicate(error: unknown): boolean {
  return error instanceof MongoServerError && error.code === 11000;
}

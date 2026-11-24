import { assemble } from "@mit-sdg/sync-engine/assembly";
import { httpPolicy } from "@mit-sdg/sync-engine-http/policy";
import type { Db } from "mongodb";
import { composition } from "./composition.ts";
import { applicationConceptSet } from "./concepts.ts";
import { ChattingConcept } from "./concepts/Chatting.ts";
import { db } from "./db.ts";

/**
 * Assembles the application. Chatting is stored in MongoDB: `database` defaults to the
 * project database in `src/db.ts`, and tests pass a fresh one. Every other concept is
 * still in memory and starts empty.
 */
export function assembleApplication({ database = db }: { database?: Db } = {}) {
  return assemble({
    conceptSet: applicationConceptSet,
    instances: {
      ...applicationConceptSet.implementations(),
      Chatting: new ChattingConcept(database),
    },
    composition,
  });
}

/** HTTP projection policy: caller-visible refusal codes and their public categories. */
export const appHttpPolicy = httpPolicy({
  // Endpoints are served under /api (e.g. /api/accounts/register), so they never collide
  // with the frontend's page paths such as /matches or /chats/<id>.
  basePath: "/api",
  // Every endpoint takes a few short strings; reject oversized bodies before parsing.
  limits: { requestBodyBytes: 16 * 1024 },
  // INVALID_SESSION_LIFETIME is deliberately unmapped: it signals server misconfiguration,
  // not a caller mistake, so it stays an internal error.
  publicErrors: {
    INVALID_USERNAME: "INVALID_REQUEST",
    WEAK_PASSWORD: "INVALID_REQUEST",
    USERNAME_TAKEN: "CONFLICT",
    INVALID_CREDENTIALS: "UNAUTHORIZED",
    UNKNOWN_SESSION: "UNAUTHORIZED",
    INTEREST_IN_SELF: "INVALID_REQUEST",
    INTEREST_ALREADY_MATCHED: "CONFLICT",
    INTEREST_ALREADY_DECIDED: "CONFLICT",
    NO_INCOMING_INTEREST: "CONFLICT",
    PASS_ON_SELF: "INVALID_REQUEST",
    PASS_ALREADY_MATCHED: "CONFLICT",
    PASS_AFTER_INTEREST: "CONFLICT",
    NOT_MATCHED: "NOT_FOUND",
    READ_TARGET_NOT_FOUND: "NOT_FOUND",
    READ_TARGET_DISMISSED: "CONFLICT",
    DISMISS_TARGET_NOT_FOUND: "NOT_FOUND",
    EMPTY_MESSAGE: "INVALID_REQUEST",
    // ProfileSetting
    PROFILE_ALREADY_EXISTS: "CONFLICT",
    INVALID_PROFILE: "INVALID_REQUEST",
    PITCH_PROFILE_NOT_FOUND: "NOT_FOUND",
    PITCH_NOT_FOUNDER: "FORBIDDEN",
    EMPTY_PITCH: "INVALID_REQUEST",
    UPDATE_PROFILE_NOT_FOUND: "NOT_FOUND",
    INVALID_PROFILE_UPDATE: "INVALID_REQUEST",
    UPDATE_WOULD_UNPUBLISH: "CONFLICT",
    PUBLISH_PROFILE_NOT_FOUND: "NOT_FOUND",
    PROFILE_INCOMPLETE: "CONFLICT",
    PROFILE_NOT_VISIBLE: "CONFLICT",
    NO_PROFILE: "NOT_FOUND",
    // Recommending
    INVALID_PREFERENCES: "INVALID_REQUEST",
    PREFERENCES_NEED_PROFILE: "NOT_FOUND",
    SELF_RECOMMENDATION: "INVALID_REQUEST",
    INVALID_RECOMMENDATION_DATA: "INVALID_REQUEST",
    NOT_IN_FEED: "NOT_FOUND",
    PASS_RECOMMENDATION_NOT_FOUND: "NOT_FOUND",
    INTEREST_RECOMMENDATION_NOT_FOUND: "NOT_FOUND",
    RECOMMENDATION_ALREADY_DECIDED: "CONFLICT",
    DEACTIVATE_RECOMMENDATION_NOT_FOUND: "NOT_FOUND",
    // Chatting (EMPTY_MESSAGE is shared with Notifying above)
    CONVERSATION_WITH_SELF: "INVALID_REQUEST",
    CONVERSATION_EXISTS: "CONFLICT",
    CONVERSATION_NOT_FOUND: "NOT_FOUND",
    CONVERSATION_CLOSED: "CONFLICT",
    CLOSE_TARGET_NOT_FOUND: "NOT_FOUND",
    CONVERSATION_ALREADY_CLOSED: "CONFLICT",
  },
});

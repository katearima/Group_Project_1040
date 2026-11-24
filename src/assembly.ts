import { assemble } from "@mit-sdg/sync-engine/assembly";
import { httpPolicy } from "@mit-sdg/sync-engine-http/policy";
import type { Db } from "mongodb";
import { composition } from "./composition.ts";
import { applicationConceptSet } from "./concepts.ts";
import { AuthenticatingMemoryConcept } from "./concepts/catalog/authenticating/authenticating.memory.ts";
import { ChattingConcept } from "./concepts/Chatting.ts";
import { MutualMatchingConcept } from "./concepts/MutualMatching.ts";
import { NotifyingConcept } from "./concepts/Notifying.ts";
import { ProfileSettingConcept } from "./concepts/ProfileSetting.ts";
import { RecommendingConcept } from "./concepts/Recommending.ts";
import { db } from "./db.ts";
import { openPersistence } from "./persistence.ts";

type SavedAs<C extends new (...args: never[]) => unknown> = NonNullable<
  NonNullable<ConstructorParameters<C>[0]>["persistence"]
>;
type Saved<C extends new (...args: never[]) => unknown> =
  SavedAs<C> extends { save(state: infer S): void } ? S : never;

/** The saved state of the concepts that survive a restart. Sessions are not kept: a restart signs everyone out. */
export interface AppStores {
  Authenticating?: SavedAs<typeof AuthenticatingMemoryConcept>;
  ProfileSetting?: SavedAs<typeof ProfileSettingConcept>;
  MutualMatching?: SavedAs<typeof MutualMatchingConcept>;
  Notifying?: SavedAs<typeof NotifyingConcept>;
  Recommending?: SavedAs<typeof RecommendingConcept>;
}

/** Loads each concept's saved state from MongoDB. Call `flush` before the process exits. */
export async function openStores(database: Db = db): Promise<{ stores: AppStores; flush: () => Promise<void> }> {
  const opened = {
    Authenticating: await openPersistence<Saved<typeof AuthenticatingMemoryConcept>>(database, "Authenticating"),
    ProfileSetting: await openPersistence<Saved<typeof ProfileSettingConcept>>(database, "ProfileSetting"),
    MutualMatching: await openPersistence<Saved<typeof MutualMatchingConcept>>(database, "MutualMatching"),
    Notifying: await openPersistence<Saved<typeof NotifyingConcept>>(database, "Notifying"),
    Recommending: await openPersistence<Saved<typeof RecommendingConcept>>(database, "Recommending"),
  } satisfies Required<AppStores>;
  return {
    stores: opened,
    flush: async () => {
      await Promise.all(Object.values(opened).map((each) => each.flush()));
    },
  };
}

/**
 * Assembles the application. Chatting is stored in MongoDB: `database` defaults to the
 * project database in `src/db.ts`, and tests pass a fresh one. The other stateful concepts
 * keep their state in memory and save a snapshot through `stores` (see `openStores`);
 * without `stores` they start empty and forget everything on restart. Sessions are never saved.
 */
export function assembleApplication({ database = db, stores = {} }: { database?: Db; stores?: AppStores } = {}) {
  return assemble({
    conceptSet: applicationConceptSet,
    instances: {
      ...applicationConceptSet.implementations(),
      Chatting: new ChattingConcept(database),
      ...(stores.Authenticating && {
        Authenticating: new AuthenticatingMemoryConcept({ persistence: stores.Authenticating }),
      }),
      ...(stores.ProfileSetting && {
        ProfileSetting: new ProfileSettingConcept({ persistence: stores.ProfileSetting }),
      }),
      ...(stores.MutualMatching && {
        MutualMatching: new MutualMatchingConcept({ persistence: stores.MutualMatching }),
      }),
      ...(stores.Notifying && { Notifying: new NotifyingConcept({ persistence: stores.Notifying }) }),
      ...(stores.Recommending && {
        Recommending: new RecommendingConcept({ persistence: stores.Recommending }),
      }),
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

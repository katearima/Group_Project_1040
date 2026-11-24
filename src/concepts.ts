import { conceptSet, registerConcept } from "@mit-sdg/sync-engine/assembly";
import authenticatingSpec from "@design/concepts/Authenticating.md" with { type: "text" };
import chattingSpec from "@design/concepts/Chatting.md" with { type: "text" };
import mutualMatchingSpec from "@design/concepts/MutualMatching.md" with { type: "text" };
import notifyingSpec from "@design/concepts/Notifying.md" with { type: "text" };
import profileSettingSpec from "@design/concepts/ProfileSetting.md" with { type: "text" };
import recommendingSpec from "@design/concepts/Recommending.md" with { type: "text" };
import sessioningSpec from "@design/concepts/Sessioning.md" with { type: "text" };
import { AuthenticatingMemoryConcept } from "./concepts/catalog/authenticating/authenticating.memory.ts";
import {
  InvalidCredentials,
  InvalidUsername,
  UsernameTaken,
  WeakPassword,
} from "./concepts/catalog/authenticating/authenticating.shared.ts";
import { SessioningMemoryConcept } from "./concepts/catalog/sessioning/sessioning.memory.ts";
import {
  InvalidSessionLifetime,
  UnknownSession,
} from "./concepts/catalog/sessioning/sessioning.shared.ts";
import {
  ChattingConcept,
  CloseTargetNotFound,
  ConversationAlreadyClosed,
  ConversationClosed,
  ConversationExists,
  ConversationNotFound,
  ConversationWithSelf,
  EmptyChatMessage,
} from "./concepts/Chatting.ts";
import {
  InterestAlreadyDecided,
  InterestAlreadyMatched,
  InterestInSelf,
  MutualMatchingConcept,
  NotMatched,
  PassAfterInterest,
  PassAlreadyMatched,
  PassOnSelf,
} from "./concepts/MutualMatching.ts";
import {
  DismissTargetNotFound,
  EmptyMessage,
  NotifyingConcept,
  ReadTargetDismissed,
  ReadTargetNotFound,
} from "./concepts/Notifying.ts";
import {
  EmptyPitch,
  InvalidProfile,
  InvalidProfileUpdate,
  PitchNotFounder,
  PitchProfileNotFound,
  ProfileAlreadyExists,
  ProfileIncomplete,
  ProfileNotVisible,
  ProfileSettingConcept,
  PublishProfileNotFound,
  UpdateProfileNotFound,
  UpdateWouldUnpublish,
} from "./concepts/ProfileSetting.ts";
import {
  DeactivateRecommendationNotFound,
  InterestRecommendationNotFound,
  InvalidPreferences,
  InvalidRecommendationData,
  NotInFeed,
  PassRecommendationNotFound,
  RecommendationAlreadyDecided,
  RecommendingConcept,
  SelfRecommendation,
} from "./concepts/Recommending.ts";

const authenticating = registerConcept({
  class: AuthenticatingMemoryConcept,
  spec: authenticatingSpec,
  refusals: {
    INVALID_USERNAME: InvalidUsername,
    WEAK_PASSWORD: WeakPassword,
    USERNAME_TAKEN: UsernameTaken,
    INVALID_CREDENTIALS: InvalidCredentials,
  },
});

const sessioning = registerConcept({
  class: SessioningMemoryConcept,
  spec: sessioningSpec,
  refusals: {
    INVALID_SESSION_LIFETIME: InvalidSessionLifetime,
    UNKNOWN_SESSION: UnknownSession,
  },
});

const mutualMatching = registerConcept({
  class: MutualMatchingConcept,
  spec: mutualMatchingSpec,
  refusals: {
    INTEREST_IN_SELF: InterestInSelf,
    INTEREST_ALREADY_MATCHED: InterestAlreadyMatched,
    INTEREST_ALREADY_DECIDED: InterestAlreadyDecided,
    PASS_ON_SELF: PassOnSelf,
    PASS_ALREADY_MATCHED: PassAlreadyMatched,
    PASS_AFTER_INTEREST: PassAfterInterest,
    NOT_MATCHED: NotMatched,
  },
});

const notifying = registerConcept({
  class: NotifyingConcept,
  spec: notifyingSpec,
  refusals: {
    EMPTY_MESSAGE: EmptyMessage,
    READ_TARGET_NOT_FOUND: ReadTargetNotFound,
    READ_TARGET_DISMISSED: ReadTargetDismissed,
    DISMISS_TARGET_NOT_FOUND: DismissTargetNotFound,
  },
});

const profileSetting = registerConcept({
  class: ProfileSettingConcept,
  spec: profileSettingSpec,
  refusals: {
    PROFILE_ALREADY_EXISTS: ProfileAlreadyExists,
    INVALID_PROFILE: InvalidProfile,
    PITCH_PROFILE_NOT_FOUND: PitchProfileNotFound,
    PITCH_NOT_FOUNDER: PitchNotFounder,
    EMPTY_PITCH: EmptyPitch,
    UPDATE_PROFILE_NOT_FOUND: UpdateProfileNotFound,
    INVALID_PROFILE_UPDATE: InvalidProfileUpdate,
    UPDATE_WOULD_UNPUBLISH: UpdateWouldUnpublish,
    PUBLISH_PROFILE_NOT_FOUND: PublishProfileNotFound,
    PROFILE_INCOMPLETE: ProfileIncomplete,
    PROFILE_NOT_VISIBLE: ProfileNotVisible,
  },
});

const recommending = registerConcept({
  class: RecommendingConcept,
  spec: recommendingSpec,
  refusals: {
    INVALID_PREFERENCES: InvalidPreferences,
    SELF_RECOMMENDATION: SelfRecommendation,
    INVALID_RECOMMENDATION_DATA: InvalidRecommendationData,
    NOT_IN_FEED: NotInFeed,
    PASS_RECOMMENDATION_NOT_FOUND: PassRecommendationNotFound,
    INTEREST_RECOMMENDATION_NOT_FOUND: InterestRecommendationNotFound,
    RECOMMENDATION_ALREADY_DECIDED: RecommendationAlreadyDecided,
    DEACTIVATE_RECOMMENDATION_NOT_FOUND: DeactivateRecommendationNotFound,
  },
});

const chatting = registerConcept({
  class: ChattingConcept,
  spec: chattingSpec,
  refusals: {
    CONVERSATION_WITH_SELF: ConversationWithSelf,
    CONVERSATION_EXISTS: ConversationExists,
    CONVERSATION_NOT_FOUND: ConversationNotFound,
    CONVERSATION_CLOSED: ConversationClosed,
    EMPTY_MESSAGE: EmptyChatMessage,
    CLOSE_TARGET_NOT_FOUND: CloseTargetNotFound,
    CONVERSATION_ALREADY_CLOSED: ConversationAlreadyClosed,
  },
});

/** Computations declared by the approved design documents. */
const computations = {
  // Registered so the authored `currentInstant` declaration resolves. Compositions bind the
  // flow's instant with the framework's `now(...)`, which is read once per flow; no flow
  // invokes this function.
  currentInstant: (_input: Record<string, never>): Date => new Date(),
  sessionLifetime: (_input: Record<string, never>): number => 1_800_000,
  profileLink: ({ user }: { user: string }): string => `/profile/${user}`,
  matchesLink: (_input: { user: string }): string => "/matches",
  conversationLink: ({ conversation }: { conversation: string }): string =>
    `/chats/${conversation}`,
  numberSupplied: ({ value }: { value?: number | null }): boolean =>
    typeof value === "number",
};

export const applicationConceptSet = conceptSet(
  {
    Authenticating: authenticating,
    Sessioning: sessioning,
    MutualMatching: mutualMatching,
    Notifying: notifying,
    ProfileSetting: profileSetting,
    Recommending: recommending,
    Chatting: chatting,
  },
  computations,
);
export const { concepts } = applicationConceptSet;

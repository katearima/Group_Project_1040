import { conceptSet, registerConcept } from "@mit-sdg/sync-engine/assembly";
import authenticatingSpec from "@design/concepts/Authenticating.md" with { type: "text" };
import mutualMatchingSpec from "@design/concepts/MutualMatching.md" with { type: "text" };
import notifyingSpec from "@design/concepts/Notifying.md" with { type: "text" };
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

/** Computations declared by the approved design documents. */
const computations = {
  // Registered so the authored `currentInstant` declaration resolves. Compositions bind the
  // flow's instant with the framework's `now(...)`, which is read once per flow; no flow
  // invokes this function.
  currentInstant: (_input: Record<string, never>): Date => new Date(),
  sessionLifetime: (_input: Record<string, never>): number => 1_800_000,
  profileLink: ({ user }: { user: string }): string => `/profile/${user}`,
  matchesLink: (_input: { user: string }): string => "/matches",
};

export const applicationConceptSet = conceptSet(
  {
    Authenticating: authenticating,
    Sessioning: sessioning,
    MutualMatching: mutualMatching,
    Notifying: notifying,
  },
  computations,
);
export const { concepts } = applicationConceptSet;

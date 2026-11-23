import { assemble } from "@mit-sdg/sync-engine/assembly";
import { httpPolicy } from "@mit-sdg/sync-engine-http/policy";
import { composition } from "./composition.ts";
import { applicationConceptSet } from "./concepts.ts";

export function assembleApplication() {
  return assemble({
    conceptSet: applicationConceptSet,
    instances: applicationConceptSet.implementations(),
    composition,
  });
}

/** HTTP projection policy: caller-visible refusal codes and their public categories. */
export const appHttpPolicy = httpPolicy({
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
  },
});

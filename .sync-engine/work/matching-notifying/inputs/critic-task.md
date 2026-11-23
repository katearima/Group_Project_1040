# Contract review: MutualMatching, Notifying, accounts, matching composition

Review the changed candidate contracts as one full semantic design review against the brief
and the team's accepted prose concept design (supplied as context excerpt; it is the
product authority for MutualMatching and Notifying). Authenticating and Sessioning are
unchanged catalog contracts and are supplied for reference only.

Assess, obligation by obligation:
- every brief Requirement and Done When outcome is realized by a concept clause or a
  composition clause, with no behavior the brief excludes;
- MutualMatching and Notifying match the prose design's state, actions, preconditions,
  and query semantics (including `_getInterestedInYou` exclusions and the match invariant);
- refusal codes, repetition, lifecycle, query cardinality and ordering are fully specified;
- every endpoint resolves the session user; no caller-chosen identity; notification
  ownership refusals do not reveal another user's notifications;
- Reaction 6 and Reaction 8 semantics, acknowledgement order and failure semantics are
  stated and acceptable; deferred clauses are documented and unlinked;
- endpoint, reaction, computation and instance identities are consistent and complete.

Return stable finding IDs (F1, F2, ...) for blocker or material findings only.

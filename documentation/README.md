## Problem Framing

| #   | Section                                                                     |
| --- | --------------------------------------------------------------------------- |
| 1   | [Domain](problem-framing/1-domain.md)                                       |
| 2   | [Bad situations](problem-framing/2-bad-situations.md)                       |
| 3   | [Evidence](problem-framing/3-evidence.md)                                   |
| 4   | [Workarounds and comparables](problem-framing/4-workarounds-comparables.md) |
| 5   | [Solution sketch](problem-framing/5-solution-sketch.md)                     |
| 6   | [Ethical analysis (VSD)](problem-framing/6-ethical-analysis.md)             |

## Concepts

| #   | Concept                                      | Purpose                                                                                   |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | [Authenticating](concepts/Authenticating.md) | Manages secure account credentials, password hashing, and user registration               |
| 2   | [Sessioning](concepts/Sessioning.md)         | Issues and revokes time-limited session tokens attached to subjects                       |
| 3   | [ProfileSetting](concepts/ProfileSetting.md) | Manages founder and builder profile attributes, pitches, and visibility                   |
| 4   | [MutualMatching](concepts/MutualMatching.md) | Manages matching, passing (saving a match for later), and unmatching                      |
| 5   | [Recommending](concepts/Recommending.md)     | Creates, ranks, and manages algorithmically-generated recommendations (potential matches) |
| 6   | [Chatting](concepts/Chatting.md)             | Facilitates and stores conversations between matched users                                |
| 7   | [Notifying](concepts/Notifying.md)           | Issues and manages user notifications                                                     |

## Compositions

| #   | Composition                                        | Associated Concepts                                              | Primary Interactions & Reactions                                                                        |
| --- | -------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | [Accounts](compositions/Accounts.md)               | `Authenticating`, `Sessioning`                                   | Registration, sign-in, and sign-out endpoints; binds session lifetime                                   |
| 2   | [Profiles](compositions/Profiles.md)               | `Sessioning`, `ProfileSetting`, `Recommending`                   | Profile CRUD, pitches, and publishing; triggers candidate feed refreshes (Reactions 1 & 2)              |
| 3   | [Matching](compositions/Matching.md)               | `Sessioning`, `MutualMatching`, `Notifying`                      | Showing interest, passing, and unmatching; delivers match and interest notifications                    |
| 4   | [Recommendations](compositions/Recommendations.md) | `Sessioning`, `Recommending`, `ProfileSetting`, `MutualMatching` | Sets scoring preferences, serves ranked feed, cleans up feed on unmatch (Reaction 10)                   |
| 5   | [Chatting](compositions/Chatting.md)               | `Sessioning`, `Chatting`, `MutualMatching`, `Notifying`          | Opens chat on match (Reaction 7), closes chat on unmatch (Reaction 8), notifies on message (Reaction 9) |
| 6   | [Notifications](compositions/Notifications.md)     | `Sessioning`, `Notifying`                                        | Lists unread/all notifications, marks read, and dismisses notifications                                 |

### Scrum Reports

| Sprint # | Report                                           |
| -------- | ------------------------------------------------ |
| 1        | [Sprint 1 Development Plan](development-plan.md) |
| 2        | [Sprint 2 Summary](sprint-2-summary.md)          |

### Supporting Contracts

- [Application Types & Shared Computations](types.md)

## Verdict
Revise

The contract set covers everything the brief scopes. I found no blockers: authority is present, authorization cannot be bypassed, no effect has two owners, and no required work is lost without a way to recover it. Four material findings (F1 to F4) need small contract repairs before implementation. F5 and F6 are low severity. I edited nothing.

## Assessments

| Obligation | Trigger | Closing reaction | Visible success | False interval | Ack order | Retry identity / owner accepts | Recovery | Duplicate risk |
|---|---|---|---|---|---|---|---|---|
| R1 publish refresh | `/profiles/publish` → `publishProfile` succeeds | Profiles.Requests.Publish (endpoint-owned, no internal reaction) | profile visible; both directions refreshed for every visible opposite-role user | after a refresh fault: profile visible, some pairs missing; the endpoint reports the fault | answers after all refreshes | (viewer, candidate) pair; Recommending upserts on the unique pair, and publishing again succeeds | retry publish, or any later change by either user of the pair | none (upsert keeps status) |
| R2a update refresh | `/profiles/update` → `updateProfile` succeeds | Profiles.Requests.Update | fields replaced; refreshed only while visible | as R1 | after refreshes | pair upsert; the same values are written again | as R1 | none |
| R2b pitch refresh | `/profiles/set-pitch` → `setStartupPitch` succeeds | Profiles.Requests.SetPitch | pitch set; refresh runs while visible | as R1 | after refreshes | pair upsert; the same pitch succeeds again (the contract's retry sentence does not say this, see F6) | as R1 | none |
| R2c preferences refresh | `/recommendations/set-preferences` → `setPreferences` succeeds | Recommendations.Requests.SetPreferences (owner of the refresh only implied, see F1) | preferences replaced; both directions refreshed while visible | as R1 | after refreshes | pair upsert; the same request succeeds again | as R1 | none |
| Preferences guard | set-preferences with no profile | same endpoint | `PREFERENCES_NEED_PROFILE`, no change | none (profiles cannot be deleted, so the guard cannot go stale) | before any effect | n/a | n/a | none |
| Create profile | `/profiles/create` | Profiles.Requests.Create | hidden profile, no pitch; returns its identity | none | after the single atomic action | a repeat is refused `PROFILE_ALREADY_EXISTS` | n/a | none (owner action is atomic) |
| Session authority | every endpoint | Sessioning `current` first | `UNKNOWN_SESSION`, no change | none | before any read or change | n/a | n/a | n/a |
| Reads (mine, preferences, feed) | read endpoints | the respective endpoint | own data only; feed is eligible AVAILABLE, highest score first, ties oldest first; empty list or defaults; `NO_PROFILE` | none | n/a | n/a | n/a | n/a |

Other checks I ran:

- **Concurrent first publishes cannot miss a pair.** Each publish makes its own profile visible before it reads `_visibleCandidates`, so at least one of the two sees the other, and that one refreshes both directions.
- **Same-role users and self-recommendation are excluded.** `_visibleCandidates` returns only the opposite role, which also leaves out the session user.
- **ProfileSetting's validity matches Recommending's validity** (nonempty entries, inclusive coordinate ranges, nonnegative availability). So the claim that refreshes are not expected to refuse holds.
- **Refusal branches are exclusive and complete** in `createProfile`, `setStartupPitch`, `updateProfile`, `publishProfile`, `hideProfile` and every Recommending action. A refresh keeps an existing status.
- **The score rules match the five factors in concept-design §2.** One gap is the university comparison (F5).
- **The deferred items are documented honestly** in Profiles, Recommendations and Matching. That includes "showing interest or passing does not remove someone from the feed" and "hideProfile has no endpoint".
- **No computation reads concept state.**

Inventory:

- **Instances** (`design/types.md`): Authenticating, Sessioning, MutualMatching, Notifying, plus the new ProfileSetting and Recommending, each with `User is Authenticating.Account`.
- **Endpoints:** 8, each with one `reaction:` link and one matching fence entry; module, group and path agree.

  | Endpoint | Path |
  |---|---|
  | Profiles.Requests.Create | `/profiles/create` |
  | Profiles.Requests.Update | `/profiles/update` |
  | Profiles.Requests.SetPitch | `/profiles/set-pitch` |
  | Profiles.Requests.Publish | `/profiles/publish` |
  | Profiles.Reads.Mine | `/profiles/mine` |
  | Recommendations.Requests.SetPreferences | `/recommendations/set-preferences` |
  | Recommendations.Reads.Preferences | `/recommendations/preferences` |
  | Recommendations.Reads.Feed | `/recommendations/feed` |

- **Internal reactions, views, formers:** none.
- **Computations:** `currentInstant` (`design/types.md`, linked from both compositions) and `numberSupplied` (`design/compositions/Recommendations.md`, linked).

## Findings

**F1 (material), `design/compositions/Recommendations.md`: the order and owner of the preferences refresh are unclear.**
- The reaction reads `_recommendationData` before `setPreferences`, for the profile guard. Reaction 2 then points to "the refresh described in Profiles", which re-reads "after the ProfileSetting action succeeds". It never says whether the visibility check reuses the earlier guard read or reads again after the save. It also never says that the endpoint reaction itself owns the refresh.
- If the earlier read is reused, a race loses work. A publish that runs between the guard read and the save can score with the old preferences. The preferences flow then sees the profile as hidden and skips its refresh, leaving stale scores.
- Smallest repair: state that after `setPreferences` succeeds, the same endpoint reaction (no separate internal reaction) reads `_recommendationData` again and, when the profile is visible, runs the Profiles refresh.

**F2 (material), `design/compositions/Recommendations.md`: `numberSupplied` cannot represent an omitted value.**
- Its signature is `numberSupplied(value: Number)`, but it has to accept an omitted or null field, which a `Number` input cannot hold.
- There are two independent optional numbers, so there are four ways to call `setPreferences`. The contract does not say how one computation drives both distance and availability.
- It is also unstated whether skills, interests and universities are required in the request (empty allowed) or default to empty.
- Smallest repair:
  - make the input optional (for example `value?: Number`);
  - state that it is applied once each to distance and availability, and that each number is passed only when its flag is true (or declare one computation per field);
  - state that the three sets are required and may be empty.

**F3 (material), `design/concepts/ProfileSetting.md`, `design/concepts/Recommending.md` and `design/types.md`: `Entries` is not realizable as written.**
- ProfileSetting's `Entries` is "trimmed text entries" while its state is `set of String`. Nothing says who trims, or whether a whitespace-only entry is refused or silently dropped. Dropping it would break the brief's rule that every entry is nonempty and that whitespace-only text counts as empty.
- The composition passes ProfileSetting `Entries` (from `_recommendationData` and `_visibleCandidates`) into Recommending's separately declared `opaque Entries`. No shared declaration or instance binding relates the two types.
- Smallest repair:
  - define `Entries` once, consistently, as a finite collection of text entries as supplied, either as a shared concrete type in `design/types.md` or with identical definitions in both concepts;
  - state that ProfileSetting refuses any entry that is empty after trimming, and say what it stores;
  - state that the compositions pass request arrays and query values through unchanged.

**F4 (material), `design/compositions/Profiles.md` (and Recommendations by reference): concurrent changes can leave a stale score.**
- The prose (§6) says "the app finishes the resulting reactions before handling another request involving the same users". The brief says refreshes use "the latest profile data".
- Interleaved flows break both. User A's publish reads B's old data, B's update then refreshes the pair, and A's refresh writes last. The A→B score is now stale until the next refresh of that pair.
- The contract neither serializes these flows nor admits the staleness.
- Smallest repair: either require that profile and preference changes, together with their refresh, are serialized per user, or document stale-until-next-refresh as an accepted deviation from the prose and record it under Active decisions in `.sync-engine/work/recommending/brief.md`.

**F5 (low), `design/concepts/Recommending.md`: the university comparison is not normalized.**
- The normalization rule covers `Entries`, but the candidate's university is a `String`. So it is unclear whether " mit " matches "MIT". The brief requires trimmed, case-insensitive comparison.
- Smallest repair: in the university factor rule, compare the candidate's university after the same trimming and case-folding.

**F6 (low), `design/compositions/Profiles.md`: the retry sentence leaves out set pitch.**
- It names only publish and updates as safe to retry. Setting the same pitch again also succeeds and refreshes again.
- Smallest repair: add set pitch (and, by reference, set preferences) to that sentence.

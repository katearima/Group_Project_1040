## Verdict
Approve

## Findings

- **B1: resolved.** I checked the repaired `design/compositions/Profiles.md` and `design/compositions/Recommendations.md` as supplied in the prompt; I edited nothing.
  - **Who owns the refresh:** it moved out of the endpoint reactions into four linked internal reactions, one per trigger:
    - `Profiles.Refreshing.RefreshOnPublish`
    - `Profiles.Refreshing.RefreshOnUpdate`
    - `Profiles.Refreshing.RefreshOnPitch`
    - `Recommendations.Refreshing.RefreshOnPreferences`
  - **No effect is owned twice:** the endpoint sections now only say the refresh runs and no longer perform it. The three Profiles reactions fire only on their ProfileSetting action and the preferences reaction only on Recommending `setPreferences`. A refused action triggers nothing, and no reaction fires on `refreshRecommendation`, so a refresh cannot set off another.
  - **Refresh behavior is unchanged:**
    - each reaction re-reads `_recommendationData` after its trigger;
    - it refreshes only when the profile is visible, both directions for every opposite-role candidate;
    - an existing status is kept;
    - the preferences reaction still re-reads instead of reusing the guard read, so the earlier F1 race fix stands.
  - **Acknowledgement order is unchanged:** each endpoint answers only after its flow settles, which now explicitly includes the case where there is nothing to refresh. That case was the hang the worker reported. Success on set preferences is stated as separate from `PREFERENCES_NEED_PROFILE`.
  - **Failure and concurrency behavior are unchanged:**
    - a refresh fault is reported and earlier effects remain;
    - the retry and recovery wording is the same;
    - the accepted stale-score deviation from F4 is carried over as written.
  - **Wording note (not blocking):** the Profiles refresh paragraph says "that user" in one sentence and "the session user" in the next. Inside an internal reaction this means the triggering action's `user`. That is always the session user, because only the endpoints call these actions.
  - **Not verified:** that a fault inside an internal reaction actually reaches the endpoint's answer depends on framework behavior I was not allowed to inspect. The worker reports the shape works locally, with four reactions still missing design coverage.

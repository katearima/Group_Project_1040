# Contract repair for implementation blocker B1

The application worker reports blocker B1 (supplied as context): an endpoint-owned refresh
fan-out cannot answer when the candidate read is empty. Repair Profiles.md and
Recommendations.md only:

- The refresh for Reactions 1 and 2 is owned by four internal reactions, each linked:
  `reaction:Profiles.Refreshing.RefreshOnPublish`, `reaction:Profiles.Refreshing.RefreshOnUpdate`,
  `reaction:Profiles.Refreshing.RefreshOnPitch`, and
  `reaction:Recommendations.Refreshing.RefreshOnPreferences`, triggered by the successful
  ProfileSetting `publishProfile`, `updateProfile`, `setStartupPitch`, and Recommending
  `setPreferences` actions respectively.
- Each reaction reads `_recommendationData` fresh after its trigger and refreshes only while
  visible; otherwise the refresh behavior, ordering, best-effort failure, and concurrency
  text stay as approved.
- Each triggering endpoint answers only after the flow settles, i.e. after every refresh
  the change caused has completed; the set-preferences answer stays disjoint from
  `PREFERENCES_NEED_PROFILE`.

Change nothing else. Run check-design on all design files.

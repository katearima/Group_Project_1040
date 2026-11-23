## Status

Complete

Authored ProfileSetting and Recommending concept contracts, the Profiles and Recommendations
compositions (Reaction 1 on publish; Reaction 2 on update, set pitch, and set preferences,
owned by the endpoint reactions and completed before the answer), and the two new instances.

Notes for review and implementation:

- Signature types must be one word, so skill, interest, and university collections are an
  `opaque Entries` type in each concept (a finite set of text entries); State keeps
  `set of String`.
- RecommendationData is flattened into viewer*/candidate* inputs of `refreshRecommendation`.
- Optional preference numbers use the `numberSupplied` computation (omitted or null means no
  preference), per the rule that optional-input branching needs a declared computation.
- Composition-level refusals: `NO_PROFILE` (read own profile), `PREFERENCES_NEED_PROFILE`
  (set preferences without a profile).

## Changed

- design/concepts/ProfileSetting.md (new)
- design/concepts/Recommending.md (new)
- design/compositions/Profiles.md (new)
- design/compositions/Recommendations.md (new)
- design/types.md

## Questions

None.

## Checks

- `bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md`: passed for 12 files.

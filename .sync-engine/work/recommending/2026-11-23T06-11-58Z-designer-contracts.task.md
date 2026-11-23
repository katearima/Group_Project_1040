# Contract repair for critic findings F1–F6

Repair exactly these findings from the critic record; change nothing else.

- F1 (Recommendations.md): after `setPreferences` succeeds, the same endpoint reaction (no
  internal reaction) reads `_recommendationData` again and runs the Profiles refresh only
  when that fresh read shows the profile visible.
- F2 (Recommendations.md): make `numberSupplied` take an optional input; state it is applied
  once each to distance and availability and each number is passed to `setPreferences` only
  when its flag is true; skills, interests and universities are required lists that may be
  empty.
- F3 (ProfileSetting.md, Recommending.md, Profiles.md): define `Entries` identically in both
  concepts as a finite list of text entries as supplied; ProfileSetting refuses an entry
  that is empty after trimming and stores entries as supplied; compositions pass request
  lists and query values through unchanged.
- F4 (Profiles.md): document stale-until-next-refresh under concurrent flows as an accepted
  deviation (brief Active decisions already records it).
- F5 (Recommending.md): university factor compares the candidate's university after the same
  trimming and case-folding.
- F6 (Profiles.md): retry sentence includes set pitch and, by reference, set preferences.

Run check-design on all design files.

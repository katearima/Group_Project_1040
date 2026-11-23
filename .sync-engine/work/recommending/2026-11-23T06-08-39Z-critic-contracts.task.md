# Contract review: ProfileSetting, Recommending, Profiles, Recommendations

Review the new and changed contracts against the brief and the team's prose design
(context excerpt). Focus on: fidelity to the prose (validation, publication rules, the
five-factor score, status preservation on refresh); refusal completeness and branch
exclusivity; authorization (session user only); ordering of the refresh fan-out relative to
the answer; partial-failure and retry behavior of the best-effort refresh; whether
Reactions 1 and 2 are fully covered for publish, update, set pitch, and set preferences;
realizability of the optional preference numbers and opaque `Entries` collections; and
whether deferred items are documented honestly.

Return a Verdict of Approve, Revise, or Blocked with numbered findings (F1, F2, ...), each
naming the file, the problem, and the smallest repair.

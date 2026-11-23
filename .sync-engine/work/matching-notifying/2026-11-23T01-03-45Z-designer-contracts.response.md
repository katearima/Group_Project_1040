## Status
Complete

I made both repairs, F1 and F2, and changed nothing else. The design check still passes on all eight files.

## Changed
- /Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Matching.md
  - F1: the show-interest section now says the Reaction 6/8 notifications are best-effort for this in-memory change, by explicit product decision. The existing fault and false-interval wording is kept. A new line says recovery of a lost notification waits until persistence lands, and that this change adds no recovery mechanism.
  - F2: the opening paragraph now says a request with no session, or with an ended, expired or invented one, is refused `UNKNOWN_SESSION` with no state change. The missing case has the same code and meaning as an inactive session.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Notifications.md
  - F2: the opening paragraph uses the same `UNKNOWN_SESSION` wording for the missing-session case.
- /Users/katearima/Documents/6.104/Group_Project_1040/design/compositions/Accounts.md
  - F2: the sign-out section now uses the same wording. It already refused this case with `UNKNOWN_SESSION`, so only the wording changed.

## Questions
None.

## Checks
`bunx --no-install sync-engine check-design design/concepts/*.md design/types.md design/compositions/*.md` → "Design form check passed for 8 files."

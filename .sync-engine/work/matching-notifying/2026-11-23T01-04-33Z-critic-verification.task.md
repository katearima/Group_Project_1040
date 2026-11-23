# Verify repairs for findings F1 and F2

Verify only findings F1 and F2 from your contract review against the revised composition
files. F1 was resolved by an explicit user product decision now recorded under Active
decisions in the brief (notifications best-effort in this change); check that the
contracts state it consistently. F2: check that a missing session is refused
`UNKNOWN_SESSION` consistently in all three composition files. Report each as resolved or
unresolved, and any direct regression. Do not discover new findings.

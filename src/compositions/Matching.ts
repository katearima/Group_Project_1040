import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { compute, each, former, is, no, now, where } from "@mit-sdg/sync-engine/language";
import { applicationConceptSet, concepts } from "../concepts.ts";

const { MutualMatching, Notifying, Sessioning } = concepts;
const { matchesLink, profileLink } = applicationConceptSet.computations;

const MATCH_MESSAGE = "It's a match!";
const INTEREST_MESSAGE = "Someone is interested in you!";

const ShowInterest = endpoint(
  "/matching/show-interest",
  ({ session, other, user, time, matched, userLink, otherLink, profile }) =>
    receive({ session, other })
      .then(
        where(now(time)).then(
          Sessioning.current({ session, now: time }).responds({ subject: user }),
        ),
      )
      .then(MutualMatching.showInterest({ from: user, to: other }).responds({ matched }))
      // Reaction 7 opens the conversation inside this flow; answer after it has run.
      .afterFlowSettles()
      .then(
        // Reaction 8, first notification: the session user learns of the match.
        where(is.among(matched, [true]), compute(matchesLink, { user }, userLink))
          .then(
            Notifying.notify({
              recipient: user,
              message: MATCH_MESSAGE,
              link: userLink,
              createdAt: time,
            }).responds({}),
          )
          .named("match-notifies-session-user"),
        // Reaction 6: interest without a match notifies the other person unless they passed.
        where(
          is.among(matched, [false]),
          no(MutualMatching._decision({ from: other, to: user }).is({ status: "PASSED" })),
          compute(profileLink, { user }, profile),
        )
          .then(
            Notifying.notify({
              recipient: other,
              message: INTEREST_MESSAGE,
              link: profile,
              createdAt: time,
            }).responds({}),
          )
          .then(respond({ matched }))
          .named("interest-notifies-other"),
        where(
          is.among(matched, [false]),
          MutualMatching._decision({ from: other, to: user }).is({ status: "PASSED" }),
        )
          .then(respond({ matched }))
          .named("interest-after-pass"),
      )
      // Reaction 8, second notification: the other person learns of the match.
      .then(
        where(
          is.among(matched, [true]),
          compute(matchesLink, { user: other }, otherLink),
        ).then(
          Notifying.notify({
            recipient: other,
            message: MATCH_MESSAGE,
            link: otherLink,
            createdAt: time,
          }).responds({}),
        ),
      )
      .then(respond({ matched })),
  { input: { required: ["other"], defaults: { session: "" } } },
);

const Pass = endpoint(
  "/matching/pass",
  ({ session, other, user, time }) =>
    receive({ session, other })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        where(MutualMatching._decision({ from: other, to: user }).is({ status: "INTERESTED" }))
          .then(MutualMatching.pass({ from: user, to: other }).responds({}))
          .then(respond({ passed: true }))
          .named("incoming-interest"),
        where(no(MutualMatching._decision({ from: other, to: user }).is({ status: "INTERESTED" })))
          .then(respond({ error: "NO_INCOMING_INTEREST" }))
          .named("no-incoming-interest"),
      ),
  { input: { required: ["other"], defaults: { session: "" } } },
);

const Unmatch = endpoint(
  "/matching/unmatch",
  ({ session, other, user, time }) =>
    receive({ session, other })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(MutualMatching.unmatch({ user, other }).responds({}))
      // Reaction 10 closes the conversation inside this flow; answer after it has run.
      .afterFlowSettles()
      .then(respond({ unmatched: true })),
  { input: { required: ["other"], defaults: { session: "" } } },
);

const InterestedInYouRows = former("the users interested in (user)", ({ user }, { from }) =>
  each(MutualMatching._getInterestedInYou({ user }).is({ from })).form({ user: from }),
);

const MatchRows = former("the matches of (user)", ({ user }, { other }) =>
  each(MutualMatching._getMatches({ user }).is({ other })).form({ user: other }),
);

const InterestedInYou = endpoint(
  "/matching/interested-in-you",
  ({ session, user, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        respond({ interested: InterestedInYouRows({ user }) }),
      ),
  { input: { defaults: { session: "" } } },
);

const Matches = endpoint(
  "/matching/matches",
  ({ session, user, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        respond({ matches: MatchRows({ user }) }),
      ),
  { input: { defaults: { session: "" } } },
);

export const composition = {
  Requests: { ShowInterest, Pass, Unmatch },
  Reads: { InterestedInYou, Matches },
};

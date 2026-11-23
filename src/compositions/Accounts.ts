import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { compute, now, where } from "@mit-sdg/sync-engine/language";
import { applicationConceptSet, concepts } from "../concepts.ts";

const { Authenticating, Sessioning } = concepts;
const { sessionLifetime } = applicationConceptSet.computations;

const Register = endpoint(
  "/accounts/register",
  ({ username, password, account, session, expiresAt, time, lifetime }) =>
    receive({ username, password })
      .then(Authenticating.register({ username, password }).responds({ account }))
      .then(
        where(now(time), compute(sessionLifetime, {}, lifetime)).then(
          Sessioning.start({ subject: account, lifetime, now: time }).responds({
            session,
            expiresAt,
          }),
        ),
      )
      .then(respond({ account, session, expiresAt })),
  { input: { required: ["username", "password"] } },
);

const SignIn = endpoint(
  "/accounts/sign-in",
  ({ username, password, account, session, expiresAt, time, lifetime }) =>
    receive({ username, password })
      .then(Authenticating.authenticate({ username, password }).responds({ account }))
      .then(
        where(now(time), compute(sessionLifetime, {}, lifetime)).then(
          Sessioning.start({ subject: account, lifetime, now: time }).responds({
            session,
            expiresAt,
          }),
        ),
      )
      .then(respond({ account, session, expiresAt })),
  { input: { required: ["username", "password"] } },
);

const SignOut = endpoint(
  "/accounts/sign-out",
  ({ session, ended, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.end({ session, now: time }).responds({ ended })))
      .then(respond({ ended })),
  { input: { defaults: { session: "" } } },
);

export const composition = { Sessions: { Register, SignIn, SignOut } };

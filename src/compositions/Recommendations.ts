import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { each, former } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";
import { sessionUser, take } from "./Profiles.ts";

const { Recommending } = concepts;

const FeedRows = former("the feed of (viewer)", ({ viewer }, { candidate, score }) =>
  each(Recommending._getFeed({ viewer }).is({ candidate, score })).form({ user: candidate, score }),
);

const Feed = endpoint(
  "/recommendations/feed",
  (bag) => {
    const v = take(bag, ["session", "user", "time"]);
    return receive({ session: v.session })
      .then(sessionUser(v))
      .then(respond({ feed: FeedRows({ viewer: v.user }) }));
  },
  { input: { defaults: { session: "" } } },
);

export const composition = {
  Reads: { Feed },
};

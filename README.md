# Startup Matchmaker

Meet the founders and builders you'd want to start something with. Founders find teammates who can ship their idea, builders find a startup worth joining, and people across MIT, Harvard, BU and Tufts are ranked by skills, interests, availability, university and distance. When both sides show interest it's a match, and a private chat opens.

6.1040 Software Design, Fall 2026. Team: Fidan Huseynova, Ketevan Peranidze, Silk Yu, Raleigh Berman.

**Demo video:** [watch the alpha walkthrough](https://drive.google.com/file/d/1eFvP2ZT7zpum7w1ZEejIvE3hk3y0zp-k/view?usp=sharing)

## What you can do

- **Sign up and build a profile** as a founder, builder or both, then publish it.
- **Set preferences** (skills, interests, universities, distance, hours) that shape your feed.
- **Discover** a ranked feed with a match percentage, and show interest.
- **Match**: respond to people who are interested in you, then message your matches or unmatch.
- **Get notified** about interest, matches and messages, with no page refreshes.

## Read more

- [Concept design](documentation/concept-design.md): the five concepts and how they work together
- [Concept contracts](design/concepts/) checked by the framework, and the [reactions](design/compositions/) that connect them
- [Design notes](documentation/design-notes.md): visual study and decisions
- [Development plan](documentation/development-plan.md)
- [Problem framing](documentation/problem-framing/README.md), including the ethical analysis
- [Test results](tests/output.txt) and [what the tests cover](tests/README.md)
- [`.sync-engine/work/`](.sync-engine/work/): briefs, prompts and run records for the agent-assisted changes

## Run it locally

Needs [Bun](https://bun.sh) 1.4.5 and Podman (for MongoDB).

```bash
bun install
(cd frontend && bun install)
cp .env.example .env     # local MongoDB connection
bun run db:up            # start MongoDB
bun run dev:backend      # API on http://localhost:8080/api
bun run dev:frontend     # app on http://localhost:5173 (second terminal)
```
### Test it

```bash
bun run db:up      # tests need MongoDB
bun test           # concept, integration and restart tests
bun run check      # design contracts, generated files, backend and frontend types
bun run test:save  # re-save the summary to tests/output.txt
```

## Deploy

The app runs on [mit-sdg.dev](https://mit-sdg.dev/apps) following the [class guide](https://61040.github.io/fa26/resources/deploying-apps/): runtime Bun, package directories `.` and `frontend`, build script `build`, start script `start`, health check `/health`. Add MongoDB in the Settings tab and rename its variable to `MONGODB_URL`. The backend serves the API under `/api` and the built frontend everywhere else.
Accounts, profiles, matches, recommendations, notifications and chats are saved in MongoDB. Sessions are not, so a redeploy signs everyone out.

`bun run preview` builds the frontend and serves everything from the backend on http://localhost:3000, the way the deployed app runs.

| Variable | Meaning | Default |
| --- | --- | --- |
| `MONGODB_URL` | MongoDB connection string (required) | none; see `.env.example` |
| `PORT` | Port the server listens on | `8080` |
| `HOST` | Interface the server binds to | `localhost` |

## TODOs/Not built yet

Viewing other people's full profiles, See Later, hiding and republishing a profile, and the guard that limits interest to visible, complementary profiles. They are listed with reasons in [`CLAUDE.md`](CLAUDE.md).
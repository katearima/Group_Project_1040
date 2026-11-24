# Group_Project_1040
Team project


https://docs.google.com/spreadsheets/d/1XkOPBRA-6CLnmeJ0T4gd80OykMGjANjbTzZeELhs754/edit?usp=sharing

## Running locally

Requires [Bun](https://bun.sh) 1.4.5 and Podman (for MongoDB).

```bash
bun install
(cd frontend && bun install)
cp .env.example .env     # MONGODB_URL for the local database
bun run db:up            # start MongoDB
bun run dev:backend      # API on http://localhost:8080/api
bun run dev:frontend     # app on http://localhost:5173 (in a second terminal)
```

`bun test` runs the backend tests (MongoDB must be running), and `bun run check` checks the
design, the generated artifacts, and both TypeScript projects. `bun run preview` builds the
frontend and serves the whole app from the backend on http://localhost:3000, as in deployment.

## Deploying

The app is deployed on [mit-sdg.dev](https://mit-sdg.dev/apps) following the
[class guide](https://61040.github.io/fa26/resources/deploying-apps/). Settings: runtime Bun,
package directories `.` and `frontend`, build script `build`, start script `start`, health
check path `/health`. Add MongoDB in the Settings tab and rename its variable to
`MONGODB_URL`. The backend serves the API under `/api` and the built frontend for every
other path.

## Assignments

- [F2: Problem Framing](problem-framing/README.md)

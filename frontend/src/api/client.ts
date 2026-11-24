import { createHttpClient } from "@mit-sdg/sync-engine-http/client";
import type { AppWireHttp } from "../../../generated/wire.ts";

/**
 * A typed client for every backend endpoint, built from `generated/wire.ts`
 * (regenerate with `bun run generate` after endpoint changes). Requests go to `/api/...` on
 * the page's own origin: the backend serves its endpoints there, and in development the Vite
 * dev server forwards them to it.
 *
 * Every endpoint except register and sign-in takes the `session` returned by them.
 */
export const api = createHttpClient<AppWireHttp>({ baseUrl: "/api" });

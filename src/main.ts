import { createGateway } from "@mit-sdg/sync-engine/boundary";
import { createHttpHandler } from "@mit-sdg/sync-engine-http/handler";
import type { Db } from "mongodb";
import type { AppWire } from "../generated/wire.ts";
import { appHttpPolicy, assembleApplication } from "./assembly.ts";

/** The package HTTP handler over a freshly assembled application. */
export function createApplicationHttpHandler(options: { database?: Db } = {}) {
  const application = assembleApplication(options);
  const gateway = createGateway<AppWire>({ application });
  return createHttpHandler({ application, gateway, policy: appHttpPolicy });
}

export interface ClientRateLimit {
  /** Requests one client may make per window. */
  readonly limit: number;
  /** Window length in milliseconds. */
  readonly windowMs: number;
}

/** Default per-client budget: enough for normal browsing and polling, not for brute force. */
export const DEFAULT_CLIENT_RATE_LIMIT: ClientRateLimit = { limit: 120, windowMs: 60_000 };

/**
 * A fixed-window request budget per client address. It is path-agnostic transport
 * protection (the HTTP policy has no rate limits); it never inspects which endpoint is
 * called, so routing and product policy stay in the package handler.
 */
export function createClientRateLimiter(
  { limit, windowMs }: ClientRateLimit = DEFAULT_CLIENT_RATE_LIMIT,
  clock: () => number = Date.now,
) {
  const windows = new Map<string, { start: number; count: number }>();
  return function allow(client: string): boolean {
    const now = clock();
    const current = windows.get(client);
    if (current === undefined || now - current.start >= windowMs) {
      // Drop finished windows so the table only holds recently active clients.
      for (const [key, window] of windows) {
        if (now - window.start >= windowMs) windows.delete(key);
      }
      windows.set(client, { start: now, count: 1 });
      return true;
    }
    current.count += 1;
    return current.count <= limit;
  };
}

const TOO_MANY_REQUESTS = () =>
  Response.json({ error: "TOO_MANY_REQUESTS" }, { status: 429, headers: { "retry-after": "60" } });

export function startHost(port = Number(process.env.PORT ?? 8080)) {
  const handle = createApplicationHttpHandler();
  const allow = createClientRateLimiter();
  return Bun.serve({
    port,
    fetch(request, server) {
      const client = server.requestIP(request)?.address ?? "unknown";
      return allow(client) ? handle(request) : TOO_MANY_REQUESTS();
    },
  });
}

if (import.meta.main) {
  const server = startHost();
  console.log(`Listening on ${server.url}`);
}

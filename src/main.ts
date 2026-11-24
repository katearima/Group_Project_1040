import { resolve } from "node:path";
import { createGateway } from "@mit-sdg/sync-engine/boundary";
import { createHttpHandler } from "@mit-sdg/sync-engine-http/handler";
import type { Db } from "mongodb";
import type { AppWire } from "../generated/wire.ts";
import { type AppStores, appHttpPolicy, assembleApplication, openStores } from "./assembly.ts";
import { db } from "./db.ts";

/** The package HTTP handler over a freshly assembled application. */
export function createApplicationHttpHandler(options: { database?: Db; stores?: AppStores } = {}) {
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

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * The deployment platform's health check: answers 200 `{ status: "ok" }` only when MongoDB
 * answers a small read within a few seconds, and 503 `{ status: "unavailable" }` otherwise,
 * so a deployment that cannot reach its database is not marked healthy.
 */
export async function checkHealth(database: Db = db): Promise<Response> {
  try {
    await database
      .collection("chatting.conversations")
      .findOne({}, { projection: { _id: 1 }, maxTimeMS: 2000, timeoutMS: 3000 });
    return Response.json({ status: "ok" }, { headers: NO_STORE });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers: NO_STORE });
  }
}

/** The built frontend (`bun run build`). */
const SITE = resolve(import.meta.dir, "../frontend/dist");

/**
 * Answers a GET for a page or asset of the built frontend: a path naming a built file, such as
 * /assets/index-abc.js, gets that file; every other path gets index.html, so page links like
 * /chats/<id> load the app.
 */
export async function serveSite(pathname: string, site = SITE): Promise<Response> {
  const path = resolve(site, `.${pathname}`);
  const asset = Bun.file(path);
  if (pathname !== "/" && path.startsWith(`${site}/`) && (await asset.exists())) {
    return new Response(asset);
  }
  const page = Bun.file(`${site}/index.html`);
  if (await page.exists()) return new Response(page);
  return new Response("The frontend isn't built yet: run `bun run build`.", { status: 404 });
}

/**
 * The HTTP server: the API under /api (rate-limited, routed by the package handler), a health
 * check for the deployment platform, and the built frontend for every other GET. The host
 * only separates API from pages; which endpoint runs is decided by the package handler.
 */
export function startHost(
  port = Number(process.env.PORT ?? 8080),
  hostname = process.env.HOST ?? "localhost",
  stores: AppStores = {},
) {
  const handle = createApplicationHttpHandler({ stores });
  const allow = createClientRateLimiter();
  return Bun.serve({
    port,
    hostname,
    fetch(request, server) {
      const { pathname } = new URL(request.url);
      if (pathname === "/api" || pathname.startsWith("/api/")) {
        const client = server.requestIP(request)?.address ?? "unknown";
        return allow(client) ? handle(request) : TOO_MANY_REQUESTS();
      }
      if (pathname === "/health") return checkHealth();
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
      }
      return serveSite(pathname);
    },
  });
}

if (import.meta.main) {
  // Load what the last run saved, and write the final state back when the platform stops us.
  const { stores, flush } = await openStores();
  const server = startHost(undefined, undefined, stores);
  console.log(`Listening on ${server.url}`);
  for (const signal of ["SIGTERM", "SIGINT"] as const) {
    process.on(signal, () => {
      void server.stop();
      void flush().finally(() => process.exit(0));
    });
  }
}

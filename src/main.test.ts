import { afterAll, describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MongoClient } from "mongodb";
import {
  checkHealth,
  createApplicationHttpHandler,
  createClientRateLimiter,
  serveSite,
} from "./main.ts";
import { dropTestDatabases, freshTestDatabase } from "./test-database.ts";

describe("client rate limiter", () => {
  test("allows up to the limit per window, then refuses until the window ends", () => {
    let now = 0;
    const allow = createClientRateLimiter({ limit: 3, windowMs: 1_000 }, () => now);
    expect([allow("a"), allow("a"), allow("a"), allow("a")]).toEqual([true, true, true, false]);
    // Another client has its own budget.
    expect(allow("b")).toBe(true);
    now = 999;
    expect(allow("a")).toBe(false);
    now = 1_000;
    expect(allow("a")).toBe(true);
  });
});

describe("HTTP policy limits", () => {
  test("an oversized request body is refused before reaching any endpoint", async () => {
    const handler = createApplicationHttpHandler();
    const response = await handler(
      new Request("http://localhost/api/accounts/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "ana", password: "x".repeat(32 * 1024) }),
      }),
    );
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
    // Nothing was registered: the same username can still sign up.
    const retry = await handler(
      new Request("http://localhost/api/accounts/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "ana", password: "correct-horse" }),
      }),
    );
    expect(retry.status).toBe(200);
  });
});

describe("serving the built frontend", () => {
  function builtSite() {
    const site = mkdtempSync(join(tmpdir(), "site-"));
    mkdirSync(join(site, "assets"));
    writeFileSync(join(site, "index.html"), "<p>app</p>");
    writeFileSync(join(site, "assets", "app.js"), "console.log(1)");
    return site;
  }

  test("serves built files, and index.html for every other path", async () => {
    const site = builtSite();
    try {
      expect(await (await serveSite("/assets/app.js", site)).text()).toBe("console.log(1)");
      expect(await (await serveSite("/", site)).text()).toBe("<p>app</p>");
      expect(await (await serveSite("/chats/abc", site)).text()).toBe("<p>app</p>");
    } finally {
      rmSync(site, { recursive: true });
    }
  });

  test("never serves a file outside the built site", async () => {
    const site = builtSite();
    try {
      const reply = await serveSite("/../package.json", site);
      expect(await reply.text()).toBe("<p>app</p>");
    } finally {
      rmSync(site, { recursive: true });
    }
  });

  test("explains when the frontend has not been built", async () => {
    const reply = await serveSite("/", join(tmpdir(), "missing-site"));
    expect(reply.status).toBe(404);
    expect(await reply.text()).toContain("bun run build");
  });
});

describe("health check", () => {
  afterAll(dropTestDatabases);

  test("answers ok while MongoDB is reachable", async () => {
    const reply = await checkHealth(freshTestDatabase());
    expect(reply.status).toBe(200);
    expect(await reply.json()).toEqual({ status: "ok" });
    expect(reply.headers.get("cache-control")).toBe("no-store");
  });

  test("answers 503 when MongoDB cannot be reached", async () => {
    // Nothing listens on port 1, so the read fails once server selection gives up.
    const unreachable = new MongoClient("mongodb://127.0.0.1:1/health-test", {
      serverSelectionTimeoutMS: 200,
    });
    try {
      const reply = await checkHealth(unreachable.db());
      expect(reply.status).toBe(503);
      expect(await reply.json()).toEqual({ status: "unavailable" });
    } finally {
      await unreachable.close();
    }
  });
});

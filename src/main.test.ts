import { describe, expect, test } from "bun:test";
import { createApplicationHttpHandler, createClientRateLimiter } from "./main.ts";

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
      new Request("http://localhost/accounts/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "ana", password: "x".repeat(32 * 1024) }),
      }),
    );
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
    // Nothing was registered: the same username can still sign up.
    const retry = await handler(
      new Request("http://localhost/accounts/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "ana", password: "correct-horse" }),
      }),
    );
    expect(retry.status).toBe(200);
  });
});

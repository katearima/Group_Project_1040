import { beforeEach, describe, expect, test } from "bun:test";
import { createApplicationHttpHandler } from "./main.ts";

/**
 * Black-box tests for profiles, preferences, and the recommendation feed (Reactions 1 and
 * 2), driven through the @mit-sdg/sync-engine-http handler on a fresh in-memory app.
 */

type Handler = ReturnType<typeof createApplicationHttpHandler>;
type Json = Record<string, any>;

let handler: Handler;

beforeEach(() => {
  handler = createApplicationHttpHandler();
});

async function post(path: string, body: unknown): Promise<{ status: number; body: Json }> {
  const response = await handler(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  return { status: response.status, body: (await response.json()) as Json };
}

async function ok(path: string, body: unknown): Promise<Json> {
  const reply = await post(path, body);
  expect(reply.body.error).toBeUndefined();
  expect(reply.status).toBe(200);
  return reply.body;
}

async function refused(path: string, body: unknown, status: number, error: string) {
  const reply = await post(path, body);
  expect(reply.status).toBe(status);
  expect(reply.body.error).toBe(error);
}

async function register(username: string): Promise<string> {
  return (await ok("/accounts/register", { username, password: "correct-horse" })).session;
}

const MIT = { latitude: 42.3601, longitude: -71.0942 };

function profile(overrides: Json = {}): Json {
  return {
    name: "Keti A",
    university: "MIT",
    major: "Computer Science",
    graduationYear: 2027,
    skills: ["software engineering"],
    experience: "",
    interests: ["data tools"],
    location: "MIT campus",
    ...MIT,
    availability: 10,
    ...overrides,
  };
}

const feedOf = async (session: string) =>
  (await ok("/recommendations/feed", { session })).feed as Array<{ user: string; score: number }>;

/** Keti (builder) and Bumba (founder), both with complete profiles; nothing published. */
async function ketiAndBumba() {
  const keti = await register("keti");
  const bumba = await register("bumba");
  await ok("/profiles/create", { session: keti, role: "BUILDER", ...profile() });
  await ok("/profiles/create", {
    session: bumba,
    role: "FOUNDER",
    ...profile({ name: "Bumba B", university: "BU", skills: ["sales"] }),
  });
  await ok("/profiles/set-pitch", { session: bumba, pitch: "A data tool for solo travelers" });
  return { keti, bumba };
}

describe("profiles", () => {
  test("create returns an identity; mine shows the hidden profile without a pitch", async () => {
    const keti = await register("keti");
    await refused("/profiles/mine", { session: keti }, 404, "NOT_FOUND");
    const { profile: id } = await ok("/profiles/create", {
      session: keti,
      role: "BUILDER",
      ...profile(),
    });
    expect(typeof id).toBe("string");
    const mine = await ok("/profiles/mine", { session: keti });
    expect(mine).toEqual({
      profile: id,
      role: "BUILDER",
      ...profile(),
      visible: false,
      startupPitch: null,
    });
  });

  test("validation and publication refusals change nothing", async () => {
    const keti = await register("keti");
    await refused(
      "/profiles/create",
      { session: keti, role: "BUILDER", ...profile({ latitude: 95 }) },
      400,
      "INVALID_REQUEST",
    );
    await refused("/profiles/mine", { session: keti }, 404, "NOT_FOUND");
    await ok("/profiles/create", { session: keti, role: "BUILDER", ...profile({ skills: [] }) });
    await refused(
      "/profiles/create",
      { session: keti, role: "FOUNDER", ...profile() },
      409,
      "CONFLICT",
    );
    await refused("/profiles/publish", { session: keti }, 409, "CONFLICT");
    await refused("/profiles/set-pitch", { session: keti, pitch: "x" }, 403, "FORBIDDEN");
    expect((await ok("/profiles/mine", { session: keti })).visible).toBe(false);
  });

  test("a founder must set a pitch before publishing", async () => {
    const bumba = await register("bumba");
    await ok("/profiles/create", { session: bumba, role: "FOUNDER", ...profile() });
    await refused("/profiles/publish", { session: bumba }, 409, "CONFLICT");
    await refused("/profiles/set-pitch", { session: bumba, pitch: "   " }, 400, "INVALID_REQUEST");
    await ok("/profiles/set-pitch", { session: bumba, pitch: "Travel app" });
    expect(await ok("/profiles/publish", { session: bumba })).toEqual({ published: true });
    const mine = await ok("/profiles/mine", { session: bumba });
    expect(mine.visible).toBe(true);
    expect(mine.startupPitch).toBe("Travel app");
  });

  test("a visible profile cannot be updated into an incomplete one", async () => {
    const keti = await register("keti");
    await ok("/profiles/create", { session: keti, role: "BUILDER", ...profile() });
    await ok("/profiles/publish", { session: keti });
    await refused(
      "/profiles/update",
      { session: keti, ...profile({ interests: [] }) },
      409,
      "CONFLICT",
    );
    expect((await ok("/profiles/mine", { session: keti })).interests).toEqual(["data tools"]);
  });

  test("missing and invalid sessions are refused without changes", async () => {
    await refused("/profiles/create", { role: "BUILDER", ...profile() }, 401, "UNAUTHORIZED");
    await refused("/profiles/publish", { session: "invented" }, 401, "UNAUTHORIZED");
    await refused("/recommendations/feed", {}, 401, "UNAUTHORIZED");
    await refused(
      "/recommendations/set-preferences",
      { session: "invented", skills: [], interests: [], universities: [] },
      401,
      "UNAUTHORIZED",
    );
  });
});

describe("Reaction 1: publishing creates recommendations", () => {
  test("Keti and Bumba appear in each other's feeds with the five-factor score", async () => {
    const { keti, bumba } = await ketiAndBumba();
    // Unpublished profiles create nothing.
    expect(await feedOf(keti)).toEqual([]);
    expect(await ok("/profiles/publish", { session: keti })).toEqual({ published: true });
    expect(await feedOf(keti)).toEqual([]);
    await ok("/profiles/publish", { session: bumba });
    // No preferences: skills 1, interests share "data tools" 1, university 1,
    // availability 1, proximity 1.
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 1 }]);
    expect(await feedOf(bumba)).toEqual([{ user: "keti", score: 1 }]);
  });

  test("same-role users never see each other; feeds rank highest score first", async () => {
    const { keti, bumba } = await ketiAndBumba();
    const ana = await register("ana");
    const dato = await register("dato");
    await ok("/profiles/create", {
      session: ana,
      role: "BUILDER",
      ...profile({ name: "Ana C", interests: ["music"] }),
    });
    await ok("/profiles/create", {
      session: dato,
      role: "FOUNDER",
      ...profile({ name: "Dato D", interests: ["games"] }),
    });
    await ok("/profiles/set-pitch", { session: dato, pitch: "Games" });
    for (const session of [dato, keti, ana, bumba]) await ok("/profiles/publish", { session });
    expect(await feedOf(keti)).toEqual([
      { user: "bumba", score: 1 },
      { user: "dato", score: 0.8 },
    ]);
    expect(await feedOf(ana)).toEqual([
      { user: "dato", score: 0.8 },
      { user: "bumba", score: 0.8 },
    ]);
    const builders = (await feedOf(bumba)).map((row) => row.user);
    expect(builders.sort()).toEqual(["ana", "keti"]);
  });

  test("publishing again succeeds and keeps one recommendation per pair", async () => {
    const { keti, bumba } = await ketiAndBumba();
    await ok("/profiles/publish", { session: keti });
    await ok("/profiles/publish", { session: bumba });
    await ok("/profiles/publish", { session: keti });
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 1 }]);
  });
});

describe("Reaction 2: changes recalculate recommendations", () => {
  test("Keti's preferences change her score for Bumba", async () => {
    const { keti, bumba } = await ketiAndBumba();
    await ok("/profiles/publish", { session: keti });
    await ok("/profiles/publish", { session: bumba });
    expect(
      await ok("/recommendations/set-preferences", {
        session: keti,
        skills: [],
        interests: ["data tools", "travel"],
        universities: ["MIT"],
      }),
    ).toEqual({ saved: true });
    // interests 0.5 (one of two), university 0 (BU) → (1 + 0.5 + 0 + 1 + 1) / 5 = 0.7.
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 0.7 }]);
    expect(await feedOf(bumba)).toEqual([{ user: "keti", score: 1 }]);
  });

  test("Bumba's skill preference and Keti's skills move both directions", async () => {
    const { keti, bumba } = await ketiAndBumba();
    await ok("/profiles/publish", { session: keti });
    await ok("/profiles/publish", { session: bumba });
    await ok("/recommendations/set-preferences", {
      session: bumba,
      skills: ["software engineering", "design"],
      interests: [],
      universities: [],
    });
    // Bumba→Keti: Bumba prefers 2 skills, Keti has 1 → 0.5; Keti prefers none → 1; skills 0.75.
    // Keti→Bumba: Bumba prefers 2, Keti has 1 → 0.5; Keti's side 1; skills 0.75.
    expect(await feedOf(bumba)).toEqual([{ user: "keti", score: 0.95 }]);
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 0.95 }]);
    await ok("/profiles/update", {
      session: keti,
      ...profile({ skills: ["Software Engineering", "design"] }),
    });
    expect(await feedOf(bumba)).toEqual([{ user: "keti", score: 1 }]);
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 1 }]);
  });

  test("a pitch change refreshes without changing scores", async () => {
    const { keti, bumba } = await ketiAndBumba();
    await ok("/profiles/publish", { session: keti });
    await ok("/profiles/publish", { session: bumba });
    expect(await ok("/profiles/set-pitch", { session: bumba, pitch: "New pitch" })).toEqual({
      pitchSet: true,
    });
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 1 }]);
  });

  test("changes while unpublished take effect only when published", async () => {
    const { keti, bumba } = await ketiAndBumba();
    await ok("/profiles/publish", { session: bumba });
    await ok("/profiles/update", { session: keti, ...profile({ interests: ["music"] }) });
    await ok("/recommendations/set-preferences", {
      session: keti,
      skills: [],
      interests: [],
      universities: ["BU"],
    });
    expect(await feedOf(keti)).toEqual([]);
    expect(await feedOf(bumba)).toEqual([]);
    await ok("/profiles/publish", { session: keti });
    // Keti→Bumba: interests fall back to Keti's own ("music") → 0; university BU → 1.
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 0.8 }]);
    // Bumba→Keti: Bumba's own interest "data tools" vs Keti's "music" → 0.
    expect(await feedOf(bumba)).toEqual([{ user: "keti", score: 0.8 }]);
  });
});

describe("preferences", () => {
  test("defaults, saved values, and clearing omitted numbers", async () => {
    const keti = await register("keti");
    await ok("/profiles/create", { session: keti, role: "BUILDER", ...profile() });
    const empty = { skills: [], interests: [], universities: [], distance: null, availability: null };
    expect(await ok("/recommendations/preferences", { session: keti })).toEqual(empty);
    await ok("/recommendations/set-preferences", {
      session: keti,
      skills: ["Go"],
      interests: [],
      universities: [],
      distance: 25,
      availability: 0,
    });
    expect(await ok("/recommendations/preferences", { session: keti })).toEqual({
      ...empty,
      skills: ["Go"],
      distance: 25,
      availability: 0,
    });
    await ok("/recommendations/set-preferences", {
      session: keti,
      skills: [],
      interests: ["travel"],
      universities: [],
      availability: 5,
    });
    expect(await ok("/recommendations/preferences", { session: keti })).toEqual({
      ...empty,
      interests: ["travel"],
      availability: 5,
    });
  });

  test("refused without a profile and for invalid values, without changes", async () => {
    const keti = await register("keti");
    await refused(
      "/recommendations/set-preferences",
      { session: keti, skills: [], interests: [], universities: [] },
      404,
      "NOT_FOUND",
    );
    await ok("/profiles/create", { session: keti, role: "BUILDER", ...profile() });
    await ok("/recommendations/set-preferences", {
      session: keti,
      skills: ["Go"],
      interests: [],
      universities: [],
    });
    await refused(
      "/recommendations/set-preferences",
      { session: keti, skills: [], interests: [], universities: [], distance: -1 },
      400,
      "INVALID_REQUEST",
    );
    await refused(
      "/recommendations/set-preferences",
      { session: keti, skills: ["  "], interests: [], universities: [] },
      400,
      "INVALID_REQUEST",
    );
    expect((await ok("/recommendations/preferences", { session: keti })).skills).toEqual(["Go"]);
  });

  test("a zero preferred distance keeps only same-place candidates at full proximity", async () => {
    const { keti, bumba } = await ketiAndBumba();
    await ok("/profiles/publish", { session: keti });
    await ok("/profiles/update", {
      session: bumba,
      ...profile({ name: "Bumba B", university: "BU", skills: ["sales"], latitude: 42.35 }),
    });
    await ok("/profiles/publish", { session: bumba });
    await ok("/recommendations/set-preferences", {
      session: keti,
      skills: [],
      interests: [],
      universities: [],
      distance: 0,
    });
    expect(await feedOf(keti)).toEqual([{ user: "bumba", score: 0.8 }]);
  });
});

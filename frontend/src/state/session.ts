import { reactive, readonly } from "vue";
import { api } from "../api/client.ts";
import { messageFor } from "../api/errors.ts";

const KEY = "matchmaker.session";

interface Stored {
  session: string;
  username: string;
}

function load(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function save(value: Stored | null) {
  try {
    if (value) localStorage.setItem(KEY, JSON.stringify(value));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage can be blocked; the session then lasts until the tab closes.
  }
}

const stored = load();
const state = reactive<{ session: string | null; username: string | null; notice: string | null }>({
  session: stored?.session ?? null,
  username: stored?.username ?? null,
  notice: null,
});

export type Result<T> = { ok: true; data: T } | { ok: false; error: string; message: string };

/** Splits an endpoint answer into its success value or a sentence to show. */
function settle<T>(path: string, answer: unknown): Result<T> {
  if (answer && typeof answer === "object" && "error" in answer) {
    const error = String((answer as { error: unknown }).error);
    return { ok: false, error, message: messageFor(path, error) };
  }
  return { ok: true, data: answer as T };
}

function begin(answer: { account: string; session: string }) {
  state.session = answer.session;
  state.username = answer.account;
  state.notice = null;
  save({ session: answer.session, username: answer.account });
}

function end(notice: string | null) {
  state.session = null;
  state.username = null;
  state.notice = notice;
  save(null);
}

/**
 * Calls an endpoint that needs the signed-in person's session. If the server says the session is gone, the
 * person is sent back to the sign-in screen with an explanation.
 */
export async function call<T>(path: string, run: (session: string) => Promise<unknown>): Promise<Result<T>> {
  if (!state.session) return { ok: false, error: "UNAUTHORIZED", message: messageFor(path, "UNAUTHORIZED") };
  const result = settle<T>(path, await run(state.session));
  if (!result.ok && result.error === "UNAUTHORIZED") end("Your session has ended. Sign in again.");
  return result;
}

async function register(username: string, password: string): Promise<string | null> {
  const result = settle<{ account: string; session: string }>(
    "/accounts/register",
    await api.accounts.register({ username, password }),
  );
  if (!result.ok) return result.message;
  begin(result.data);
  return null;
}

async function signIn(username: string, password: string): Promise<string | null> {
  const result = settle<{ account: string; session: string }>(
    "/accounts/sign-in",
    await api.accounts["sign-in"]({ username, password }),
  );
  if (!result.ok) return result.message;
  begin(result.data);
  return null;
}

async function signOut() {
  const session = state.session;
  end(null);
  if (session) await api.accounts["sign-out"]({ session });
}

/** The signed-in person and the functions that start and end their session. */
export function useSession() {
  return { state: readonly(state), register, signIn, signOut };
}

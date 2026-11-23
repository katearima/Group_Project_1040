import {
  dateTime,
  expiration,
  isActive,
  secureSessionToken,
  SESSION_TOKEN_ATTEMPTS,
  UnknownSession,
  UNKNOWN_SESSION_DETAIL,
  type SessionRecord,
  type SessioningDependencies,
} from "./sessioning.shared.ts";

const EXPIRED_SESSION_SWEEP_INTERVAL_MS = 60_000;

export class SessioningMemoryConcept {
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly freshSession: () => string;

  constructor({ freshSession = secureSessionToken }: SessioningDependencies = {}) {
    this.freshSession = freshSession;
  }

  start({ subject, lifetime, now }: { subject: string; lifetime: number; now: Date }) {
    const expiresAt = expiration(dateTime(now), lifetime);
    this.#sweepExpired(dateTime(now));
    const session = this.#allocateSession();
    this.sessions.set(session, { subject, expiresAt });
    return { session, expiresAt: new Date(expiresAt) };
  }

  current({ session, now }: { session: string; now: Date }) {
    return { subject: this.#active(session, dateTime(now)).subject };
  }

  end({ session, now }: { session: string; now: Date }) {
    this.#active(session, dateTime(now));
    this.sessions.delete(session);
    return { ended: true };
  }

  _active({
    session,
    now,
  }: {
    session: string;
    now: Date;
  }): Array<{ subject: string; expiresAt: Date }> {
    const found = this.sessions.get(session);
    if (found === undefined || !isActive(found, dateTime(now))) return [];
    return [{ subject: found.subject, expiresAt: new Date(found.expiresAt) }];
  }

  /**
   * Application-owned addition to the vendored catalog source: forget sessions that can no
   * longer be active, at most once per sweep interval, so the in-memory store does not grow
   * with every sign-in. Expired sessions are already refused, so this changes no answer.
   */
  #lastSweep = Number.NEGATIVE_INFINITY;

  #sweepExpired(now: Date): void {
    if (now.getTime() - this.#lastSweep < EXPIRED_SESSION_SWEEP_INTERVAL_MS) return;
    this.#lastSweep = now.getTime();
    for (const [session, record] of this.sessions) {
      if (!isActive(record, now)) this.sessions.delete(session);
    }
  }

  #allocateSession(): string {
    for (let attempt = 0; attempt < SESSION_TOKEN_ATTEMPTS; attempt += 1) {
      const session = this.freshSession();
      if (!this.sessions.has(session)) return session;
    }
    throw new Error("The session token source repeatedly returned an existing bearer value.");
  }

  #active(session: string, now: Date): SessionRecord {
    const found = this.sessions.get(session);
    if (found === undefined || !isActive(found, now)) {
      throw new UnknownSession(UNKNOWN_SESSION_DETAIL);
    }
    return found;
  }
}

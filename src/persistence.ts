import type { Db } from "mongodb";

/**
 * Where a concept keeps its state between restarts. Each stateful concept takes an optional
 * `Persistence` and calls `save` with a snapshot of its whole state after every change; without
 * one (as in unit tests) it stays purely in memory. The concept's own logic is unchanged.
 */
export interface Persistence<S> {
  /** The state saved by the previous run, or undefined on a first run. */
  readonly initial: S | undefined;
  /** Records the latest state. Writes are queued and merged, so the caller never waits. */
  save(state: S): void;
}

export interface OpenPersistence<S> extends Persistence<S> {
  /** Resolves once every queued write has reached MongoDB. */
  flush(): Promise<void>;
}

/** Copies rows into plain, storable objects: nested values cloned, undefined fields dropped. */
export function plain<T extends object>(rows: Iterable<T>): T[] {
  return [...rows].map((row) => {
    const copy = structuredClone(row) as Record<string, unknown>;
    for (const key of Object.keys(copy)) if (copy[key] === undefined) delete copy[key];
    return copy as T;
  });
}

/**
 * Opens the saved state named `name` in the `state` collection (one document per concept) and
 * returns a `Persistence` that writes back to it. Only the newest snapshot is written when
 * several arrive close together.
 */
export async function openPersistence<S>(database: Db, name: string): Promise<OpenPersistence<S>> {
  const collection = database.collection<{ _id: string; state: S }>("state");
  const saved = await collection.findOne({ _id: name });
  let latest: S | undefined;
  let dirty = false;
  let writing: Promise<void> = Promise.resolve();

  function schedule(): void {
    writing = writing.then(async () => {
      if (!dirty) return;
      const state = latest as S;
      dirty = false;
      latest = undefined;
      try {
        await collection.replaceOne({ _id: name }, { state }, { upsert: true });
      } catch (error) {
        console.error(`Could not save ${name}:`, error instanceof Error ? error.message : error);
      }
    });
  }

  return {
    initial: saved?.state,
    save(state) {
      latest = state;
      dirty = true;
      schedule();
    },
    async flush() {
      schedule();
      await writing;
    },
  };
}

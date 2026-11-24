import { randomUUID } from "node:crypto";
import { type Db, MongoClient } from "mongodb";

/**
 * Fresh MongoDB databases for tests, on the server from compose.yaml (`bun run db:up`).
 * Each call to `freshTestDatabase` returns a new, empty database. A test file calls
 * `afterAll(dropTestDatabases)` to remove the databases it created.
 */
const client = new MongoClient(process.env.MONGODB_URL!, { serverSelectionTimeoutMS: 5_000 });
const created: Db[] = [];

export function freshTestDatabase(): Db {
  const database = client.db(`test-${randomUUID()}`);
  created.push(database);
  return database;
}

export async function dropTestDatabases(): Promise<void> {
  await Promise.all(created.splice(0).map((database) => database.dropDatabase()));
}

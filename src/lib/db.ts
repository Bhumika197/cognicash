import { drizzle } from "drizzle-orm/better-sqlite3";
let db: ReturnType<typeof drizzle> | null = null;

try {
  // Lazy require to avoid hard dependency during early setup or install failures
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const BetterSqlite3 = require("better-sqlite3");
  const sqlite = new BetterSqlite3("./.data/dev.sqlite");
  db = drizzle(sqlite);
} catch (e) {
  // Fallback: DB not available yet. Callers should handle null.
  db = null as any;
}

export { db };

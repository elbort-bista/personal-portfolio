import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let dbInstance: ReturnType<typeof drizzle>;

if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  dbInstance = drizzle(pool, { schema });
} else {
  dbInstance = new Proxy(
    {},
    {
      get() {
        throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
      },
    },
  ) as any;
}

export const db = dbInstance;

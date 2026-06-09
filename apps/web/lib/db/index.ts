import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://kb_user:kb_password@localhost:5432/kb_database";

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
});

export const db = drizzle(pool, { schema });
export { schema };

// Run database migrations at startup (production)
// Called from Docker entrypoint before node server.js

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, max: 2 });
const db = drizzle(pool);

async function main() {
  console.log("Running DB migrations...");
  try {
    await migrate(db, { migrationsFolder: "./lib/db/migrations" });
    console.log("Migrations complete.");
  } catch (error) {
    console.error("Migration error:", error.message);
    // Don't crash — tables might already exist
    console.log("Continuing anyway...");
  } finally {
    await pool.end();
  }
}

main();

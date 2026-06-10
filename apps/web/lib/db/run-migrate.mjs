// Run database migrations at startup (production)
// Reads SQL files directly, bypasses Drizzle's migration journal requirement.

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import pkg from "pg";
const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, max: 2 });

async function main() {
  console.log("Running DB migrations...");

  const migrationsDir = join(process.cwd(), "lib", "db", "migrations");

  let files;
  try {
    files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
  } catch {
    console.log("No migration files found, skipping.");
    await pool.end();
    return;
  }

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, "utf-8");

    console.log(`  → ${file}`);
    try {
      await pool.query(sql);
      console.log(`    OK`);
    } catch (err) {
      // If table already exists, that's fine — continue
      if (err.code === "42P07" || err.code === "42710") {
        console.log(`    Already exists, skipping.`);
      } else {
        console.error(`    Failed: ${err.message}`);
        // Don't crash — continue with remaining migrations
      }
    }
  }

  console.log("Migrations done.");
  await pool.end();
}

main();

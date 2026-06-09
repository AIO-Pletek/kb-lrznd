import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";

async function runMigrations() {
  console.log("Running database migrations...");
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  console.log("Migrations complete.");
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

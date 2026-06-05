import { createDirectus, rest, readItems, readItem, readSingleton } from "@directus/sdk";

// Directus server-side client — uses internal Docker network URL
const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";

export const directus = createDirectus(DIRECTUS_URL).with(rest());

// Re-export common methods
export { readItems, readItem, readSingleton };

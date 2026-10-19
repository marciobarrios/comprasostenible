import nextEnv from "@next/env";
import { CATEGORIES } from "../lib/categories.ts";
import { createCatalogSnapshot } from "./catalog-snapshot.mjs";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV === "development");
await createCatalogSnapshot({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  endpoint: process.env.AIRTABLE_ENDPOINT_URL,
  categories: Object.keys(CATEGORIES),
  destination: ".catalog/snapshot.json",
});

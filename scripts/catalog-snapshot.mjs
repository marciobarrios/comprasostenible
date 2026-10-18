import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

// Read each existing view once, preserving Airtable's filtering and ordering.
// The same snapshot is shared by every Next build worker and metadata render.
export async function createCatalogSnapshot({
  apiKey,
  baseId,
  categories,
  destination,
  endpoint = "https://api.airtable.com",
  fetchImpl = fetch,
  pause = () => delay(220),
}) {
  if (!apiKey || !baseId) throw new Error("AIRTABLE_API_KEY and AIRTABLE_BASE_ID are required.");
  let calls = 0;
  async function list(table, view) {
    const records = [];
    let offset;
    do {
      // Stop accidental pagination loops or unexpected catalogue growth before
      // one build can consume the workspace's monthly allowance.
      if (calls >= 50) throw new Error("Airtable build budget exceeded (50 requests).");
      if (calls) await pause();
      const url = new URL(`/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(table)}`, endpoint);
      url.searchParams.set("pageSize", "100");
      if (view) url.searchParams.set("view", view);
      if (offset) url.searchParams.set("offset", offset);
      calls++;
      const response = await fetchImpl(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(15_000),
        redirect: "error",
      });
      // No automatic retries: a monthly quota failure must not loop or publish
      // an empty site. Vercel keeps the previous successful deployment live.
      if (!response.ok) throw new Error(`Airtable ${table}/${view || "all"}: HTTP ${response.status}; publish aborted.`);
      const page = await response.json();
      if (!Array.isArray(page.records) || page.records.some((record) =>
        typeof record.id !== "string" || !record.fields || typeof record.fields !== "object")) {
        throw new Error(`Invalid Airtable response for ${table}.`);
      }
      if (page.offset !== undefined && typeof page.offset !== "string") {
        throw new Error(`Invalid Airtable pagination for ${table}.`);
      }
      records.push(...page.records.map(({ id, fields }) => ({ id, fields })));
      offset = page.offset;
    } while (offset);
    return records;
  }

  const brands = await list("Marcas", "default");
  if (!brands.length) throw new Error("The default brand view is empty; publish aborted.");
  const slugs = brands.map(({ fields }) => fields.slug);
  if (slugs.some((slug) => typeof slug !== "string" || !slug.trim()) || new Set(slugs).size !== slugs.length) {
    throw new Error("Brand slugs must be nonempty and unique; publish aborted.");
  }
  const home = await list("Marcas", "home");
  const categoryBrands = {};
  for (const category of categories) categoryBrands[category] = await list("Marcas", category);
  const certificates = await list("Certificados");
  const snapshot = { brands, home, categories: categoryBrands, certificates };
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(`${destination}.tmp`, JSON.stringify(snapshot));
  await rename(`${destination}.tmp`, destination);
  console.log(`Catalogue ready: ${brands.length} brands, ${certificates.length} certificates, ${calls} Airtable requests.`);
  return { snapshot, calls };
}

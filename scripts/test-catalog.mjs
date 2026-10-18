import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createCatalogSnapshot } from "./catalog-snapshot.mjs";
import { CATEGORIES } from "../lib/categories.ts";

const directory = await mkdtemp(path.join(tmpdir(), "catalog-test-"));
const destination = path.join(directory, "snapshot.json");
const calls = [];
const brand = (slug) => ({ id: `rec-${slug}`, fields: { slug, name: slug } });
const options = {
  apiKey: "fixture-only", baseId: "fixture", categories: Object.keys(CATEGORIES), destination,
  pause: async () => {},
  fetchImpl: async (url) => {
    calls.push(url);
    const view = url.searchParams.get("view");
    if (view === "default") return Response.json(url.searchParams.has("offset")
      ? { records: [brand("second")] }
      : { records: [brand("first")], offset: "next-page" });
    return Response.json({ records: view === "home" ? [brand("second"), brand("first")] : [] });
  },
};
try {
  const result = await createCatalogSnapshot(options);
  assert.equal(result.calls, 10, "Nine datasets plus one extra pagination request");
  assert.equal(calls.filter((url) => url.searchParams.get("offset") === "next-page").length, 1);
  const saved = await readFile(destination, "utf8");
  const data = JSON.parse(saved);
  assert.deepEqual(data.brands.map(({ fields }) => fields.slug), ["first", "second"]);
  assert.deepEqual(data.home.map(({ fields }) => fields.slug), ["second", "first"]);
  assert.deepEqual(data.categories.ropa, [], "Empty category views must stay empty");
  assert.equal(saved.includes("fixture-only"), false, "Never persist credentials");
  for (const status of [401, 403, 429, 500]) {
    let attempts = 0;
    await assert.rejects(createCatalogSnapshot({ ...options, fetchImpl: async () => {
      attempts++; return new Response(null, { status });
    } }), new RegExp(`HTTP ${status}`));
    assert.equal(attempts, 1, "Quota and other errors must not trigger retry storms");
    assert.equal(await readFile(destination, "utf8"), saved, "Keep last complete snapshot on failure");
  }
  let attempts = 0;
  await assert.rejects(createCatalogSnapshot({ ...options, fetchImpl: async () => {
    attempts++; return Response.json({ records: [brand("first")], offset: "loop" });
  } }), /budget exceeded/);
  assert.equal(attempts, 50);
  for (const response of [{}, { records: [] }, { records: [brand("same"), brand("same")] }]) {
    await assert.rejects(createCatalogSnapshot({ ...options, fetchImpl: async () => Response.json(response) }));
    assert.equal(await readFile(destination, "utf8"), saved);
  }
  let partialCalls = 0;
  await assert.rejects(createCatalogSnapshot({ ...options, fetchImpl: async () => {
    partialCalls++;
    return partialCalls === 1 ? Response.json({ records: [brand("new")] }) : new Response(null, { status: 429 });
  } }), /HTTP 429/);
  assert.equal(await readFile(destination, "utf8"), saved, "Partial refresh must not replace complete snapshot");
  await createCatalogSnapshot({ ...options, fetchImpl: async () => Response.json({ records: [brand("updated")] }) });
  assert.equal(JSON.parse(await readFile(destination, "utf8")).brands[0].fields.slug, "updated",
    "A publish must refresh the snapshot, not reuse stale build cache");
  console.log("PASS: pagination, view order, empty views, fresh publishes, atomic failure handling, no retries, and 50-call budget.");
} finally {
  await rm(directory, { recursive: true, force: true });
}

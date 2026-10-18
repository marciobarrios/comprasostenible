import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
// Load only the matcher helper, without the server-only config-testing helpers.
const { unstable_doesMiddlewareMatch } = require("next/dist/experimental/testing/server/middleware-testing-utils");
let airtableCalls = 0;
const views = [];
function load(source, mocks = {}) {
  const code = ts.transpileModule(readFileSync(source, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: (name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name),
  }, { filename: source });
  return exports;
}

const categoryData = load("lib/categories.ts");
const { config: proxyConfig } = load("proxy.ts", { "lib/categories": categoryData });
const matchesProxy = (pathname) => unstable_doesMiddlewareMatch({
  config: proxyConfig, url: `http://localhost${pathname}`,
});
for (const id of Object.keys(categoryData.CATEGORIES)) {
  for (const suffix of ["", "/", "?source=test", "/?source=test"]) {
    assert.equal(matchesProxy(`/categoria/${id}${suffix}`), false,
      `Canonical category ${id}${suffix} must skip Proxy`);
  }
  for (const variant of [id[0].toUpperCase() + id.slice(1), id.toUpperCase(), `${id}-extra`, `${id}/extra`]) {
    for (const suffix of ["", "/"]) {
      assert.equal(matchesProxy(`/categoria/${variant}${suffix}`), true,
        `Invalid category ${variant}${suffix} must reach Proxy`);
    }
  }
}
for (const id of ["accesorios", "no-existe", "constructor", "toString", "__proto__"]) {
  assert.equal(matchesProxy(`/categoria/${id}`), true);
}
for (const pathname of ["/", "/marca/fixture", "/el-proyecto", "/_next/static/chunk.js"]) {
  assert.equal(matchesProxy(pathname), false);
}
console.log("PASS: Next matcher skips every canonical category (with slash/query), intercepts case variants and unknown IDs, and skips unrelated routes.");
const categories = load("components/categories.tsx", { "lib/categories": categoryData });
const page = load("app/categoria/[id]/page.tsx", {
  "lib/categories": categoryData,
  "components/categories": categories,
  "components/brand": { BrandSummary: () => null },
  "components/title": { Title: () => null },
  "lib/cached-logo": { cachedLogoDataUri: async () => assert.fail("No fixture logos") },
  "next/navigation": { notFound: () => { throw new Error("NEXT_HTTP_ERROR_FALLBACK;404"); } },
  "lib/airtable": {
    getBrands: async (view) => { airtableCalls++; views.push(view); return []; },
  },
});
const params = (id) => ({ params: Promise.resolve({ id }) });
for (const id of ["accesorios", "no-existe", "Ropa", "constructor", "toString", "__proto__", ""]) {
  await assert.rejects(page.default(params(id)), /NEXT_HTTP_ERROR_FALLBACK;404/);
  await assert.rejects(page.generateMetadata(params(id)), /NEXT_HTTP_ERROR_FALLBACK;404/);
}
assert.equal(airtableCalls, 0, "Unknown categories must never call Airtable");
assert.equal(page.dynamicParams, false);
const ids = (await page.generateStaticParams()).map(({ id }) => id);
assert.equal(JSON.stringify(ids), JSON.stringify(Object.keys(categories.CATEGORIES)));
for (const id of ids) {
  assert.equal((await page.generateMetadata(params(id))).title,
    `Marcas sostenibles de ${categories.CATEGORIES[id]} ~ comprasostenible.co`);
  await page.default(params(id));
}
assert.equal(airtableCalls, ids.length);
assert.deepEqual(views, Array.from(ids));
console.log("PASS: six valid categories, metadata and static params; seven invalid IDs return 404 with zero Airtable calls.");

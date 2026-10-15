import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
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

const categories = load("components/categories.tsx");
const page = load("app/categoria/[id]/page.tsx", {
  "components/categories": categories,
  "components/brand": { BrandSummary: () => null },
  "components/title": { Title: () => null },
  "lib/cached-logo": { cachedLogoDataUri: async () => assert.fail("No fixture logos") },
  "next/navigation": { notFound: () => { throw new Error("NEXT_HTTP_ERROR_FALLBACK;404"); } },
  "lib/airtable": {
    base: () => {
      airtableCalls++;
      return { select: ({ view }) => { views.push(view); return { all: async () => [] }; } };
    },
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

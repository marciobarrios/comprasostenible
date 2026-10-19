import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile, rm } from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";
import { createRequire } from "node:module";

const { getMiddlewareRouteMatcher } = createRequire(import.meta.url)("next/dist/shared/lib/router/utils/middleware-route-matcher");

const root = process.cwd();
const logo = await sharp({ create: { width: 1200, height: 600, channels: 4, background: "#118877" } }).png().toBuffer();
let fixtureOrigin;
let imageRequests = 0;
let airtableRequests = 0;
let runtime = false;
let server;
const categories = ["ropa", "calzado", "higiene", "muebles", "limpieza", "peques"];
const fixture = createServer((req, res) => {
  if (req.url.startsWith("/logo")) {
    imageRequests++;
    res.setHeader("Content-Type", "image/png"); res.end(logo); return;
  }
  airtableRequests++;
  if (runtime) { res.writeHead(503); res.end(); return; }
  const certificate = req.url.includes("Certificados");
  const fields = certificate
    ? { name: "Fixture certificate", url: "https://example.invalid", logo: [{ url: `${fixtureOrigin}/logo` }] }
    : { name: "Fixture brand", slug: "fixture", type: "ropa", location: "Barcelona",
        production: ["España"], description: "Fixture description", url: "https://example.invalid",
        certificates: ["recCertificate"], logo: [{ url: `${fixtureOrigin}/logo` }] };
  res.setHeader("Content-Type", "application/json");
  const url = new URL(req.url, fixtureOrigin);
  const records = [{ id: certificate ? "recCertificate" : "recBrand", fields }];
  if (url.searchParams.get("view") === "default") {
    if (!url.searchParams.has("offset")) {
      res.end(JSON.stringify({ records, offset: "page-two" })); return;
    }
    records[0] = { id: "recSecond", fields: { ...fields, name: "Second fixture brand", slug: "second" } };
  }
  res.end(JSON.stringify({ records }));
});
try {
  fixture.listen(0, "127.0.0.1");
  await once(fixture, "listening");
  fixtureOrigin = `http://127.0.0.1:${fixture.address().port}`;
  await rm(path.join(root, ".next"), { recursive: true, force: true });
  const buildArgs = process.argv.slice(2);
  const build = spawn("npm", ["run", "build", "--", ...(buildArgs.length ? buildArgs : ["--webpack"])], {
    cwd: root, stdio: "inherit", env: { ...process.env, AIRTABLE_API_KEY: "fixture-only",
      AIRTABLE_BASE_ID: "fixture", AIRTABLE_ENDPOINT_URL: fixtureOrigin },
  });
  assert.equal((await once(build, "exit"))[0], 0);
  assert.equal(airtableRequests, 10, "Build reads nine datasets plus one pagination page, independent of brand renders");
  runtime = true; // Simulate a blocked API for all visitor requests.
  const manifest = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
  for (const route of ["/", ...categories.map((id) => `/categoria/${id}`), "/marca/fixture", "/marca/second"]) {
    assert.ok(manifest.routes[route], `${route} must remain prerendered`);
    assert.equal(manifest.routes[route].initialRevalidateSeconds, false, "No timed ISR refreshes");
    const html = await readFile(`.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`, "utf8");
    assert.match(html, /data:image\/webp;base64,/);
    assert.doesNotMatch(html, /data:image\/png;base64,/);
    assert.ok(Buffer.byteLength(html) < 100_000, `${route} fixture HTML unexpectedly large`);
    console.log(`${route}: ${Buffer.byteLength(html)} HTML bytes, static`);
  }
  assert.ok(imageRequests > 0);
  assert.equal(manifest.dynamicRoutes["/categoria/[id]"].fallback, false,
    "Unknown category paths must not be generated on demand");
  assert.equal(manifest.dynamicRoutes["/marca/[id]"].fallback, false,
    "Unknown brand paths must not be generated on demand");
  const functionsManifest = JSON.parse(await readFile(".next/server/functions-config-manifest.json", "utf8"));
  const proxyMatchers = functionsManifest.functions["/_middleware"].matchers;
  assert.ok(proxyMatchers.length, "Build must emit the Proxy matcher");
  const matchesProxy = getMiddlewareRouteMatcher(proxyMatchers);
  for (const id of categories) {
    for (const suffix of ["", "/"]) {
      assert.equal(matchesProxy(`/categoria/${id}${suffix}`, { headers: {} }, {}), false,
        "Compiled routing must skip Proxy for canonical categories, including a trailing slash");
    }
  }

  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "0"], {
    cwd: root, stdio: ["ignore", "pipe", "inherit"], env: { ...process.env,
      AIRTABLE_API_KEY: "fixture-only", AIRTABLE_BASE_ID: "fixture", AIRTABLE_ENDPOINT_URL: fixtureOrigin },
  });
  const origin = await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Server startup timed out")), 30_000);
    server.once("exit", () => { clearTimeout(timeout); reject(new Error("Server exited before readiness")); });
    server.stdout.on("data", (chunk) => {
      output += chunk;
      if (output.includes("Ready in")) {
        const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (address) { clearTimeout(timeout); resolve(address); }
      }
    });
  });
  const beforeRequests = airtableRequests;
  for (const [route, name] of [["/", "Fixture brand"], ["/marca/fixture", "Fixture brand"], ["/marca/second", "Second fixture brand"]]) {
    const response = await fetch(`${origin}${route}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(name));
    if (route.startsWith("/marca/")) assert.ok(html.includes(`Marca sostenible: ${name} ~ comprasostenible.co`));
  }
  for (const id of ["no-existe", "constructor", "__proto__", "fixture-nonexistent", 'invalid%22slug']) {
    const response = await fetch(`${origin}/marca/${id}`);
    assert.equal(response.status, 404, `Unknown brand ${id} must return 404`);
    await response.text();
  }
  for (const id of categories) {
    const response = await fetch(`${origin}/categoria/${id}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Fixture brand/);
    const trailingSlash = await fetch(`${origin}/categoria/${id}/`, { redirect: "manual" });
    assert.equal(trailingSlash.status, 308);
    assert.equal(new URL(trailingSlash.headers.get("location"), origin).pathname, `/categoria/${id}`);
  }
  const prefetch = await fetch(`${origin}/categoria/ropa?_rsc=fixture`, {
    headers: { RSC: "1", "Next-Router-Prefetch": "1" },
  });
  assert.equal(prefetch.status, 200);
  assert.match(prefetch.headers.get("content-type"), /text\/x-component/);
  await prefetch.text();
  const invalidCategories = ["accesorios", "no-existe", "constructor", "toString", "__proto__", "ropa-no-existe",
    ...categories.map((id) => id[0].toUpperCase() + id.slice(1)), ...categories.map((id) => id.toUpperCase())];
  for (const id of invalidCategories) {
    assert.equal(matchesProxy(`/categoria/${id}`, { headers: {} }, {}), true,
      `${id} must match the compiled Proxy rule`);
    const response = await fetch(`${origin}/categoria/${id}`);
    assert.equal(response.status, 404, `${id} must return HTTP 404`);
    const html = await response.text();
    assert.match(html, /This page could not be found/);
    assert.doesNotMatch(html, /Marcas sostenibles de undefined/);
  }
  assert.equal(airtableRequests, beforeRequests,
    "Static pages and invalid brand/category URLs must make zero runtime Airtable requests");
  console.log(`PASS: six static categories return HTTP 200; ${invalidCategories.length} invalid IDs (including case variants) return HTTP 404; zero runtime Airtable calls.`);
  console.log("PASS: compiled matcher skips all canonical category paths and trailing slashes; slash redirects and RSC prefetch still work.");
  console.log("PASS: 10 build API calls including pagination; home, categories and both brands prerender; unknown brands return 404; no timed ISR or runtime API calls.");
} finally {
  if (server && server.exitCode === null) {
    server.kill();
    await once(server, "exit");
  }
  fixture.closeAllConnections();
  await new Promise((resolve) => fixture.close(resolve));
  // Never leave a fixture build that could accidentally be deployed.
  await rm(path.join(root, ".next"), { recursive: true, force: true });
  await rm(path.join(root, ".catalog"), { recursive: true, force: true });
}

import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile, rm } from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";

const root = process.cwd();
const logo = await sharp({ create: { width: 1200, height: 600, channels: 4, background: "#118877" } }).png().toBuffer();
let fixtureOrigin;
let imageRequests = 0;
let airtableRequests = 0;
let server;
const categories = ["ropa", "calzado", "higiene", "muebles", "limpieza", "peques"];
const fixture = createServer((req, res) => {
  if (req.url.startsWith("/logo")) {
    imageRequests++;
    res.setHeader("Content-Type", "image/png"); res.end(logo); return;
  }
  airtableRequests++;
  const certificate = req.url.includes("Certificados");
  const fields = certificate
    ? { name: "Fixture certificate", url: "https://example.invalid", logo: [{ url: `${fixtureOrigin}/logo` }] }
    : { name: "Fixture brand", slug: "fixture", type: "ropa", location: "Barcelona",
        production: ["España"], description: "Fixture description", url: "https://example.invalid",
        certificates: ["recCertificate"], logo: [{ url: `${fixtureOrigin}/logo` }] };
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ records: [{ id: certificate ? "recCertificate" : "recBrand", fields }] }));
});
try {
  fixture.listen(0, "127.0.0.1");
  await once(fixture, "listening");
  fixtureOrigin = `http://127.0.0.1:${fixture.address().port}`;
  await rm(path.join(root, ".next"), { recursive: true, force: true });
  const build = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], {
    cwd: root, stdio: "inherit", env: { ...process.env, AIRTABLE_API_KEY: "fixture-only",
      AIRTABLE_BASE_ID: "fixture", AIRTABLE_ENDPOINT_URL: fixtureOrigin },
  });
  assert.equal((await once(build, "exit"))[0], 0);
  const manifest = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
  for (const route of ["/", ...categories.map((id) => `/categoria/${id}`), "/marca/fixture"]) {
    assert.ok(manifest.routes[route], `${route} must remain prerendered`);
    const html = await readFile(`.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`, "utf8");
    assert.match(html, /data:image\/webp;base64,/);
    assert.doesNotMatch(html, /data:image\/png;base64,/);
    assert.ok(Buffer.byteLength(html) < 100_000, `${route} fixture HTML unexpectedly large`);
    console.log(`${route}: ${Buffer.byteLength(html)} HTML bytes, static`);
  }
  assert.ok(imageRequests > 0);
  assert.equal(manifest.dynamicRoutes["/categoria/[id]"].fallback, false,
    "Unknown category paths must not be generated on demand");

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
  for (const id of categories) {
    const response = await fetch(`${origin}/categoria/${id}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Fixture brand/);
  }
  for (const id of ["accesorios", "no-existe", "constructor", "toString", "__proto__", "ropa-no-existe"]) {
    const response = await fetch(`${origin}/categoria/${id}`);
    assert.equal(response.status, 404, `${id} must return HTTP 404`);
    const html = await response.text();
    assert.match(html, /This page could not be found/);
    assert.doesNotMatch(html, /Marcas sostenibles de undefined/);
  }
  assert.equal(airtableRequests, beforeRequests,
    "Static valid pages and invalid categories must make zero runtime Airtable requests");
  console.log("PASS: six static categories return HTTP 200; six unknown IDs return HTTP 404; zero runtime Airtable calls.");
  console.log("PASS: home, categories and brand detail still prerender with compact durable logos.");
} finally {
  if (server && server.exitCode === null) {
    server.kill();
    await once(server, "exit");
  }
  fixture.closeAllConnections();
  await new Promise((resolve) => fixture.close(resolve));
  // Never leave a fixture build that could accidentally be deployed.
  await rm(path.join(root, ".next"), { recursive: true, force: true });
}

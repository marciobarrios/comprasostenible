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
const fixture = createServer((req, res) => {
  if (req.url.startsWith("/logo")) {
    imageRequests++;
    res.setHeader("Content-Type", "image/png"); res.end(logo); return;
  }
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
  for (const route of ["/", "/categoria/ropa", "/marca/fixture"]) {
    assert.ok(manifest.routes[route], `${route} must remain prerendered`);
    const html = await readFile(`.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`, "utf8");
    assert.match(html, /data:image\/webp;base64,/);
    assert.doesNotMatch(html, /data:image\/png;base64,/);
    assert.ok(Buffer.byteLength(html) < 100_000, `${route} fixture HTML unexpectedly large`);
    console.log(`${route}: ${Buffer.byteLength(html)} HTML bytes, static`);
  }
  assert.ok(imageRequests > 0);
  console.log("PASS: home, categories and brand detail still prerender with compact durable logos.");
} finally {
  fixture.closeAllConnections();
  await new Promise((resolve) => fixture.close(resolve));
  // Never leave a fixture build that could accidentally be deployed.
  await rm(path.join(root, ".next"), { recursive: true, force: true });
}

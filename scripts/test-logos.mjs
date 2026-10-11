import assert from "node:assert/strict";
import sharp from "sharp";
import { compactLogo, logoDataUri, FALLBACK_LOGO, MAX_LOGO_BYTES } from "../lib/logo.ts";
const raw = Buffer.alloc(1200 * 600 * 4);
for (let i = 0; i < raw.length; i += 4) {
  raw[i] = i % 251; raw[i + 1] = (i >> 8) % 251; raw[i + 2] = 70; raw[i + 3] = 180;
}
const input = await sharp(raw, { raw: { width: 1200, height: 600, channels: 4 } }).png().toBuffer();
const uri = await compactLogo(input);
assert.match(uri, /^data:image\/webp;base64,/);
const output = Buffer.from(uri.split(",")[1], "base64");
const meta = await sharp(output).metadata();
assert.ok(meta.width <= 320 && meta.height <= 320);
assert.equal(meta.width / meta.height, 2);
assert.equal(meta.hasAlpha, true);
assert.ok(output.length <= MAX_LOGO_BYTES);
assert.ok(output.length < input.length / 2);
console.log(`Fixture: ${input.length} source bytes → ${output.length} WebP bytes (${uri.length} data URI characters)`);
const small = await sharp({ create: { width: 32, height: 16, channels: 4, background: "red" } }).png().toBuffer();
assert.equal((await sharp(Buffer.from((await compactLogo(small)).split(",")[1], "base64")).metadata()).width, 32);
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async () => new Response(input);
  const durable = await logoDataUri("https://fixture.invalid/logo?expires=soon");
  assert.equal(durable, uri);
  globalThis.fetch = async () => new Response("expired", { status: 403 });
  assert.ok((await sharp(Buffer.from(durable.split(",")[1], "base64")).metadata()).width > 0,
    "Saved image must still decode after the attachment URL expires");
  assert.equal(await logoDataUri("https://fixture.invalid/expired"), FALLBACK_LOGO);
  globalThis.fetch = async () => new Response("not an image");
  assert.equal(await logoDataUri("https://fixture.invalid/bad"), FALLBACK_LOGO);
  globalThis.fetch = async () => new Response(Buffer.alloc(8 * 1024 * 1024 + 1));
  assert.equal(await logoDataUri("https://fixture.invalid/large"), FALLBACK_LOGO);
} finally { globalThis.fetch = originalFetch; }
console.log("PASS: bounded size, aspect ratio, transparency, no upscale, persistent images, safe failure.");

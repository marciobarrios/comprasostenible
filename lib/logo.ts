import sharp from "sharp";

// Airtable attachment URLs expire. Keep a durable image in the static page,
// but never embed a full-resolution original or persist its signed source URL.
export const MAX_LOGO_BYTES = 12 * 1024;
const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
export const FALLBACK_LOGO = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#f5f5f4"/><text x="80" y="88" text-anchor="middle" font-size="14" fill="#57534e">Sin logo</text></svg>'
);

export async function compactLogo(input: Buffer): Promise<string> {
  // 320px is 2x the largest rendered brand logo; retain alpha and aspect ratio.
  for (const [size, quality] of [[320, 80], [240, 70], [160, 60]]) {
    const output = await sharp(input, { limitInputPixels: 40_000_000, animated: false })
      .rotate()
      .resize(size, size, { fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();
    if (output.length <= MAX_LOGO_BYTES) return `data:image/webp;base64,${output.toString("base64")}`;
  }
  // Do not let an unusually noisy logo recreate a multi-megabyte HTML page.
  return FALLBACK_LOGO;
}

export async function logoDataUri(url: string): Promise<string> {
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!response.ok || !response.body) throw new Error("Logo unavailable");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_SOURCE_BYTES) throw new Error("Logo too large");
        chunks.push(value);
      }
    } finally {
      await reader.cancel();
    }
    return await compactLogo(Buffer.concat(chunks));
  } catch {
    // A stable placeholder is preferable to a URL that silently expires.
    // Never log the attachment URL: its query contains temporary credentials.
    console.warn("A logo could not be optimized; using a stable placeholder.");
    return FALLBACK_LOGO;
  }
}

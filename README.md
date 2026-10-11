# Compra sostenible

A project to find ethical brands in Spain, available at https://comprasostenible.co

Written using Next.js, Airtable, React, Typescript and Tailwind CSS.

## Compact, durable logos

Airtable attachment URLs expire. Brand and certificate logos are resized to at
most 320px (twice their largest rendered size), preserving aspect ratio and
transparency, then encoded as WebP. Each encoded image is capped at 12 KiB
(about 16 KiB as a base64 URI). Complex images retry at 240px/70 and 160px/60;
invalid, oversized or unavailable sources use a stable “Sin logo” placeholder.
Downloads have a 10-second timeout and an 8 MiB byte limit; decoding has a
40-megapixel limit. Animated originals become a still image.

Only the compact result is persisted with `unstable_cache`; original downloads
use `no-store` inside that boundary. Pages remain statically generated, so this
must not create a new render on every visit. The source attachment URL identifies
the cache entry: replacing it and rebuilding updates the logo. Persistent failures
can leave a cached placeholder until the attachment changes or that cache is
invalidated. A durable external image store would also remove repeated inline
bytes across pages, but would require storage/configuration outside this change.

Run `npm run test:logos` on Node 22.18+ for size, transparency, aspect ratio,
failure and expired-URL persistence checks. `npm run test:build` starts a local
Airtable/image fixture and verifies production prerendering of home, category
and brand pages. It recreates/removes `.next`; stop local dev servers first.
No real Airtable credentials or production requests are needed.

Before deploying, visually review representative text, transparent and animated
logos in a preview. Compare HTML/RSC bytes and Vercel origin transfer over dated,
equivalent traffic windows. The synthetic size reduction is not a measured
production billing reduction; base64 still has overhead and repeats in pages.

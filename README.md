# Compra sostenible

A project to find ethical brands in Spain, available at https://comprasostenible.co

Written using Next.js, Airtable, React, Typescript and Tailwind CSS.

## Publish-only catalogue refresh

Use Node 22.18+ and `npm run build` to publish. Its `prebuild` step reads Airtable
once into a local `.catalog/snapshot.json`, before Next starts its parallel build
workers. Configure `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` in the deployment
environment (or `.env.local` locally). The generated snapshot is ignored by Git
and is not a public asset. `npm run dev` also prepares a fresh snapshot on startup;
restart it to pick up Airtable edits. Do not bypass preparation with `next build`
or `next dev` directly. Vercel's build command should stay `npm run build`.

The snapshot reads the `default` and `home` brand views, the six category views,
and the certificates table once each. This preserves Airtable view filters and
ordering. At up to 100 records per dataset, it costs **9 API calls per build**,
instead of `8 + 3 × number of brand pages` (212 calls for 68 brands). Each extra
100-record page adds one call. Preview builds and local dev starts count too.
For example, 10 production/preview builds cost about 90 calls, and 30 builds
about 270, before other integrations or development use. There is a hard cap of
50 calls per preparation, requests are spaced below Airtable's per-base rate
limit, and quota errors are not retried.

Pages and metadata read only this snapshot. Home, categories, and brands remain
prerendered with no timed revalidation. Unknown brand/category URLs cannot query
Airtable or generate new catalogue pages on demand. Airtable edits, including
new brands, appear only after the next successful publish. No cron is needed.
Compact logos remain cached as described below, keeping the previous transfer
size improvement. Static delivery still uses Vercel bandwidth and requests; this
does not promise zero Vercel usage.

An API failure, incomplete fetch, duplicate slug, or empty default brand view
stops preparation and therefore the publish. It does not turn errors into empty
pages or false 404s. The previous successful Vercel deployment remains live. If
the monthly API quota is exhausted, avoid repeated redeploys; wait for the quota
reset or resolve it in Airtable before publishing. Do not clear the live cache
to try to fix an upstream quota limit.

`npm run test:catalog` checks pagination, view ordering, failure behavior, and
the request budget. `npm run test:build` uses only a local fixture, asserts the
exact build request count across multiple brand pages, checks there is no timed
ISR, and verifies successful pages and unknown URLs with the fixture API blocked
after building. These checks do not consume real Airtable calls.

The investigation branch `codex/bound-airtable-build-usage` has automatic Vercel
deployments disabled in `vercel.json` while the October 2026 API quota is blocked.
This does not disable production deployments from `main` or other branches.
Remove that branch-specific entry when the quota is available and a real-data
preview is needed; validate it before merging. The fixture build test also accepts
`npm run test:build -- --turbopack` to exercise Vercel's production bundler.

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

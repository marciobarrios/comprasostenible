import { unstable_cache } from "next/cache";
import { logoDataUri } from "./logo";

// Cache the compact result, not the original image. The source URL is part of
// the key, so replacing an attachment gets a new entry on the next page build.
// This boundary also keeps the inner no-store fetch from making pages dynamic.
export const cachedLogoDataUri = unstable_cache(logoDataUri, ["compact-logo-v1"]);

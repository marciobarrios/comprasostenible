import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Brand, Certificate } from "types";
import type { CATEGORIES } from "./categories";
import { cachedLogoDataUri } from "./cached-logo";

interface Catalog {
  brands: Brand[];
  home: Brand[];
  categories: Record<keyof typeof CATEGORIES, Brand[]>;
  certificates: Certificate[];
}

// No network access here. Build workers and metadata read the same prepared
// snapshot; visitors (including bots requesting unknown URLs) never use the API.
let catalog: Promise<Catalog> | undefined;
function getCatalog(): Promise<Catalog> {
  return catalog ??= readFile(path.join(process.cwd(), ".catalog/snapshot.json"), "utf8")
    .then((contents) => JSON.parse(contents));
}

async function withLogo<T extends Brand | Certificate>(record: T): Promise<T> {
  const logo = record.fields.logo;
  if (!logo?.length) return record;
  return {
    ...record,
    fields: {
      ...record.fields,
      logo: [{ ...logo[0], url: await cachedLogoDataUri(logo[0].url) }, ...logo.slice(1)],
    },
  };
}

export async function getBrandSlugs() {
  return (await getCatalog()).brands.map(({ fields }) => fields.slug).filter(Boolean);
}

export async function getBrandName(slug: string) {
  return (await getCatalog()).brands.find(({ fields }) => fields.slug === slug)?.fields.name;
}

export async function getBrands(view: "home" | keyof typeof CATEGORIES) {
  const data = await getCatalog();
  return Promise.all((view === "home" ? data.home : data.categories[view]).map(withLogo));
}

export async function getBrand(slug: string) {
  const data = await getCatalog();
  const record = data.brands.find(({ fields }) => fields.slug === slug);
  if (!record) return null;
  const brand = await withLogo(record);
  return {
    ...brand,
    fields: {
      ...brand.fields,
      allCertificates: await Promise.all(data.certificates.map(withLogo)),
    },
  };
}

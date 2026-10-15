import { BrandSummary } from "components/brand";
import { Title } from "components/title";
import { CATEGORIES, Categories } from "components/categories";
import { base } from "lib/airtable";
import { Brand } from "types";
import { Metadata } from "next";
import { cachedLogoDataUri } from "lib/cached-logo";
import { notFound } from "next/navigation";

// Only the categories generated below have corresponding Airtable views.
export const dynamicParams = false;

function getCategory(id: string): keyof typeof CATEGORIES {
  if (!Object.prototype.hasOwnProperty.call(CATEGORIES, id)) {
    notFound();
  }
  return id as keyof typeof CATEGORIES;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({
    id: category,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = getCategory(id);
  return {
    title: `Marcas sostenibles de ${CATEGORIES[category]} ~ comprasostenible.co`,
  };
}

async function getBrands(categoryId: keyof typeof CATEGORIES) {
  const records = await base("Marcas").select({ view: categoryId }).all();

  const brands = (await Promise.all(
    records.map(async (record) => {
      const fields = record.fields;
      if (fields.logo && Array.isArray(fields.logo) && fields.logo.length > 0) {
        fields.logo[0].url = await cachedLogoDataUri(fields.logo[0].url);
      }
      return {
        id: record.id,
        fields: fields,
      };
    })
  )) as unknown as Brand[];

  return brands;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = getCategory(id);
  const brands = await getBrands(category);

  return (
    <>
      <Title>
        Marcas sostenibles de{" "}
        <span className="font-extrabold text-neutral-900">
          {CATEGORIES[category]}
        </span>{" "}
      </Title>

      <ul className="xl:flex xl:flex-wrap items-start justify-between">
        {brands.map((brand) => (
          <li
            key={brand.id}
            className="mt-8 md:mt-16 xl:mt-0 xl:mb-16 first:mt-0 xl:w-xl"
          >
            <BrandSummary brand={brand} />
          </li>
        ))}
      </ul>

      <div className="h-1 border-b border-gray-200 my-10" />

      <Title>Explorar otras categorías</Title>
      <Categories exclude={category} />
    </>
  );
}

import { BrandSummary } from "components/brand";
import { Title } from "components/title";
import { CATEGORIES, Categories } from "components/categories";
import { getBrands } from "lib/airtable";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isCategory } from "lib/categories";

// Only the categories generated below have corresponding Airtable views.
export const dynamicParams = false;

function getCategory(id: string): keyof typeof CATEGORIES {
  if (!isCategory(id)) {
    notFound();
  }
  return id;
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

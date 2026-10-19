import { Brand } from "components/brand";
import { Title } from "components/title";
import { Categories, CATEGORIES } from "components/categories";
import { getBrand, getBrandName, getBrandSlugs } from "lib/airtable";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// New brands appear on the next publish; unknown paths never query Airtable.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getBrandSlugs()).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const name = await getBrandName(id);
  return name ? { title: `Marca sostenible: ${name} ~ comprasostenible.co` } : {};
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrand(id);

  if (!brand) {
    notFound();
  }

  const category = brand.fields.type as keyof typeof CATEGORIES;

  return (
    <>
      <Brand brand={brand} />

      <div className="h-1 border-b border-gray-200 my-10" />

      <Title>Explorar otras categorías</Title>
      <Categories exclude={category} />
    </>
  );
}

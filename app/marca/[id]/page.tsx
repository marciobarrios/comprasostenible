import { Brand } from "components/brand";
import { Title } from "components/title";
import { Categories, CATEGORIES } from "components/categories";
import { base } from "lib/airtable";
import { Brand as BrandType, Certificate } from "types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const records = await base("Marcas")
      .select({ view: "default", fields: ["slug"] })
      .all();

    return records
      .map((record) => ({
        id: record.get("slug") as string,
      }))
      .filter((param) => param.id);
  } catch (error) {
    console.error("Error fetching paths:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const brandRecords = await base("Marcas")
      .select({
        view: "default",
        filterByFormula: `slug="${id}"`,
        maxRecords: 1,
      })
      .all();

    if (brandRecords.length === 0) {
      return {};
    }

    const brandName = brandRecords[0].fields.name;
    return {
      title: `Marca sostenible: ${brandName} ~ comprasostenible.co`,
    };
  } catch (error) {
    return {};
  }
}

async function getBrand(slug: string) {
  try {
    const brandRecords = await base("Marcas")
      .select({
        view: "default",
        filterByFormula: `slug="${slug}"`,
        maxRecords: 1,
      })
      .all();

    if (brandRecords.length === 0) {
      return null;
    }

    const brandRecord = brandRecords[0];
    const brand = {
      id: brandRecord.id,
      fields: brandRecord.fields,
    } as unknown as BrandType;

    const certificateRecords = await base("Certificados").select().all();
    const certificates = certificateRecords.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    const brandWithCertificates = {
      ...brand,
      fields: {
        ...brand.fields,
        allCertificates: (certificates || []) as Certificate[],
      },
    };

    return brandWithCertificates;
  } catch (error) {
    console.error("Error fetching brand details:", error);
    return null;
  }
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

      <div className="h-1 border-b my-10" />

      <Title>Explorar otras categorías</Title>
      <Categories exclude={category} />
    </>
  );
}

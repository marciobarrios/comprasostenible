import { Brand } from "components/brand";
import { Layout } from "components/layout";
import { Title } from "components/title";
import { CATEGORIES, Categories } from "components/categories";
import { base } from "lib/airtable";

import { GetStaticProps, GetStaticPaths } from "next";
import type { BrandProps, Brand as BrandType, Certificate } from "../../types";

export default function BrandDetail({ brand }: BrandProps) {
  const category = brand.fields.type as keyof typeof CATEGORIES;

  return (
    <Layout
      title={`Marca sostenible: ${brand.fields.name} ~ comprasostenible.co`}
    >
      <Brand brand={brand} />

      <div className="h-1 border-b my-10" />

      <Title>Explorar otras categorías</Title>
      <Categories exclude={category} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const records = await base("Marcas")
      .select({ view: "default", fields: ["slug"] })
      .all();

    return {
      paths: records.map((record) => ({
        params: { id: record.get("slug") as string },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error("Error fetching paths:", error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const brandRecords = await base("Marcas")
      .select({
        view: "default",
        filterByFormula: `slug="${params!.id}"`,
        maxRecords: 1,
      })
      .all();

    if (brandRecords.length === 0) {
      return { notFound: true };
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

    // Pass post data to the page via props
    return { props: { brand: brandWithCertificates } };
  } catch (error) {
    console.error("Error fetching brand details:", error);
    return { notFound: true };
  }
};

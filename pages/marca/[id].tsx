import { Brand } from "components/brand";
import { Layout } from "components/layout";
import { Title } from "components/title";
import { CATEGORIES, Categories } from "components/categories";

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
  const res = await fetch(
    `${process.env.API_BRANDS}&view=default&fields=slug&perPage=all`
  );
  const brands = await res.json();

  // Pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: brands.records.map((brand: BrandType) => {
      return ({
        params: {
          id: brand.fields.slug
        },
      })
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const brandResBySlug = await fetch(`${process.env.API_BRANDS}&view=default&filterByFormula=slug="${params!.id}"`);
  const CertificatesRes = await fetch(process.env.API_CERTIFICATES!);

  const brandBySlug = await brandResBySlug.json();
  const brand = brandBySlug.records[0] as BrandType
  const certificates = await CertificatesRes.json();

  const brandWithCertificates = {
    ...brand,
    fields: {
      ...brand.fields,
      allCertificates: certificates.records as Certificate[],
    },
  };

  // Pass post data to the page via props
  return { props: { brand: brandWithCertificates } };
};

import { Brand } from "components/brand";
import { Layout } from "components/layout";
import { Title } from "components/title";
import { CATEGORIES, Categories } from "components/categories";

import { GetStaticProps, GetStaticPaths } from "next";
import type { BrandProps, Brand as BrandType } from "../../types";

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
    `${process.env.AIRTABLE_API}&view=default&fields=name&perPage=all`
  );
  const brands = await res.json();

  // Pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: brands.records.map((brand: BrandType) => ({
      params: {
        id: brand.id,
        // Returns the brand name without accents or diacritics, and replacing
        // spaces for dashes, so we can use it in the URL
        // name: brand.fields.name
        //   .normalize("NFD")
        //   .replace(/\p{Diacritic}/gu, "")
        //   .replace(/\s/g, "-"),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`${process.env.AIRTABLE_API}&id=${params!.id}`);
  const brand: BrandType = await res.json();

  // TODO: check brand certificates and retrieve them from the table

  // Pass post data to the page via props
  return { props: { brand } };
};

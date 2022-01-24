import { BrandSummary } from "components/brand";
import { Layout } from "components/layout";
import { Title } from "components/title";
import { Categories } from "components/categories";

import { GetStaticProps } from "next";
import type { BrandsProps } from "types";

export default function Home({ brands }: BrandsProps) {
  return (
    <Layout isHome>
      <Title>Categorías</Title>

      <Categories />

      <Title className="mt-16">Marcas destacadas</Title>
      <ul>
        {brands.map((brand) => (
          <li key={brand.id} className="mt-8 md:mt-16 first:mt-0">
            <BrandSummary brand={brand} />
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.AIRTABLE_API}&view=home`);
  const brands = await res.json();

  // Pass post data to the page via props
  return { props: { brands: brands.records } };
};

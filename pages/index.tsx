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
      <ul className="xl:flex xl:flex-wrap items-start justify-between">
        {brands.map((brand) => (
          <li
            key={brand.id}
            className="mt-8 md:mt-16 xl:mt-0 xl:mb-16 first:mt-0 xl:w-[36rem]"
          >
            <BrandSummary brand={brand} />
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch(`${process.env.API_BRANDS}&view=home`);

    if (!res.ok) {
      console.error(`Failed to fetch brands: ${res.status} ${res.statusText}`);
      return { props: { brands: [] } };
    }

    const brands = await res.json();
    return { props: { brands: brands.records || [] } };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { props: { brands: [] } };
  }
};

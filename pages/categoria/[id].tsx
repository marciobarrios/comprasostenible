import { BrandSummary } from "components/brand";
import { Layout } from "components/layout";
import { Title } from "components/title";
import { CATEGORIES, Categories } from "components/categories";

import { GetStaticProps, GetStaticPaths } from "next";
import type { BrandsProps } from "../../types";

export default function Type({ brands }: BrandsProps) {
  const category = brands[0].fields.type as keyof typeof CATEGORIES;

  return (
    <Layout
      title={`Marcas sostenibles de ${CATEGORIES[category]} ~ comprasostenible.co`}
    >
      <Title>
        Marcas sostenibles de{" "}
        <span className="font-extrabold text-neutral-900">
          {CATEGORIES[category]}
        </span>{" "}
      </Title>

      <ul className="xl:flex xl:flex-wrap items-start justify-between">
        {brands.map((brand) => (
          <li key={brand.id} className="mt-8 md:mt-16 xl:mt-0 xl:mb-16 first:mt-0 xl:w-[36rem]">
            <BrandSummary brand={brand} />
          </li>
        ))}
      </ul>

      <div className="h-1 border-b my-10" />

      <Title>Explorar otras categorías</Title>
      <Categories exclude={category} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(CATEGORIES).map((category) => ({
    params: { id: category },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(
    `${process.env.API_BRANDS}&view=${params!.id}&perPage=all`
  );
  const brands = await res.json();

  // Pass post data to the page via props
  return { props: { brands: brands.records } };
};

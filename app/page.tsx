import { BrandSummary } from "components/brand";
import { Title } from "components/title";
import { Categories } from "components/categories";
import { getBrands } from "lib/airtable";

export default async function Home() {
  const brands = await getBrands("home");

  return (
    <>
      <Title>Categorías</Title>

      <Categories />

      <Title className="mt-16">Marcas destacadas</Title>
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
    </>
  );
}

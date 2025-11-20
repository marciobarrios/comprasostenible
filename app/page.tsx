import { BrandSummary } from "components/brand";
import { Title } from "components/title";
import { Categories } from "components/categories";
import { base } from "lib/airtable";
import { Brand } from "types";

async function getBrands() {
  try {
    const records = await base("Marcas").select({ view: "home" }).all();
    const brands = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    })) as unknown as Brand[];

    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export default async function Home() {
  const brands = await getBrands();

  return (
    <>
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
    </>
  );
}

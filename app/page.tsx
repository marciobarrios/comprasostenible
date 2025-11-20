import { BrandSummary } from "components/brand";
import { Title } from "components/title";
import { Categories } from "components/categories";
import { base } from "lib/airtable";
import { Brand } from "types";
import { urlToBase64 } from "utils";

async function getBrands() {
  try {
    const records = await base("Marcas").select({ view: "home" }).all();
    const brands = (await Promise.all(
      records.map(async (record) => {
        const fields = record.fields;
        if (
          fields.logo &&
          Array.isArray(fields.logo) &&
          fields.logo.length > 0
        ) {
          fields.logo[0].url = await urlToBase64(fields.logo[0].url);
        }
        return {
          id: record.id,
          fields: fields,
        };
      })
    )) as unknown as Brand[];

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

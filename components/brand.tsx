import Link from "next/link";

import { Subtitle } from "components/title";

import type { Brand as BrandType } from "types";

import { IoLocationOutline, IoEarthOutline } from "react-icons/io5";
import { BsBuilding, BsAward, BsShop } from "react-icons/bs";
import { RiRecycleLine, RiMapPinLine } from "react-icons/ri";
import { TiLeaf } from "react-icons/ti";
import { MdOutlineFrontHand } from "react-icons/md";

const SustainabilityIcons = {
  "sin plástico": IoEarthOutline,
  "materiales reciclados": RiRecycleLine,
  "materiales orgánicos": TiLeaf,
  activismo: BsAward,
  "colaboración ONGs": BsAward,
  "hecho a mano": MdOutlineFrontHand,
  "pequeños productores": BsShop,
  proximidad: RiMapPinLine,
  vegano: TiLeaf,
};

interface LocationsProps {
  location: string;
  production: string[];
}

const Locations = ({ location, production }: LocationsProps) => (
  <ul className="inline-flex">
    <li className="flex pr-4 md:pr-6 md:items-center">
      <IoLocationOutline
        size={32}
        className="hidden md:block text-neutral-400"
      />
      <div className="ml-2">
        <Subtitle className="text-sm">Ubicación</Subtitle>
        {location}
      </div>
    </li>
    <li className="md:border-l flex px-4 md:px-6 md:items-center">
      <BsBuilding size={32} className="hidden md:block text-neutral-400" />
      <div className="ml-2">
        <Subtitle className="text-sm">Producción</Subtitle>
        {production.join(", ")}
      </div>
    </li>
  </ul>
);

export const Brand = ({ brand }: { brand: BrandType }) => (
  <div className="flex items-start">
    <div>
      <div className="mr-4 md:mr-8 p-4 rounded-md bg-white shadow-lg border mb-10">
        <img
          alt={`logo de ${brand.fields.name}`}
          className="w-16 md:w-40 max-w-none aspect-square rounded-md object-scale-down"
          src={brand.fields.logo[0].url}
        />
      </div>

      <Subtitle className="mb-4">Categoría</Subtitle>

      <Link href={`/categoria/${brand.fields.type}`}>
        <a className="py-2 px-3 border rounded-md font-semibold text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600 hover:text-neutral-50 transition-colors">
          {brand.fields.type.replace(/^\w/, (c) => c.toUpperCase())}
          <span className="hidden md:inline"> &rarr;</span>
        </a>
      </Link>
    </div>

    <div>
      <h1 className="text-neutral-800 font-bold text-2xl md:text-4xl">
        {brand.fields.name}
      </h1>

      <a
        href={brand.fields.url}
        className="text-indigo-600 hover:text-stone-600"
      >
        {brand.fields.url}
      </a>

      <p className="text-neutral-500 mt-6 mb-10 text-xl">
        {brand.fields.description}
      </p>

      <Locations
        location={brand.fields.location}
        production={brand.fields.production}
      />

      <Subtitle className="mb-4 mt-12">Medidas sosteniblies</Subtitle>
      {brand.fields.sustainability && (
        <ul className="flex items-stretch gap-4">
          {brand.fields.sustainability.map((highlight) => {
            const Icon =
              SustainabilityIcons[
                highlight as keyof typeof SustainabilityIcons
              ];

            return (
              <li
                className="border p-3 flex flex-initial flex-col items-center rounded-lg bg-neutral-100 justify-center"
                key={highlight}
              >
                <Icon size={24} className="text-green-600" />
                <div className="mt-2 font-semibold text-neutral-800 text-center text-sm">
                  {highlight}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ul className="mt-12 marker:text-indigo-300">
        {(brand.fields.faqs || brand.fields.faqs || brand.fields.blog) && (
          <li>
            <Subtitle>Enlaces para conocer mejor la marca</Subtitle>
            <ul className="list-disc mt-2">
              {brand.fields.manifest && (
                <li>
                  <a
                    href={brand.fields.manifest}
                    className="text-indigo-600 hover:text-stone-600"
                  >
                    Manifiesto
                  </a>
                </li>
              )}
              {brand.fields.faqs && (
                <li className="mt-2">
                  <a
                    href={brand.fields.faqs}
                    className="text-indigo-600 hover:text-stone-600"
                  >
                    Preguntas Frecuentes
                  </a>
                </li>
              )}
              {brand.fields.blog && (
                <li className="mt-2">
                  <a
                    href={brand.fields.blog}
                    className="text-indigo-600 hover:text-stone-600"
                  >
                    Blog
                  </a>
                </li>
              )}
            </ul>
          </li>
        )}
      </ul>

      <ul className="mt-8 marker:text-indigo-300">
        <li>
          <Subtitle>Redes sociales</Subtitle>
          <ul className="list-disc mt-2">
            {brand.fields.facebook && (
              <li>
                <a
                  href={brand.fields.facebook}
                  className="text-indigo-600 hover:text-stone-600"
                >
                  Facebook
                </a>
              </li>
            )}
            {brand.fields.instagram && (
              <li>
                <a
                  href={brand.fields.instagram}
                  className="text-indigo-600 hover:text-stone-600"
                >
                  Instagram
                </a>
              </li>
            )}
            {brand.fields.pinterest && (
              <li>
                <a
                  href={brand.fields.pinterest}
                  className="text-indigo-600 hover:text-stone-600"
                >
                  Pinterest
                </a>
              </li>
            )}
            {brand.fields.twitter && (
              <li>
                <a
                  href={brand.fields.twitter}
                  className="text-indigo-600 hover:text-stone-600"
                >
                  Twitter
                </a>
              </li>
            )}
            {brand.fields.youtube && (
              <li>
                <a
                  href={brand.fields.youtube}
                  className="text-indigo-600 hover:text-stone-600"
                >
                  Youtube
                </a>
              </li>
            )}
          </ul>
        </li>

        {brand.fields.notes && (
          <>
            <Subtitle className="mt-8">Notas</Subtitle>
            <ul className="mt-2 list-disc marker:text-indigo-300">
              {brand.fields.notes
                .split("*")
                .filter(Boolean)
                .map((note, i) => (
                  <li key={i} className="mt-2">
                    {note.trim()}
                  </li>
                ))}
            </ul>
          </>
        )}
      </ul>
    </div>
  </div>
);

export const BrandSummary = ({ brand }: { brand: BrandType }) => (
  <div className="flex items-start">
    <Link href={`/marca/${brand.id}`}>
      <a className="mr-4 md:mr-8 p-4 rounded-md bg-white shadow-lg border">
        <img
          alt={`logo de ${brand.fields.name}`}
          className="w-16 md:w-40 max-w-none aspect-square rounded-md object-scale-down"
          src={brand.fields.logo[0].url}
        />
      </a>
    </Link>

    <div>
      <h3 className="text-neutral-800 font-bold text-xl">
        <Link href={`/marca/${brand.id}`}>
          <a className="p-2 -ml-2 text-indigo-600 hover:text-neutral-50 hover:bg-indigo-600 rounded-md hover:after:content-['→'] after:ml-1 transition-colors">
            {brand.fields.name}
          </a>
        </Link>
      </h3>

      <p className="text-neutral-500 mt-2 mb-8">{brand.fields.description}</p>

      <Locations
        location={brand.fields.location}
        production={brand.fields.production}
      />

      {/* <div className="mt-4">
        <Link href={`/marca/${brand.id}`}>
          <a className="text-indigo-600 font-semibold">
            Ver ficha completa &rarr;
          </a>
        </Link>
      </div> */}
    </div>
  </div>
);

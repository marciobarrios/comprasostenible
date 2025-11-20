import Link from "next/link";

import { Subtitle } from "components/title";

import { wrapURLs } from "utils";

import type { Brand as BrandType } from "types";

import { IoLocationOutline, IoEarthOutline } from "react-icons/io5";
import { BsBuilding, BsAward, BsShop } from "react-icons/bs";
import {
  RiRecycleLine,
  RiMapPinLine,

  // Social
  RiFacebookCircleLine,
  RiTwitterLine,
  RiYoutubeLine,
  RiInstagramLine,
  RiPinterestLine,
} from "react-icons/ri";
import { TiLeaf } from "react-icons/ti";
import { MdOutlineFrontHand } from "react-icons/md";

const socialIcons = {
  facebook: RiFacebookCircleLine,
  twitter: RiTwitterLine,
  youtube: RiYoutubeLine,
  instagram: RiInstagramLine,
  pinterest: RiPinterestLine,
};

const sustainabilityIcons = {
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

const Locations = ({ location = "", production = [] }: LocationsProps) => (
  <ul className="inline-flex">
    <li className="flex pr-4 md:pr-6 md:items-center">
      <IoLocationOutline
        size={32}
        className="hidden md:block text-neutral-400"
      />
      <div className="md:ml-2">
        <Subtitle className="text-sm">Ubicación</Subtitle>
        {location}
      </div>
    </li>
    <li className="md:border-l border-gray-200 flex pl-4 md:pl-6 md:items-center">
      <BsBuilding size={32} className="hidden md:block text-neutral-400" />
      <div className="md:ml-2">
        <Subtitle className="text-sm">Producción</Subtitle>
        {production.join(", ")}
      </div>
    </li>
  </ul>
);

const BrandLogo = ({
  brand,
  className,
}: {
  brand: BrandType;
  className: string;
}) => {
  if (brand.fields.logo?.length) {
    return (
      <img
        alt={`logo de ${brand.fields.name}`}
        className={`${className} object-scale-down`}
        src={brand.fields.logo[0].url}
      />
    );
  }

  return (
    <div
      className={`${className} bg-white flex items-center justify-center text-black font-bold uppercase text-4xl`}
    >
      {brand.fields.name[0]}
    </div>
  );
};

export const Brand = ({ brand }: { brand: BrandType }) => (
  <div className="flex items-start">
    <div className="mr-4 md:mr-8">
      <div className=" p-4 rounded-md bg-white shadow-lg border border-gray-200 mb-10">
        <BrandLogo
          brand={brand}
          className="w-16 md:w-40 max-w-none aspect-square rounded-md"
        />
      </div>

      <Subtitle className="mb-4">Categoría</Subtitle>

      <Link
        href={`/categoria/${brand.fields.type}`}
        className="py-3 px-2 md:px-4 border border-gray-200 rounded-md font-semibold text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600 hover:text-neutral-50 transition-colors"
      >
        {brand.fields.type.replace(/^\w/, (c) => c.toUpperCase())}
        <span className="hidden md:inline"> &rarr;</span>
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

      <p className="text-neutral-500 mt-6 mb-10 text-l md:text-xl">
        {brand.fields.description}
      </p>

      <Locations
        location={brand.fields.location}
        production={brand.fields.production}
      />

      {brand.fields.sustainability && (
        <>
          <Subtitle className="mt-12 mb-4">Medidas sostenibles</Subtitle>
          <ul className="flex flex-wrap md:flex-nowrap items-stretch gap-4">
            {brand.fields.sustainability.map((highlight) => {
              const Icon =
                sustainabilityIcons[
                  highlight as keyof typeof sustainabilityIcons
                ];

              return (
                <li
                  className="border border-gray-200 p-3 flex flex-initial flex-col items-center rounded-lg bg-neutral-100 justify-center"
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
        </>
      )}

      {(brand.fields.faqs || brand.fields.faqs || brand.fields.blog) && (
        <>
          <Subtitle className="mt-12">Conoce la marca</Subtitle>

          <ul className="list-disc mt-2 marker:text-neutral-300">
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
        </>
      )}

      {Object.keys(socialIcons).some(
        (social) => !!brand.fields[social as keyof typeof socialIcons]
      ) && (
        <>
          <Subtitle className="mt-8">Redes sociales</Subtitle>
          <ul className="mt-2 flex items-center gap-4">
            {Object.keys(socialIcons).map((social) => {
              const socialIconIndex = social as keyof typeof socialIcons;
              const Icon = socialIcons[socialIconIndex];

              if (brand.fields[socialIconIndex]) {
                return (
                  <li key={socialIconIndex}>
                    <a
                      href={brand.fields[socialIconIndex]}
                      className="text-indigo-600 hover:text-stone-600"
                    >
                      <Icon size={28} />
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </>
      )}

      {brand.fields.certificates?.length ? (
        <>
          <Subtitle className="mt-8">Certificados</Subtitle>
          <ul className="mt-2 flex flex-wrap items-center gap-4">
            {brand.fields.certificates.map((certificateId) => {
              const certificate = brand.fields.allCertificates?.find(
                (certificate) => certificate.id === certificateId
              );
              return (
                <li key={certificateId}>
                  <a
                    href={certificate?.fields.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      alt={certificate?.fields.name}
                      className="h-10 md:h-20 max-w-20 md:max-w-28 rounded-md object-scale-down"
                      src={certificate?.fields.logo[0].url}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {brand.fields.notes && (
        <>
          <Subtitle className="mt-8">Notas</Subtitle>
          <ul className="mt-2 list-disc marker:text-neutral-300">
            {brand.fields.notes
              .split("*")
              .filter(Boolean)
              .map((note, i) => (
                <li
                  key={i}
                  className="mt-2 break-all"
                  dangerouslySetInnerHTML={{ __html: wrapURLs(note).trim() }}
                />
              ))}
          </ul>
        </>
      )}
    </div>
  </div>
);

export const BrandSummary = ({ brand }: { brand: BrandType }) => (
  <div className="flex items-start">
    <Link
      href={`/marca/${brand.fields.slug}`}
      className="mr-4 md:mr-8 p-4 rounded-md bg-white shadow-lg border border-gray-200"
    >
      <BrandLogo
        brand={brand}
        className="w-16 md:w-40 max-w-none aspect-square rounded-md"
      />
    </Link>

    <div>
      <h3 className="text-neutral-800 font-bold text-xl">
        <Link
          href={`/marca/${brand.fields.slug}`}
          className="p-2 -ml-2 text-indigo-600 hover:text-neutral-50 hover:bg-indigo-600 rounded-md hover:after:content-['→'] after:ml-1 transition-colors"
        >
          {brand.fields.name}
        </Link>
      </h3>

      <p className="text-neutral-500 mt-2 mb-8">{brand.fields.description}</p>

      <Locations
        location={brand.fields.location}
        production={brand.fields.production}
      />
    </div>
  </div>
);

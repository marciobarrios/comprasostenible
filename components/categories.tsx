import Link from "next/link";

export const CATEGORIES = {
  ropa: "Ropa",
  calzado: "Calzado",
  higiene: "Higiene y cosmética",
  muebles: "Muebles y decoración",
  accesorios: "Accesorios",
  peques: "Peques",
};

const Category = ({ name }: { name: keyof typeof CATEGORIES }) => (
  <li className="my-4 md:my-0 flex">
    <Link href={`/categoria/${name}`}>
      <a className="flex text-center items-center py-3 px-4 border rounded-md font-semibold text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600 hover:text-neutral-50 transition-colors">
        {CATEGORIES[name]}
        <span className="md:hidden lg:inline ml-2">&rarr;</span>
      </a>
    </Link>
  </li>
);

export const Categories = ({
  exclude,
}: {
  exclude?: keyof typeof CATEGORIES;
}) => (
  <ul className="md:flex gap-4 justify-between">
    {Object.keys(CATEGORIES).map(
      (category) =>
        exclude !== category && (
          <Category key={category} name={category as keyof typeof CATEGORIES} />
        )
    )}
  </ul>
);

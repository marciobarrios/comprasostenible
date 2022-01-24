import Link from "next/link";

export const Header = () => (
  <div className="flex justify-between items-center text-neutral-600 border-b py-4 px-4 md:px-8">
    {/* <div className="compra-sostenible-background bg-cover bg-center">
          <a
            href="/"
            className="text-3xl font-bold mix-blend-lighten text-black bg-white"
          >
            Compra Sostenible
          </a>
        </div> */}
    <Link href="/">
      {/* <a className="text-xl font-bold">Compra Sostenible</a> */}
      <a className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-green-600">
        Compra Sostenible
      </a>
    </Link>
    <a href="/about" className="text-neutral-500 text-sm">
      Sobre el proyecto
    </a>
  </div>
);

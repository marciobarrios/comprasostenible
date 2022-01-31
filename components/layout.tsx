import { PropsWithChildren } from "react";
import Head from "next/head";

import { Header } from "components/header";
import { Hero } from "components/hero";

import { HiOutlineHeart } from "react-icons/hi";

interface Props {
  title?: string;
  isHome?: boolean;
}

export const Layout = ({
  title = "Marcas sostenibles ~ comprasostenible.co",
  isHome,
  children,
}: PropsWithChildren<Props>) => (
  <div className="bg-neutral-50 min-h-screen antialiased">
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta
        name="description"
        content="Encuentra marcas con principios. Que producen cerca de ti, que se preocupan por contaminar menos o
            que utilizan materiales reciclados. Tú decides como poner tu granito de arena para promover un consumo
            más sostenible."
      />
      <meta name="author" content="Marcio Barrios" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header isHome={isHome} />
    {isHome && <Hero />}

    <main className="text-neutral-600 px-4 md:px-8 py-8 md:py-16 max-w-4xl xl:max-w-7xl m-auto">
      {children}
    </main>
    <footer className="text-neutral-600 px-4 md:px-8 py-8 max-w-4xl xl:max-w-7xl m-auto text-sm flex justify-center items-center">
      Made with <HiOutlineHeart size={16} className="mx-1" /> by{" "}
      <a
        className="text-indigo-600 hover:text-stone-600 ml-1"
        href="http://twitter.com/marciobarrios"
        target="_blank"
        rel="noreferrer"
      >
        Marcio Barrios
      </a>
    </footer>
  </div>
);

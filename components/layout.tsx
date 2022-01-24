import { PropsWithChildren } from "react";
import Head from "next/head";

import { Header } from "components/header";
import { Hero } from "components/hero";

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

    <Header />
    {isHome && <Hero />}

    <main className="text-neutral-600 max-w-4xl m-auto px-4 md:px-8 py-8 md:py-16">
      {children}
    </main>
  </div>
);

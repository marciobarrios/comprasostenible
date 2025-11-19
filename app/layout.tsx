import "../styles/globals.css";
import { Header } from "components/header";
import { HiOutlineHeart } from "react-icons/hi";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Marcas sostenibles ~ comprasostenible.co",
  description:
    "Encuentra marcas con principios. Que producen cerca de ti, que se preocupan por contaminar menos o que utilizan materiales reciclados. Tú decides como poner tu granito de arena para promover un consumo más sostenible.",
  authors: [{ name: "Marcio Barrios" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="bg-neutral-50 min-h-screen antialiased">
          <Header />
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
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex justify-between items-center bg-neutral-900 py-3 px-4">
      <Link
        href="/"
        className="text-l md:text-xl font-extrabold text-neutral-100"
      >
        Compra{" "}
        {isHome ? (
          "Sostenible"
        ) : (
          <span className="before:block before:absolute before:-inset-1 md:before:-skew-y-3 before:bg-indigo-500 relative inline-block">
            <span className="relative text-neutral-100">Sostenible</span>
          </span>
        )}
      </Link>
      <Link href="/el-proyecto" className="text-neutral-300 text-sm">
        El proyecto
      </Link>
    </div>
  );
};

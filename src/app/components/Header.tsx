"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `text-lg font-bold px-4 py-1 rounded-md transition-colors ${
      pathname === path
        ? "bg-white text-black" // link ativo
        : "text-white hover:bg-white hover:text-black"
    }`;

  return (
    <div className="flex items-center gap-4 justify-around w-full max-lg:flex-col">
      <Image src="/logo.png" alt="logo-vel" width={200} height={200} />
      <div className="flex justify-center gap-4 bg-gray-800 rounded-xl px-3 py-2 max-lg:flex-col">
        <Link href="/" className={linkClass("/")}>
          Retificadoras
        </Link>
        <Link href="/Switches" className={linkClass("/Switches")}>
          Switches
        </Link>
        <Link href="/links-dedicados" className={linkClass("/links-dedicados")}>
          Links Dedicados
        </Link>
      </div>
    </div>
  );
}

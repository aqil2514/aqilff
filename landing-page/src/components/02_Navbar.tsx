import { comicRelief, tagesschrift } from "@/app/fonts";
import Image from "next/image";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";

interface NavbarLink {
  url: string;
  label: string;
}

export default function Navbar() {
  return (
    <div className="w-full bg-[#fffbe8] flex justify-between px-4 py-2 items-center">
      {/* Menu, Title, Logo */}
      <div className="flex gap-1 items-center">
        <IoMenu className="block sm:hidden" />
        <figure className="relative md:w-16 md:h-16 w-8 h-8">
          <Image
            src={"/logo.png"}
            fill
            alt="Logo Frozen Food"
            className="object-cover"
          />
        </figure>
        <h1
          className={`font-extrabold text-md sm:text-xl ${tagesschrift.className}`}
        >
          <span className="text-[#df1111]">Aqil</span>{" "}
          <span className="text-[#ffb801]">Frozen </span>{" "}
          <span className="text-[#df1111]">Food</span>
        </h1>
      </div>

      {/* Navbar Links */}
      <div className="hidden sm:flex gap-4">
        {Links.map((link, i) => (
          <Link
            href={link.url}
            key={i}
            className={`text-[#df1111] font-semibold duration-200 hover:text-red-500 ${comicRelief.className}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export const Links: NavbarLink[] = [
  {
    label: "Home",
    url: "#home",
  },
  {
    label: "Produk",
    url: "#product",
  },
  {
    label: "Tentang Kami",
    url: "#aboutus",
  },
  {
    label: "Kontak Kami",
    url: "#contactus",
  },
];

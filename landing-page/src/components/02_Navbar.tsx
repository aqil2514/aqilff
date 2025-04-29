"use client";
import { comicRelief, tagesschrift } from "@/app/fonts";
import { Links } from "@/utils/navlinks";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function Navbar() {
  const [onMenuActive, setOnMenuActive] = useState<boolean>(false);
  const menuSheetHandler = () => {
    return setOnMenuActive(true);
  };
  return (
    <div className="w-full bg-[#fffbe8] flex justify-between px-4 py-2 items-center">
      {/* Menu, Title, Logo */}
      <div className="flex gap-1 items-center">
        <IoMenu className="block sm:hidden" onClick={menuSheetHandler} />
        <figure
          className="relative md:w-16 md:h-16 w-8 h-8"
          onClick={menuSheetHandler}
        >
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

      <AndroidMenu onActive={onMenuActive} setOnActive={setOnMenuActive} />

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

const AndroidMenu: React.FC<{
  onActive: boolean;
  setOnActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onActive, setOnActive }) => {
  useEffect(() => {
    window.addEventListener("scroll", () => setOnActive(false));

    return () => window.removeEventListener("scroll", () => setOnActive(false));
  }, [setOnActive]);
  return (
    <div
      className={`absolute top-0 left-0 duration-200 md:hidden z-10 h-full w-full grid grid-cols-[50%_auto] ${
        !onActive && "-translate-x-full"
      }`}
    >
      <div className="w-full bg-red-500 py-12 px-2">
        <p
          className={`text-white ${tagesschrift.className} mb-4 text-xl text-center underline`}
        >
          Menu
        </p>
        <div className="flex flex-col gap-2">
          {Links.map((link, i) => (
            <Link
              href={link.url}
              key={i}
              className={`text-white font-semibold duration-200 hover:text-red-500 ${comicRelief.className}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-black/50" onClick={() => setOnActive(false)} />
    </div>
  );
};

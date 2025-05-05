"use client";
import { comicRelief, tagesschrift, tuffy } from "@/app/fonts";
import { useProductStore } from "@/lib/products-store";
import { homeLinks } from "@/utils/navlinks";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import AndroidMenu from "./MenuAndroid";
import CartMenu from "./MenuCart";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [onMenuActive, setOnMenuActive] = useState<boolean>(false);
  const [onCartActive, setOnCartActive] = useState<boolean>(false);
  const { products } = useProductStore();
  const totalItem = products.length;
  const router = useRouter()

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
          className={`font-extrabold text-md sm:text-xl cursor-pointer ${tagesschrift.className}`}
          onClick={() => router.push("/")}
        >
          <span className="text-[#df1111]">Aqil</span>{" "}
          <span className="text-[#ffb801]">Frozen </span>{" "}
          <span className="text-[#df1111]">Food</span>
        </h1>
      </div>

      <AndroidMenu state={onMenuActive} setState={setOnMenuActive} />
      <CartMenu state={onCartActive} setState={setOnCartActive} />

      {/* Navbar Links */}
      <div className="hidden sm:flex gap-4 items-center">
        {homeLinks.map((link, i) => (
          <Link
            href={link.url}
            key={i}
            className={`text-[#df1111] font-semibold duration-200 hover:text-red-500 ${comicRelief.className}`}
          >
            {link.label}
          </Link>
        ))}
        {/* Ini kalo di Android ga muncul. Jadi sengaja dibuat dua */}
        <button
          className="relative flex gap-1 text-[#df1111] hover:text-red-500 cursor-pointer items-center"
          onClick={() => setOnCartActive(true)}
        >
          {totalItem > 0 && (
            <span
              className={`absolute -top-2 -left-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ${tuffy.className}`}
            >
              {totalItem}
            </span>
          )}
          <FaCartShopping className="text-2xl" />
        </button>
      </div>
      {/* Yang ini harusnya muncul */}
      <button
        className="relative flex md:hidden gap-1 text-[#df1111] hover:text-red-500 cursor-pointer items-center"
        onClick={() => setOnCartActive(true)}
      >
        {totalItem > 0 && (
          <span
            className={`absolute -top-2 -left-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ${tuffy.className}`}
          >
            {totalItem}
          </span>
        )}
        <FaCartShopping className="text-2xl" />
      </button>
    </div>
  );
}

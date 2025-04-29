"use client";
import { comicRelief, poppins, tagesschrift, tuffy } from "@/app/fonts";
import { Links } from "@/utils/navlinks";
import Image from "next/image";
import Link from "next/link";
import React, { SetStateAction, useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

export default function Navbar() {
  const [onMenuActive, setOnMenuActive] = useState<boolean>(false);
  const [onCartActive, setOnCartActive] = useState<boolean>(false);

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

      <AndroidMenu state={onMenuActive} setState={setOnMenuActive} />
      <CartMenu state={onCartActive} setState={setOnCartActive} />

      {/* Navbar Links */}
      <div className="hidden sm:flex gap-4 items-center">
        {Links.map((link, i) => (
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
          className="flex gap-1 text-[#df1111] hover:text-red-500 cursor-pointer items-center"
          onClick={() => setOnCartActive(true)}
        >
          <FaCartShopping className="text-2xl" />
        </button>
      </div>
      {/* Yang ini harusnya muncul */}
      <button
        className="flex md:hidden gap-1 text-[#df1111] hover:text-red-500 cursor-pointer items-center"
        onClick={() => setOnCartActive(true)}
      >
        <FaCartShopping className="text-2xl" />
      </button>
    </div>
  );
}

interface SheetProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const AndroidMenu: React.FC<SheetProps> = ({ state, setState }) => {
  useEffect(() => {
    window.addEventListener("scroll", () => setState(false));

    return () => window.removeEventListener("scroll", () => setState(false));
  }, [setState]);
  return (
    <div
      className={`absolute top-0 left-0 duration-200 md:hidden z-10 h-full w-full grid grid-cols-[50%_auto] ${
        !state && "-translate-x-full"
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
      <div className="bg-black/50" onClick={() => setState(false)} />
    </div>
  );
};

const CartMenu: React.FC<SheetProps> = ({ setState, state }) => {
  return (
    <div
      className={`fixed right-0 top-0 w-full h-screen z-80 duration-200 grid grid-cols-[auto_60%] md:grid-cols-[auto_25%] ${
        !state && "translate-x-full"
      }`}
    >
      <div className="bg-black/50" onClick={() => setState(false)} />
      <div className="bg-red-100 px-1 md:px-4 py-8">
        <h3
          className={`${tuffy.className} text-red-500 !font-bold underline text-center text-xl md:text-3xl`}
        >
          Keranjang Anda
        </h3>
        <CartEmpty setOnCartActive={setState} />
      </div>
    </div>
  );
};

const CartEmpty = ({
  setOnCartActive,
}: {
  setOnCartActive: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const shoppingHandler = () => {
    setOnCartActive(false);
    const productSection = document.getElementById("product")?.offsetTop;
    window.scrollTo({
      top: productSection,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <p
        className={`${poppins.className} text-xs md:text-sm text-center !italic text-slate-500`}
      >
        Barang belanjaan akan muncul di sini
      </p>
      <figure className="relative w-full h-48 md:h-64">
        <Image
          src={"/cart-empty.png"}
          fill
          sizes="auto"
          alt="Empty Item"
          className="cover"
        />
      </figure>
      <p
        className={`${poppins.className} text-xs md:text-sm text-center !italic text-slate-500`}
      >
        Keranjang masih kosong. Anda belum belanja apapun
      </p>
      <hr className="bg-red-500 border-red-500 h-1 my-4" />
      <button
        className="bg-red-500 text-white p-2 rounded-2xl duration-200 cursor-pointer hover:bg-red-600 hover:scale-95 active:scale-90"
        onClick={shoppingHandler}
      >
        Ayo Belanja
      </button>
    </div>
  );
};

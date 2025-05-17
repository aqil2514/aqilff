"use client";

import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  return (
    <header className="bg-[#fffbe8] border-b-4 border-red-500 w-full h-12 px-4 pt-4 pb-8 flex gap-4 fixed top-0">
      <SidebarTrigger />
      <h1 className="font-extrabold text-md sm:text-xl">
        <span className="text-[#df1111]">Aqil</span>{" "}
        <span className="text-[#ffb801]">Frozen </span>{" "}
        <span className="text-[#df1111]">Food</span>
      </h1>
    </header>
  );
}

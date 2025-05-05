import { useEffect } from "react";
import { SheetProps } from "./interface";
import { comicRelief, tagesschrift } from "@/app/fonts";
import { homeLinks } from "@/utils/navlinks";
import Link from "next/link";

export default function AndroidMenu({setState, state}:SheetProps){
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
            {homeLinks.map((link, i) => (
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
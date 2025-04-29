import Link from "next/link";
import { Links } from "./02_Navbar";
import { poppins } from "@/app/layout";

export default function Footer() {
  return (
    <footer className="h-auto bg-red-500 text-white px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <LeftSide />
        <RightSide />
      </div>
    </footer>
  );
}

const LeftSide = () => {
  return (
    <span className={`flex flex-wrap gap-4 ${poppins.className} justify-center sm:justify-start`}>
      {Links.map((link, i) => (
        <Link key={i} href={link.url} className="hover:text-yellow-300 transition-all duration-300">
          {link.label}
        </Link>
      ))}
    </span>
  );
};

const RightSide = () => {
  return (
    <div className="text-center sm:text-left">
      {/* Nomor Telepon, Email */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
        <p className={`${poppins.className}`}>+62 857-7488-5367</p>
        <p className={`${poppins.className}`}>muhamadaqil383@gmail.com</p>
      </div>

      {/* CopyRight */}
      <p className={`${poppins.className} text-sm mt-4`}>
        © {new Date().getFullYear()} Aqil Frozen Food. All rights reserved.
      </p>
    </div>
  );
};

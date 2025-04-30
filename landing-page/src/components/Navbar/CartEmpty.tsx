import { poppins } from "@/app/fonts";
import Image from "next/image";
import { SetStateAction } from "react";

export default function CartEmpty({
  setOnCartActive,
}: {
  setOnCartActive: React.Dispatch<SetStateAction<boolean>>;
}) {
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
}

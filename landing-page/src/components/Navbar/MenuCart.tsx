import { useProductStore } from "@/lib/products-store";
import { SheetProps } from "./interface";
import { tuffy } from "@/app/fonts";
import CartEmpty from "./CartEmpty";
import CartProducts from "./CartProducts";

export default function CartMenu({setState, state}:SheetProps) {
  const { products } = useProductStore();
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
        {products.length > 0 ? (
          <CartProducts />
        ) : (
          <CartEmpty setOnCartActive={setState} />
        )}
      </div>
    </div>
  );
};
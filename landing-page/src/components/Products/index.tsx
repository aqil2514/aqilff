"use client";
import { Product } from "@/@types/interfaces";
import { comicRelief, poppins } from "@/app/fonts";
// import { products } from "@/lib/data";
import { useProductStore } from "@/lib/products-store";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import { BiPlus } from "react-icons/bi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

export default function Products({ products }: { products: Product[] }) {
  const {
    addToCart,
    products: cartProducts,
    increase,
    decrease,
    removeFromCart,
  } = useProductStore();
  return (
    <section
      id="product"
      className="pb-12 bg-gradient-to-b from-red-900 to-orange-400 py-8"
    >
      <h2
        className={`text-center ${comicRelief.className} text-3xl md:text-5xl text-white mb-8`}
      >
        Produk Kami
      </h2>

      {/* Daftar Produk */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-8">
        {products.map((product, i) => {
          const isExist = cartProducts.some((pro) => pro.id === product.id);
          const cartProduct = cartProducts.find((pro) => pro.id === product.id);
          return (
            <figure key={i}>
              {/* Gambar */}
              <div className="relative w-full h-48 md:h-52">
                <Image
                  src={product.image_src}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-xl"
                />
              </div>
              {/* Nama Produk */}
              <p
                className={`${poppins.className} text-xs md:text-lg text-white mt-2 font-semibold`}
              >
                {product.name}
              </p>
              {/* Identitas Produk & CTA */}
              <div className="flex gap-2 justify-start md:justify-between flex-col md:flex-row md:items-center mt-4">
                <p
                  className={`${poppins.className} bg-white/50 text-green-700 px-2 rounded-md font-extrabold`}
                >
                  {formatRupiah(product.price)}
                </p>

                {isExist ? (
                  <div className="flex gap-0 md:gap-8 justify-between">
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 bg-red-500 duration-200 hover:bg-red-600 hover:scale-95 active:scale-90 cursor-pointer  text-white rounded-md"
                        onClick={() => increase(product.id)}
                      >
                        <FaChevronUp />
                      </button>
                      <p
                        className={`text-white ${comicRelief.className} font-semibold`}
                      >
                        {cartProduct?.quantity}
                      </p>
                      <button
                        className="px-2 py-1 bg-red-500 duration-200 hover:bg-red-600 hover:scale-95 active:scale-90 cursor-pointer  text-white rounded-md"
                        onClick={() => decrease(product.id)}
                      >
                        <FaChevronDown />
                      </button>
                    </div>
                    <button
                      className="px-2 py-1 bg-red-500 duration-200 hover:bg-red-600 hover:scale-95 active:scale-90 cursor-pointer  text-white rounded-md"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="flex gap-1 items-center bg-red-500 px-2 py-1 text-white rounded-md cursor-pointer duration-200 hover:scale-95 active:scale-90"
                  >
                    <BiPlus />
                    <p className={`${poppins.className} text-sm md:text-lg`}>
                      Keranjang
                    </p>
                  </button>
                )}
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

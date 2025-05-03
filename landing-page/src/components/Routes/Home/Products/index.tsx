"use client";
import { comicRelief, poppins } from "@/app/fonts";
import { useProductStore } from "@/lib/products-store";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import { BiPlus } from "react-icons/bi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useHomeData } from "@/components/Providers/HomeProvider";

export default function Products() {
  const {
    addToCart,
    products: cartProducts,
    increase,
    decrease,
    removeFromCart,
  } = useProductStore();

  const { products } = useHomeData();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView) setHasAnimated(true);
  }, [inView]);

  return (
    <section
      id="product"
      className="pb-12 bg-gradient-to-b from-red-900 to-orange-400 py-8"
      ref={ref}
    >
      <h2
        className={`text-center ${comicRelief.className} text-3xl md:text-5xl text-white mb-8`}
      >
        Produk Kami
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-8">
        {products.map((product, i) => {
          const isExist = cartProducts.some((pro) => pro.id === product.id);
          const cartProduct = cartProducts.find((pro) => pro.id === product.id);

          return (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
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

              <p
                className={`${poppins.className} text-xs md:text-lg text-white mt-2 font-semibold`}
              >
                {product.name}
              </p>

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
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 hover:scale-95 active:scale-90 text-white rounded-md"
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
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 hover:scale-95 active:scale-90 text-white rounded-md"
                        onClick={() => decrease(product.id)}
                      >
                        <FaChevronDown />
                      </button>
                    </div>
                    <button
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 hover:scale-95 active:scale-90 text-white rounded-md"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="flex gap-1 items-center bg-red-500 px-2 py-1 text-white rounded-md hover:scale-95 active:scale-90"
                  >
                    <BiPlus />
                    <p className={`${poppins.className} text-sm md:text-lg`}>
                      Keranjang
                    </p>
                  </button>
                )}
              </div>
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
}

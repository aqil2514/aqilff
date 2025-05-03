import { poppins, tuffy } from "@/app/fonts";
import { useProductStore } from "@/lib/products-store";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import WAClarification from "./CartWaClarification";
import { sendGAEvent } from "@next/third-parties/google";

export default function CartProducts() {
  const { products, increase, decrease, removeFromCart, clearCart } =
    useProductStore();
  const [waDialogue, setWaDialogue] = useState<boolean>(false);

  const totalItem = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="py-4">
      <div className="p-4 space-y-6 h-96 overflow-y-scroll">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col md:flex-row items-center md:items-start gap-4 border-b pb-4"
          >
            <figure className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
              <Image
                src={product.image_src}
                fill
                sizes="auto"
                alt={`Gambar ${product.name}`}
                className="object-cover"
              />
            </figure>

            <div className="flex-1 w-full">
              <div className="flex justify-between items-start w-full">
                <p
                  className={`font-semibold ${tuffy.className} text-sm md:text-lg line-clamp-1`}
                >
                  {product.name}
                </p>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 hover:text-red-600 transition"
                  title="Hapus dari keranjang"
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>

              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {formatRupiah(product.price)} x {product.quantity}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => decrease(product.id)}
                  className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="text-sm font-medium">{product.quantity}</span>
                <button
                  onClick={() => increase(product.id)}
                  className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t mt-4 text-sm md:text-base space-y-1 text-gray-700">
        <p>
          <span className="font-semibold">Total Item:</span> {totalItem}
        </p>
        <p>
          <span className="font-semibold">Total Harga:</span>{" "}
          {formatRupiah(totalPrice)}
        </p>
      </div>

      <div className="p-4 flex flex-col md:flex-row gap-4">
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-2xl flex gap-2 items-center duration-200 hover:bg-red-600 hover:scale-95 active:scale-90 cursor-pointer"
          onClick={() => clearCart()}
        >
          <MdDeleteForever />
          <p className={`${poppins.className}`}>Bersihkan</p>
        </button>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded-2xl flex gap-2 items-center duration-200 hover:bg-green-600 hover:scale-95 active:scale-90 cursor-pointer"
          onClick={() => {
            sendGAEvent("event", "whatsapp_click", {
              event_category: "engagement",
              event_label: "landing_page_cta"
            });
            
            setWaDialogue(true);
          }}
        >
          <IoIosSend />
          <p className={`${poppins.className}`}>Order via WA</p>
        </button>
      </div>
      <WAClarification dialogue={waDialogue} setDialogue={setWaDialogue} />
    </div>
  );
}

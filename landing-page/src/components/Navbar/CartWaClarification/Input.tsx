"use client";

import React from "react";
import { InputWaOptions } from "./interface";
import { tagesschrift } from "@/app/fonts";
import { IoSend } from "react-icons/io5";
import { generateMessage } from "./Review";
import { useProductStore } from "@/lib/products-store";
import { generateWaUrl } from "@/utils/whatsappUrl";

export default function InputOptions({
  options,
  setOptions,
}: {
  options: InputWaOptions;
  setOptions: React.Dispatch<React.SetStateAction<InputWaOptions>>;
}) {
  const { products, clearCart } = useProductStore();
  const sendHandler = () => {
    const message = encodeURIComponent(generateMessage(products, options));
    const waUrl = generateWaUrl(message);
    clearCart();
    setOptions({ name: "", note: "", shippingCost: 0 });

    window.open(waUrl, "_blank");
  };

  return (
    <div>
      <p className={`${tagesschrift.className} text-xs md:text-sm`}>
        Informasi Tambahan
      </p>

      <div className="space-y-4 p-4 bg-white rounded-md shadow">
        {/* Nama */}
        <div>
          <label className="block font-medium text-sm mb-1">Nama Pemesan</label>
          <input
            type="text"
            value={options.name}
            onChange={(e) => {
              setOptions({ ...options, name: e.target.value });
            }}
            placeholder="Contoh: Ahmad"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Ongkir */}
        <div>
          <label className="block font-medium text-sm mb-1">Ongkir</label>
          <input
            type="number"
            value={options.shippingCost}
            onChange={(e) => {
              setOptions({ ...options, shippingCost: Number(e.target.value) });
            }}
            placeholder="Contoh: 10000"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Catatan Tambahan */}
        <div>
          <label className="block font-medium text-sm mb-1">
            Catatan Tambahan
          </label>
          <textarea
            value={options.note}
            onChange={(e) => {
              setOptions({ ...options, note: e.target.value });
            }}
            placeholder="Contoh: Tolong kirim sebelum jam 6 sore"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          className="bg-green-500 text-white px-2 py-1 rounded-2xl flex gap-2 items-center duration-200 hover:bg-green-600 hover:scale-95 active:scale-90 cursor-pointer"
          onClick={sendHandler}
        >
          <IoSend />
          Kirim Pesan
        </button>
      </div>
    </div>
  );
}

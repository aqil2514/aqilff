import { Product } from "@/@types/interfaces";
import { useProductStore } from "@/lib/products-store";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, increase, decrease, products, removeFromCart } =
    useProductStore();
  const cartItem = products.find((p) => p.id === product.id);

  const isAvailable = product.stock > 0 && product.is_active;

  return (
    <div className="flex flex-col border rounded-xl shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
      <figure className="relative w-full h-48 md:h-64">
        <Image
          src={product.image_src}
          alt={`Gambar ${product.name}`}
          fill
          className={`object-cover ${!product.is_active && "opacity-45"}`}
        />
      </figure>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>

        {product.description && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-2 text-red-600 font-bold text-md">
          Rp {product.price.toLocaleString("id-ID")}
        </div>

        <div className="text-sm text-gray-600 mt-1">
          Stok:{" "}
          <span
            className={product.stock > 0 ? "text-green-600" : "text-red-500"}
          >
            {product.stock > 0 ? product.stock : "Habis"}
          </span>
        </div>

        {!product.is_active && (
          <div className="text-sm text-yellow-600 mt-1">Produk tidak aktif</div>
        )}

        <div className="mt-4 flex gap-2 items-center">
          <button
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
            onClick={() => alert("Akan tersedia nanti")}
          >
            Lihat Detail
          </button>

          {isAvailable && (
            <>
              {!cartItem ? (
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 text-sm active:scale-95"
                >
                  + Keranjang
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrease(product.id)}
                    disabled={cartItem.quantity <= 1}
                    title={
                      cartItem.quantity <= 1
                        ? "Minimal 1 item dalam keranjang"
                        : ""
                    }
                    className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition active:scale-95 disabled:bg-red-200"
                  >
                    −
                  </button>
                  <span className="min-w-[24px] text-center">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => increase(product.id)}
                    disabled={cartItem.quantity >= product.stock}
                    title={
                      cartItem.quantity >= product.stock
                        ? "Jumlah melebihi stok tersedia"
                        : ""
                    }
                    className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition active:scale-95 disabled:bg-green-300"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="ml-2 w-8 h-8 text-red-500 hover:text-red-700 transition text-lg"
                    title="Hapus dari keranjang"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

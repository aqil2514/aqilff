import { Product } from "@/@types/interfaces";
import { useProductStore } from "@/lib/products-store";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, increase, decrease, products, removeFromCart } = useProductStore();
  const cartItem = products.find((p) => p.id === product.id);
  const isAvailable = product.stock > 0 && product.is_active;

  return (
    <div className="flex flex-col border rounded-xl shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 min-h-[320px]">
      <figure className="relative w-full h-40 md:h-64">
        <Image
          src={product.image_src}
          alt={`Gambar ${product.name}`}
          fill
          className={`object-cover ${!product.is_active && "opacity-45"}`}
        />
      </figure>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{product.category}</p>

          {product.description && (
            <p className="text-xs text-gray-700 mt-2 line-clamp-2">{product.description}</p>
          )}

          <div className="mt-2 text-red-600 font-semibold text-sm md:text-md">
            Rp {product.price.toLocaleString("id-ID")}
          </div>

          <div className="text-xs text-gray-600 mt-1">
            Stok:{" "}
            <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
              {product.stock > 0 ? product.stock : "Habis"}
            </span>
          </div>

          {!product.is_active && (
            <div className="text-xs text-yellow-600 mt-1">Produk tidak aktif</div>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <button
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm"
            onClick={() => alert("Akan tersedia nanti")}
          >
            Lihat Detail
          </button>

          {isAvailable &&
            (!cartItem ? (
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-sm"
              >
                + Keranjang
              </button>
            ) : (
              <div className="flex items-center gap-2 justify-between text-sm">
                <button
                  onClick={() => decrease(product.id)}
                  disabled={cartItem.quantity <= 1}
                  className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:bg-red-200"
                >
                  −
                </button>
                <span>{cartItem.quantity}</span>
                <button
                  onClick={() => increase(product.id)}
                  disabled={cartItem.quantity >= product.stock}
                  className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-green-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 hover:text-red-700 text-lg ml-2"
                >
                  🗑️
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}


// import { ProductsCart, useProductStore } from "@/lib/products-store";
// import { formatRupiah } from "@/utils/formatRupiah";

// const generateMessage = (products: ProductsCart[], options?: {
//   name?: string;
//   shippingCost?: number;
//   note?: string;
// }) => {
//   if (products.length === 0) return "";

//   const { name = "Pelanggan", shippingCost = 0, note = "" } = options || {};

//   const header = `Halo, saya *${name}* dari situs AqilFF.shop dan ingin order:\n\n`;

//   const productLines = products
//     .map((product, index) => {
//       const subtotal = product.price * product.quantity;
//       return `${index + 1}. ${product.name} - ${product.quantity}x ${formatRupiah(product.price)} = ${formatRupiah(subtotal)}`;
//     })
//     .join("\n");

//   const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
//   const total = subtotal + shippingCost;

//   const subtotalLine = `\n\nSubtotal: ${formatRupiah(subtotal)}`;
//   const shippingLine = shippingCost > 0 ? `\nOngkir: ${formatRupiah(shippingCost)}` : "";
//   const totalLine = `\nTotal Akhir: ${formatRupiah(total)}`;
//   const noteLine = note ? `\n\nCatatan: ${note}` : "";
//   const timeLine = `\nWaktu Pemesanan: ${new Date().toLocaleString("id-ID")}`;

//   return header + productLines + subtotalLine + shippingLine + totalLine + noteLine + timeLine;
// };

// export default function Review() {
//   const { products } = useProductStore();

//   return (
//     <div className="w-full h-full rounded-2xl bg-white p-4">
//       <h2 className="font-semibold text-lg mb-4">Review Pesan WhatsApp</h2>
//       <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-4 rounded-md border border-gray-300">
//         {generateMessage(products)}
//       </pre>
//     </div>
//   );
// }

import { tagesschrift } from "@/app/fonts";
import { ProductsCart, useProductStore } from "@/lib/products-store";
import { formatRupiah } from "@/utils/formatRupiah";

interface ReviewProps {
  options: {
    name: string;
    shippingCost: number;
    note: string;
  };
}

export const generateMessage = (
  products: ProductsCart[],
  { name, shippingCost, note }: ReviewProps["options"]
) => {
  if (products.length === 0) return "";

  const header = `Halo, saya *${
    name || "Pelanggan"
  }*, dari situs AqilFF.shop dan ingin order:\n\n`;

  const productLines = products
    .map((product, index) => {
      return `${index + 1}. ${product.name} - ${
        product.quantity
      }x - ${formatRupiah(product.price * product.quantity)}`;
    })
    .join("\n");

  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const total = subtotal + (shippingCost || 0);

  const costLines = `\n\nSubtotal: ${formatRupiah(subtotal)}${
    shippingCost > 0 ? `\nOngkir: ${formatRupiah(shippingCost)}` : ""
  }\nTotal: ${formatRupiah(total)}`;

  const noteLine = note ? `\n\nCatatan: ${note}` : "";

  return header + productLines + costLines + noteLine;
};

export default function Review({ options }: ReviewProps) {
  const { products } = useProductStore();
  const message = generateMessage(products, options);

  return (
    <div>
      <p className={`${tagesschrift.className} text-xs md:text-sm`}>Pesan WA akan dikirim sama persis dengan di bawah ini</p>
      <div className="w-full rounded-2xl bg-white p-4 whitespace-pre-wrap text-sm md:text-base font-mono">
        {message}
      </div>
    </div>
  );
}

import { comicRelief, poppins } from "@/app/layout";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import { BiPlus } from "react-icons/bi";

interface Product {
  price: number;
  name: string;
  category: "Nugget" | "Sosis" | "Otak-otak";
  imageSrc: string;
}

export default function Products() {
  return (
    <section className="pb-12 bg-gradient-to-b from-red-900 to-orange-400 py-8">
      <h2 className={`text-center ${comicRelief.className} text-3xl md:text-5xl text-white mb-8`}>
        Produk Kami
      </h2>
  
      {/* Daftar Produk */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-8">
        {products.map((product, i) => (
          <figure key={i}>
            {/* Gambar */}
            <div className="relative w-full h-48 md:h-52">
              <Image
                src={product.imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-xl"
              />
            </div>
            {/* Nama Produk */}
            <p className={`${poppins.className} text-white mt-2 font-semibold`}>
              {product.name}
            </p>
            {/* Identitas Produk */}
            <div className="flex gap-2 justify-start md:justify-between flex-col md:flex-row md:items-center mt-4">
              <p className={`${poppins.className} bg-white/50 text-green-700 px-2 rounded-md font-extrabold`}>
                {formatRupiah(product.price)}
              </p>
              <button className="flex gap-1 items-center bg-red-500 px-2 py-1 text-white rounded-md cursor-pointer duration-200 hover:scale-95 active:scale-90">
                <BiPlus />
                <p className={`${poppins.className}`}>Keranjang</p>
              </button>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
  
}

const products: Product[] = [
  {
    name: "Champ Crunchy Nugget 225g",
    price: 18000,
    category: "Nugget",
    imageSrc: "/products/Champ Crunchy Nugget 225g.jpg",
  },
  {
    name: "Champ Chicken Nugget 250g",
    price: 18000,
    category: "Nugget",
    imageSrc: "/products/Champ Chicken Nugget 250g.jpg",
  },
  {
    name: "Champ Chicken Nugget Coin 250g",
    price: 17000,
    category: "Nugget",
    imageSrc: "/products/Champ Chicken Nugget Coin 250g.jpg",
  },
  {
    name: "Hemato Nugget Ayam 500g",
    price: 20000,
    category: "Nugget",
    imageSrc: "/products/Hemato Nugget Ayam 500g.jpg",
  },
  {
    name: "Hemato Nugget Ayam 250g",
    price: 11000,
    category: "Nugget",
    imageSrc: "/products/Hemato Nugget Ayam 250g.jpg",
  },
  {
    name: "Salam Chicken Nugget 250g",
    price: 12000,
    category: "Nugget",
    imageSrc: "/products/Salam Chicken Nugget 250g.jpg",
  },
  {
    name: "Sukaku Nugget",
    price: 6000,
    category: "Nugget",
    imageSrc: "/products/Sukaku Nugget.jpg",
  },
  {
    name: "Champ Chicken Sausage 275g (15 pcs)",
    price: 20000,
    category: "Sosis",
    imageSrc: "/products/Champ Chicken Sausage 275g (15 pcs).jpg",
  },
  {
    name: "Wadidaw Sosis 420g (21 pcs)",
    price: 17000,
    category: "Sosis",
    imageSrc: "/products/Wadidaw Sosis 420g (21 pcs).jpg",
  },
  {
    name: "Geboooy Sosis 420g (21 pcs)",
    price: 16000,
    category: "Sosis",
    imageSrc: "/products/Geboooy Sosis 420g (21 pcs).jpg",
  },
  {
    name: "888 Bassiss Sosis 420g (21 pcs)",
    price: 16000,
    category: "Sosis",
    imageSrc: "/products/888 Bassiss Sosis 420g (21 pcs).jpg",
  },
  {
    name: "Rifky Jaya Otak-otak 250g (10 pcs)",
    price: 5000,
    category: "Otak-otak",
    imageSrc: "/products/Rifky Jaya Otak-otak 250g (10 pcs).jpg",
  },
];

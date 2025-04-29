import { comicRelief, poppins, tuffy } from "@/app/fonts";
import Image from "next/image";
import { CgShoppingCart } from "react-icons/cg";

interface Category {
  imageSrc: string;
  caption: string;
}

export default function HeroSection() {
  return (
    <section>
      <div className="min-h-screen grid grid-rows-[30%_auto] md:grid-rows-2 w-full">
        {/* CTA, Title, Sub */}
        <div className="w-full h-full relative bg-center bg-no-repeat bg-cover bg-[url('/hero-section-1.jpg')] bg-black/20 bg-blend-darken">
          <div className="w-[95%] md:w-auto bg-black/30 text-white absolute mb-11 md:m-0 bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 py-4 md:p-4 rounded-xl text-center">
            <h2
              className={`${tuffy.className} font-semibold text-xl md:text-5xl`}
            >
              Aqil Frozen Food
            </h2>
            <p className={`${poppins.className} text-md md:text-2xl mt-2`}>
              Hadirkan Kelezatan Beku ke Rumah Anda
            </p>
          </div>
          <div className="absolute w-full md:w-auto bottom-10 left-1/2 transform -translate-x-1/2">
            <button className="bg-red-500 flex items-center gap-2 p-2 mx-auto md:m-0 md:px-6 md:py-3 border-4 text-white border-red-700 rounded-2xl cursor-pointer duration-200 hover:scale-95 active:scale-90">
              <CgShoppingCart size={28} />
              <p className={`text-md md:text-2xl ${comicRelief.className}`}>
                Belanja Sekarang
              </p>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="w-full h-full relative bg-center bg-no-repeat bg-cover bg-black/50 bg-blend-darken bg-[url('/hero-bottom-section-1.jpg')]">
          <div className="flex flex-col justify-center items-center h-full px-4 py-8">
            <h2
              className={`${comicRelief.className} text-center text-3xl md:text-5xl text-white mb-8`}
            >
              Kategori Frozen Food
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {categories.map((cat, i) => (
                <figure
                  key={i}
                  className="h-32 w-32 md:h-64 md:w-64 flex flex-col items-center"
                >
                  <div className="relative overflow-hidden rounded-2xl w-full h-full">
                    <Image
                      src={cat.imageSrc}
                      fill
                      alt={cat.caption}
                      className="rounded-2xl object-cover duration-200 hover:scale-110"
                    />
                  </div>
                  <figcaption
                    className={`text-center text-white mt-2 ${poppins.className} font-semibold`}
                  >
                    {cat.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const categories: Category[] = [
  {
    imageSrc: "/nugget.jpg",
    caption: "Nugget",
  },
  {
    imageSrc: "/Otak-otak.jpg",
    caption: "Otak-otak",
  },
  {
    imageSrc: "/Kornet.webp",
    caption: "Kornet",
  },
  {
    imageSrc: "/Sosis.jpg",
    caption: "Sosis",
  },
];

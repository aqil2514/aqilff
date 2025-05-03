"use client";
import { motion } from "framer-motion";
import { comicRelief, poppins, tuffy } from "@/app/fonts";
import Image from "next/image";
import { CgShoppingCart } from "react-icons/cg";
import { categories } from "@/lib/data";

export default function HeroSection() {
  const clickHandler = () => {
    const productSection = document.getElementById("product")?.offsetTop;
    window.scrollTo({
      behavior: "smooth",
      top: productSection,
    });
  };

  return (
    <section id="home">
      <div className="min-h-screen grid grid-rows-[30%_auto] md:grid-rows-2 w-full">

        {/* Hero CTA */}
        <div className="w-full h-full relative bg-center bg-no-repeat bg-cover bg-[url('/hero-section-1.jpg')] bg-black/20 bg-blend-darken">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-[95%] md:w-auto bg-black/30 text-white absolute mb-11 md:m-0 bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 py-4 md:p-4 rounded-xl text-center"
          >
            <h2 className={`${tuffy.className} font-semibold text-xl md:text-5xl`}>
              Aqil Frozen Food
            </h2>
            <p className={`${poppins.className} text-md md:text-2xl mt-2`}>
              Hadirkan Kelezatan Beku ke Rumah Anda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute w-full md:w-auto bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <button
              onClick={clickHandler}
              className="bg-red-500 flex items-center gap-2 p-2 mx-auto md:m-0 md:px-6 md:py-3 border-4 text-white border-red-700 rounded-2xl cursor-pointer duration-200 hover:scale-95 active:scale-90"
            >
              <CgShoppingCart size={28} />
              <p className={`text-md md:text-2xl ${comicRelief.className}`}>
                Belanja Sekarang
              </p>
            </button>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="w-full h-full relative bg-center bg-no-repeat bg-cover bg-black/50 bg-blend-darken bg-[url('/hero-bottom-section-1.jpg')]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-col justify-center items-center h-full px-4 py-8"
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
              className={`${comicRelief.className} text-center text-3xl md:text-5xl text-white mb-8`}
            >
              Kategori Frozen Food
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-6">
              {categories.map((cat, i) => (
                <motion.figure
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
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
                </motion.figure>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

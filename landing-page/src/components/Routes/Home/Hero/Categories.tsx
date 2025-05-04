"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { poppins, comicRelief } from "@/app/fonts";
import { useHomeData } from "@/components/Providers/HomeProvider";

export default function Categories() {
  const { categories } = useHomeData();
  return (
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
          {categories.slice(0, 4).map((cat, i) => (
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
                  src={cat.image_url}
                  fill
                  alt={cat.name}
                  className="rounded-2xl object-cover duration-200 hover:scale-110"
                />
              </div>
              <figcaption
                className={`text-center text-white mt-2 ${poppins.className} font-semibold`}
              >
                {cat.name}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

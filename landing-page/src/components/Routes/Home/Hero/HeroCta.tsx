"use client";
import { motion } from "framer-motion";
import { comicRelief, poppins, tuffy } from "@/app/fonts";
import { CgShoppingCart } from "react-icons/cg";

const HeroCTA = () => {
  const clickHandler = () => {
    const productSection = document.getElementById("product")?.offsetTop;
    window.scrollTo({
      behavior: "smooth",
      top: productSection,
    });
  };

  return (
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
  );
};

export default HeroCTA;

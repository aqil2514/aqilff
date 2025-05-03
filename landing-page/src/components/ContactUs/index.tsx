"use client";
import { comicRelief } from "@/app/fonts";
import GoogleMap from "./GoogleMap";
import Contact from "./Contact";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export default function ContactUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView) setHasAnimated(true);
  }, [inView]);

  return (
    <section
      ref={ref}
      id="contactus"
      className="pt-4 pb-12 min-h-screen px-4 md:px-8 bg-cover bg-center bg-no-repeat bg-darken bg-[url('/contact-us-background.jpg')]"
    >
      <motion.h2
        className={`text-center ${comicRelief.className} text-5xl text-white`}
        initial={{ opacity: 0, y: 50 }}
        animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Kontak Kami
      </motion.h2>

      <motion.div
        className="grid gap-2 grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 mt-4"
        initial={{ opacity: 0, y: 50 }}
        animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GoogleMap />
        <Contact />
      </motion.div>
    </section>
  );
}

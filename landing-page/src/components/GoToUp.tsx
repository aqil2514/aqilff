"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { onCartEvent } from "@/lib/products-store"; // pastikan path-nya sesuai

export default function GoToUp() {
  const [showButton, setShowButton] = useState(false);
  const [notif, setNotif] = useState<{ type: "ADD_PRODUCT" | "REMOVE_PRODUCT"; name: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onCartEvent((type, name) => {
      setNotif({ type, name });
      setTimeout(() => setNotif(null), 2000);
    });

    return () => unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-red-500 text-white shadow-lg"
          >
            <FaArrowUp className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Notifikasi produk */}
      <AnimatePresence>
        {notif && (
          <motion.div
            key="notif"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 z-50 bg-white text-black shadow-md rounded-xl px-4 py-2"
          >
            {notif.type === "ADD_PRODUCT" ? (
              <p>✅ Ditambahkan: <strong>{notif.name}</strong></p>
            ) : (
              <p>❌ Dihapus: <strong>{notif.name}</strong></p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

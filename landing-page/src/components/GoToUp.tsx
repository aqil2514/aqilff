"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { onCartEvent } from "@/lib/products-store";

type CartNotif = {
  id: string;
  type: "ADD_PRODUCT" | "REMOVE_PRODUCT";
  name: string;
};

export default function GoToUp() {
  const [showButton, setShowButton] = useState(false);
  const [notifications, setNotifications] = useState<CartNotif[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onCartEvent((type, name) => {
      const id = Date.now().toString() + Math.random().toString(); // unik
      const notif = { id, type, name };
      setNotifications((prev) => [notif, ...prev]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 2000);
    });

    return () => unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Tombol Scroll Up */}
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

      {/* Stacked Notifications */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 items-end">
        <AnimatePresence initial={false}>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white text-black shadow-lg rounded-xl px-4 py-2 min-w-[200px]"
            >
              {notif.type === "ADD_PRODUCT" ? (
                <p>✅ Ditambahkan: <strong>{notif.name}</strong></p>
              ) : (
                <p>❌ Dihapus: <strong>{notif.name}</strong></p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

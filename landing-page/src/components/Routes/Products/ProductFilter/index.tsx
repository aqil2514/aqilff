import React, { useState } from "react";
import SearchName from "./SearchName";
import { FaFilter, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductFilter() {
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const isActive = isSearchActive || isFilterActive;

  return (
    <div
      className={`grid grid-cols-[20%_auto] duration-200 ${isActive ? "md:grid-cols-[2%_auto]" : "md:grid-cols-[4%_auto]"} text-center`}
    >
      <div className="flex items-center gap-4 text-white">
        {!isFilterActive && (
          <FaSearch
            onClick={() => setIsSearchActive(!isSearchActive)}
            className="cursor-pointer"
          />
        )}
        {!isSearchActive && (
          <FaFilter
            onClick={() => setIsFilterActive(!isFilterActive)}
            className="cursor-pointer"
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {isSearchActive && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <SearchName />
          </motion.div>
        )}

        {isFilterActive && (
          <motion.div
            key="filter"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-white">Filter Coming Soon</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

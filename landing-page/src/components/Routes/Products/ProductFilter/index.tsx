import React from "react";
import SearchName from "./C_SearchName";
import { FaFilter, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useProductFilterLogic } from "./logic/useProductFilterLogic";
import FilterProducts from "./C_Filter";

export default function ProductFilter() {
  const {
    isActive,
    isFilterActive,
    isSearchActive,
    toggleFilter,
    toggleSearch,
    filterCount,
  } = useProductFilterLogic();

  return (
    <div
      className={`grid duration-200 text-center mb-4 ${
        isActive
          ? "grid-cols-[10%_auto] md:grid-cols-[2%_auto]"
          : "md:grid-cols-[4%_auto] grid-cols-[20%_auto]"
      }`}
    >
      <div className="flex items-center gap-4 text-white">
        {!isFilterActive && (
          <FaSearch onClick={toggleSearch} className="cursor-pointer" />
        )}
        {!isSearchActive && (
          <div className="relative">
            {filterCount > 0 && (
              <span
                onClick={toggleFilter}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 shadow cursor-pointer"
              >
                {filterCount}
              </span>
            )}
            <FaFilter
              onClick={toggleFilter}
              className="cursor-pointer text-white"
            />
          </div>
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
            <FilterProducts />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

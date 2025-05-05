import { tagesschrift } from "@/app/fonts";
import React from "react";
import CategoryFilter from "./FilterCategory";
import OtherFilter from "./FilterOther";
import Button from "@/components/Reuseable/button";
import { useFilterProductsLogic } from "../logic/useFilterProductsLogic";

export default function FilterProducts() {
  const { isFilterActive, deleteAllFilter } = useFilterProductsLogic();

  return (
    <div className="text-white border-2 rounded-2xl py-2">
      <h3
        className={`${tagesschrift.className} !font-bold underline text-base md:text-2xl`}
      >
        Filter Produk
      </h3>
      {isFilterActive() && (
        <Button size="sm" variant="danger" className="cursor-pointer my-2" onClick={deleteAllFilter}>
          Hapus Filter
        </Button>
      )}
      <div className="md:grid grid-cols-2">
        <CategoryFilter />
        <OtherFilter />
      </div>
    </div>
  );
}

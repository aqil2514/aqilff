"use client";

import ProductsProvider from "../providers/ProductsProvider";

import MainWrapper from "../atoms/main-wrapper";

import { Product } from "@/@types/products";
import TableProducts from "../organisms/Products/TableProducts";
import AddProductFormDialog from "../organisms/Products/AddForm";
import { Input } from "../ui/input";
import { RefObject, useEffect, useRef } from "react";
import { useSearchProductLogic } from "../logics/productLogics";

export default function ProductTemplate({ products }: { products: Product[] }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ProductsProvider products={products}>
      <MainWrapper className="!block p-4">
        <h1 className="text-center">Daftar Produk</h1>
        <div className="flex gap-4 items-center">
          <AddProductFormDialog />
          <InputName inputRef={inputRef} />
        </div>
        <TableProducts />
      </MainWrapper>
    </ProductsProvider>
  );
}

const InputName = ({
  inputRef,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
}) => {
  const { name, searchNameHandler } = useSearchProductLogic();

  return (
    <Input
      ref={inputRef}
      value={name}
      onChange={searchNameHandler}
      placeholder="Cari Produk... (CTRL + K)"
    />
  );
};

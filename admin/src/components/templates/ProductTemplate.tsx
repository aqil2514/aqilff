"use client";

import useSWR from "swr";
import ProductsProvider from "../providers/ProductsProvider";

import MainWrapper from "../atoms/main-wrapper";

import { Product } from "@/@types/products";
import TableProducts from "../organisms/Products/TableProducts";
import AddProductFormDialog from "../organisms/Products/AddForm";
import { Input } from "../ui/input";
import { RefObject, useRef, useState } from "react";
import { useSearchProductLogic } from "../logics/productLogics";
import { RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { fetchProducts } from "@/lib/fetchers";

export default function ProductTemplate() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: products,
    isLoading,
    error,
  } = useSWR<Product[]>("/api/products", fetchProducts);

  if (isLoading) return <MainWrapper>Loading...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat produk!</MainWrapper>;
  if (!products) return null;

  return (
    <ProductsProvider products={products}>
      <MainWrapper className="!block p-4">
        <h1 className="text-center">Daftar Produk</h1>
        <div className="flex gap-4 items-center">
          <AddProductFormDialog />
          <InputName inputRef={inputRef} />
        </div>
        <TableProducts />
        <RefreshButton />
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

const RefreshButton = () => {
  const { mutate } = useSWR<Product[]>("/api/products", fetchProducts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRevalidate = async () => {
    setIsRefreshing(true);
    try {
      await mutate();
      toast("Data di-refresh!", { type: "info" });
    } catch (error) {
      toast("Gagal refresh data!", { type: "error" });
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRevalidate}
      aria-label="Refresh"
      disabled={isRefreshing}
      className={`transition-transform duration-700 ${
        isRefreshing ? "animate-spin" : ""
      }`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
    >
      <RefreshCcw size={24} />
    </button>
  );
};

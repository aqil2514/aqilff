"use client";

import useSWR from "swr";
import ProductsProvider from "../providers/ProductsProvider";

import MainWrapper from "../atoms/main-wrapper";

import { Product } from "@/@types/products";
import TableProducts from "../organisms/Products/TableProducts";
import AddProductFormDialog from "../organisms/Products/AddForm";
import { Input } from "../ui/input";
import { RefObject, useEffect, useRef, useState } from "react";
import { useSearchProductLogic } from "../logics/productLogics";
import { RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { fetchProducts } from "@/lib/fetchers";
import { TransactionItem } from "@/@types/transaction";
import { Card, CardContent } from "../ui/card";
import { formatToRupiah } from "@/lib/utils";

/**
 * Product Template
 *
 * Alur Route :
 *
 * 1.
 */

export default function ProductTemplate() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const refreshRef = useRef<HTMLButtonElement | null>(null);
  const addRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLocaleLowerCase() === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
      if (e.ctrlKey && e.key.toLocaleLowerCase() === "r") {
        e.preventDefault();
        if (refreshRef.current) {
          refreshRef.current.click();
        }
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLocaleLowerCase() === "a") {
        e.preventDefault();
        if (addRef.current) {
          addRef.current.click();
        }
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const { data, isLoading, error } = useSWR<{
    data: Product[];
    tItems: TransactionItem[];
  }>("/api/products", fetchProducts);

  const products = data?.data;
  const tItem = data?.tItems;

  if (isLoading) return <MainWrapper>Loading...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat produk!</MainWrapper>;
  if (!products || !tItem) return null;

  return (
    <ProductsProvider products={products} tItems={tItem}>
      <MainWrapper className="!block pt-16 px-4">
        <h1 className="text-center">Daftar Produk</h1>
        <div className="flex gap-4 items-center">
          <AddProductFormDialog addRef={addRef} />
          <InputName inputRef={inputRef} />
        </div>
        <TableProducts />
        <ProductFooter products={products} refreshRef={refreshRef} />
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

const RefreshButton = ({
  buttonRef,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
}) => {
  const { mutate } = useSWR<Product[]>("/api/products", fetchProducts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRevalidate = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((res) => setTimeout(res, 300));
      await mutate();
      toast("Data di-refresh!", { type: "info" });
      await new Promise((res) => setTimeout(res, 300));
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
      ref={buttonRef}
      disabled={isRefreshing}
      className={`transition-transform duration-700 my-auto ${
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

const ProductFooter = ({
  products,
  refreshRef,
}: {
  products: Product[];
  refreshRef: RefObject<HTMLButtonElement | null>;
}) => {
  const totalProduct = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalPrice = products
    .filter((prod) => prod.is_active)
    .reduce((acc, curr) => acc + curr.price * curr.stock, 0);

  return (
    <Card className="mt-4 py-2">
      <CardContent className="text-sm text-muted-foreground flex items-center space-x-2">
        <RefreshButton buttonRef={refreshRef} />
        <p>
          Terdapat <strong>{totalProduct}</strong> total produk dengan{" "}
          <strong>{totalStock}</strong> item. {formatToRupiah(totalPrice)}
        </p>
      </CardContent>
    </Card>
  );
};

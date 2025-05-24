"use client";
import useSWR from "swr";
import MainWrapper from "../atoms/main-wrapper";
import { PurchaseAddFormDialog } from "../organisms/Purchases/AddForm";
import { fetchProducts } from "@/lib/fetchers";
import PurchaseProvider from "../providers/PurchasesProvider";

export default function PurchaseTemplate() {
  const {
    data: products,
    isLoading,
    error,
  } = useSWR("/api/products", fetchProducts);

  if (isLoading) return <MainWrapper>Loading produk...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat produk!</MainWrapper>;
  if (!products) return null;

  return (
    <PurchaseProvider products={products.data}>
      <MainWrapper className="!block pt-16 px-2">
        <h1 className="text-center">Pembelian</h1>
        <div className="flex gap-4 items-center">
          <PurchaseAddFormDialog />
        </div>
      </MainWrapper>
    </PurchaseProvider>
  );
}

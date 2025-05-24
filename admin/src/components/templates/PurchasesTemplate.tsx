"use client";
import useSWR from "swr";
import MainWrapper from "../atoms/main-wrapper";
import { PurchaseAddFormDialog } from "../organisms/Purchases/AddForm";
import { fetchProducts } from "@/lib/fetchers";
import PurchaseProvider, { usePurchaseData } from "../providers/PurchasesProvider";
import RetrieveData from "../organisms/Purchases/RetrieveData";

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
          <RetrieveData />
        </div>
        <CoreData />
      </MainWrapper>
    </PurchaseProvider>
  );
}

const CoreData = () => {
  const {purchases} = usePurchaseData()

  if(purchases.length < 1) return (
      <div className="text-center mt-10 text-muted-foreground">
        <p>Silakan pilih rentang tanggal untuk melihat data Pembelian.</p>
        <p className="text-sm mt-2">Gunakan tombol &quot;Ambil Data&quot; di atas.</p>
      </div>
    );

  return <div>Data berhasil diambil, namun belum dapat ditampilkan</div>;
};

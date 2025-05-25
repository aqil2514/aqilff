"use client";
import useSWR from "swr";
import MainWrapper from "../atoms/main-wrapper";
import { PurchaseAddFormDialog } from "../organisms/Purchases/AddForm";
import { fetchProducts } from "@/lib/fetchers";
import PurchaseProvider, {
  usePurchaseData,
} from "../providers/PurchasesProvider";
import { RetrieveDataPopover } from "../molecules/RetrieveData";
import TablePurchases from "../organisms/Purchases/TablePurchases";

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
      <InnerTemplate />
    </PurchaseProvider>
  );
}

const InnerTemplate = () => {
  const {
    setDateRange,
    setPurchases,
    isLoadingPurchases,
    setIsLoadingPurchases,
  } = usePurchaseData();

  return (
    <MainWrapper className="!block pt-16 px-2 space-y-2">
      <h1 className="text-center">Pembelian</h1>
      <div className="flex gap-4 items-center">
        <PurchaseAddFormDialog />
        <RetrieveDataPopover
          data_src="purchases"
          isLoading={isLoadingPurchases}
          setData={setPurchases}
          setDateRange={setDateRange}
          setIsLoading={setIsLoadingPurchases}
        />
      </div>
      <CoreData />
    </MainWrapper>
  );
};

const CoreData = () => {
  const { dateRange, purchases } = usePurchaseData();

  if (!dateRange)
    return (
      <div className="text-center mt-10 text-muted-foreground">
        <p>Silakan pilih rentang tanggal untuk melihat data Pembelian.</p>
        <p className="text-sm mt-2">
          Gunakan tombol &quot;Ambil Data&quot; di atas.
        </p>
      </div>
    );

  if (purchases.length === 0)
    return (
      <div className="text-center mt-10 text-muted-foreground">
        <p>Tidak ada atau belum ada data pada tanggal {dateRange.start} sampai {dateRange.end}.</p>
        <p className="text-sm mt-2">
          Gunakan tombol &quot;Tambah Data&quot; di atas.
        </p>
      </div>
    );

  return <TablePurchases />;
};

"use client";
import useSWR from "swr";
import MainWrapper from "../../atoms/main-wrapper";
import { fetchPurchaseResources } from "@/lib/fetchers";
import PurchaseProvider, {
  usePurchaseData,
} from "../../providers/PurchasesProvider";
import { RetrieveDataPopover } from "../../molecules/RetrieveData";
import TablePurchases from "../../organisms/Purchases/TablePurchases";
import PurchaseDialog from "../../organisms/Purchases/Form";

export default function PurchaseTemplate() {
  const {
    data: resource,
    isLoading,
    error,
  } = useSWR("/api/purchases/get-resource", fetchPurchaseResources);

  if (isLoading) return <MainWrapper>Loading data...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat data!</MainWrapper>;
  if (!resource) return null;

  return (
    <PurchaseProvider resource={resource}>
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
        {/* <PurchaseAddFormDialog /> */}
        <PurchaseDialog type="add-form" />
        <RetrieveDataPopover
          data_src="purchases"
          isLoading={isLoadingPurchases}
          setData={setPurchases}
          setDateRange={setDateRange}
          setIsLoading={setIsLoadingPurchases}
        />
      </div>
      <CoreData />
      <PurchaseFooter />
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
        <p>
          Tidak ada atau belum ada data pada tanggal {dateRange.start} sampai{" "}
          {dateRange.end}.
        </p>
        <p className="text-sm mt-2">
          Gunakan tombol &quot;Tambah Data&quot; di atas.
        </p>
      </div>
    );

  return <TablePurchases />;
};

const PurchaseFooter = () => {
  const { purchases, dateRange } = usePurchaseData();

  const totalQuantity = purchases.reduce((sum, p) => {
    return sum + p.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const totalPrice = purchases.reduce((sum, p) => {
    return (
      sum +
      p.items.reduce((itemSum, item) => itemSum + item.quantity * item.hpp, 0)
    );
  }, 0);

  if (!dateRange || purchases.length === 0) return null;

  return (
    <div className="mt-4 p-4 border rounded-md bg-muted text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <div>
        Menampilkan {purchases.length} transaksi dari{" "}
        <span className="font-medium">{dateRange.start}</span> hingga{" "}
        <span className="font-medium">{dateRange.end}</span>
      </div>
      <div className="flex gap-4">
        <div>
          Total Barang: <span className="font-semibold">{totalQuantity}</span>
        </div>
        <div>
          Total Harga:{" "}
          <span className="font-semibold">
            Rp {totalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

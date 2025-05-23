"use client";

import useSWR from "swr";
import MainWrapper from "../atoms/main-wrapper";
import AddTransactionFormDialog from "../organisms/Transactions/AddForm";
import TransactionProvider, {
  useTransactionData,
} from "../providers/TransactionProvider";
import { fetchProducts } from "@/lib/fetchers";
import TransactionTable from "../organisms/Transactions/TableTransactions/transactions-table";
import { RetrieveDataPopover } from "../organisms/Transactions/RetrieveData";

export default function TransactionTemplate() {
  const {
    data: products,
    isLoading,
    error,
  } = useSWR("/api/products", fetchProducts);

  // const [dateRange, setDateRange] = useState<{
  //   start: string;
  //   end: string;
  // } | null>(null);

  // const [isLoadingTransactions, setIsLoadingTransactions] =
  //   useState<boolean>(false);

  if (isLoading) return <MainWrapper>Loading produk...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat produk!</MainWrapper>;
  if (!products) return null;

  return (
    <TransactionProvider products={products.data}>
      <MainWrapper className="!block pt-16 px-4">
        <h1 className="text-center">Daftar Transaksi</h1>
        <div className="flex gap-4 items-center">
          <AddTransactionFormDialog />
          <RetrieveDataPopover />
        </div>
        <CoreData />
      </MainWrapper>
    </TransactionProvider>
  );
}

const CoreData = () => {
  const { dateRange, isLoadingTransactions } = useTransactionData();

  return (
    <>
      {!dateRange ? (
        <div className="text-center mt-10 text-muted-foreground">
          Silakan pilih rentang tanggal untuk melihat data transaksi.
        </div>
      ) : isLoadingTransactions ? (
        <div className="text-center mt-10">Memuat data...</div>
      ) : (
        <TransactionTable />
      )}
    </>
  );
};

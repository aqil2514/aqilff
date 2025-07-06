"use client";

import useSWR from "swr";
import MainWrapper from "../../atoms/main-wrapper";
import AddTransactionFormDialog from "../../organisms/Transactions/AddForm";
import TransactionProvider, {
  useTransactionData,
} from "../../providers/TransactionProvider";
import { fetchTransactionsResources } from "@/lib/fetchers";
import TransactionTable from "../../organisms/Transactions/TableTransactions/transactions-table";
import { Loader2 } from "lucide-react";
import { RetrieveDataPopover } from "../../molecules/RetrieveData";

export default function TransactionTemplate() {
  const {
    data,
    isLoading,
    error,
  } = useSWR("/api/transaction/get-resource", fetchTransactionsResources);

  if (isLoading) return <MainWrapper>Loading produk...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat produk!</MainWrapper>;
  if (!data) return null;

  return (
    <TransactionProvider products={data.products}>
      <InnerTemplate />
    </TransactionProvider>
  );
}

const InnerTemplate = () => {
  const {
    isLoadingTransactions,
    setTransactions,
    setDateRange,
    setIsLoadingTransactions,
  } = useTransactionData();
  return (
    <MainWrapper className="!block pt-16 px-4">
      <h1 className="text-center">Daftar Transaksi</h1>
      <div className="flex gap-4 items-center">
        <AddTransactionFormDialog />
        <RetrieveDataPopover
          data_src="transactions"
          isLoading={isLoadingTransactions}
          setData={setTransactions}
          setDateRange={setDateRange}
          setIsLoading={setIsLoadingTransactions}
        />
      </div>
      <CoreData />
    </MainWrapper>
  );
};

const CoreData = () => {
  const { dateRange, isLoadingTransactions } = useTransactionData();

  if (!dateRange) {
    return (
      <div className="text-center mt-10 text-muted-foreground">
        <p>Silakan pilih rentang tanggal untuk melihat data transaksi.</p>
        <p className="text-sm mt-2">
          Gunakan tombol &quot;Ambil Data&quot; di atas.
        </p>
      </div>
    );
  }

  if (isLoadingTransactions) {
    return (
      <div className="flex flex-col items-center mt-10 text-muted-foreground">
        <Loader2 className="animate-spin w-8 h-8 mb-2" />
        <p>Memuat data transaksi...</p>
      </div>
    );
  }

  return <TransactionTable />;
};

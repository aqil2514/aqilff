"use client";

import useSWR from "swr";
import MainWrapper from "../atoms/main-wrapper";
import AddTransactionFormDialog from "../organisms/Transactions/AddForm";
import TransactionProvider from "../providers/TransactionProvider";
import { fetchProducts, fetchTransactions } from "@/lib/fetchers";
import { Transaction, TransactionItem } from "@/@types/transaction";

export default function TransactionTemplate() {
  const {
    data: products,
    isLoading,
    error,
  } = useSWR("/api/products", fetchProducts);

  const {
    data,
    isLoading: isLoadingTransactions,
    error: errorTransactions,
  } = useSWR<{ transactions: Transaction[]; transactionItems: TransactionItem[] }>(
    "/api/transaction",
    fetchTransactions
  );

  if (isLoading || isLoadingTransactions)
    return <MainWrapper>Loading...</MainWrapper>;
  if (error || errorTransactions)
    return <MainWrapper>Gagal memuat data!</MainWrapper>;
  if (!products || !data) return null;

  const { transactions, transactionItems } = data;

  return (
    <TransactionProvider
      products={products.data}
      transactions={transactions}
      transactionItems={transactionItems}
    >
      <MainWrapper className="!block pt-16 px-4">
        <h1 className="text-center">Daftar Transaksi</h1>
        <div className="flex gap-4 items-center">
          <AddTransactionFormDialog />
        </div>
      </MainWrapper>
    </TransactionProvider>
  );
}

"use client";
import { Product } from "@/@types/products";
import MainWrapper from "@/components/atoms/main-wrapper";
import TransactionForm from "@/components/organisms/forms/TransactionForm";
import AddTransactionProvider from "@/components/providers/AddTransactionProvider";
import { createNewTransaction } from "@/lib/api/transaction/clientApiHelper";

interface AddTransactionTemplateProps {
  products: Product[];
}

export default function AddTransactionTemplate({
  products,
}: AddTransactionTemplateProps) {
  return (
    <AddTransactionProvider products={products}>
      <MainWrapper className="block space-y-4">
        <h1 className="text-center font-bold text-xl">Tambah Transaksi</h1>
        <TransactionForm handler={(v) => createNewTransaction(v)} />
      </MainWrapper>
    </AddTransactionProvider>
  );
}

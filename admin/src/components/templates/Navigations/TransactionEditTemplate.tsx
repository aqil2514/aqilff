"use client";
import { Product } from "@/@types/products";
import MainWrapper from "@/components/atoms/main-wrapper";
import TransactionForm from "@/components/organisms/forms/TransactionForm";
import AddTransactionProvider from "@/components/providers/AddTransactionProvider";
import { TransactionSchemaType } from "@/schema/transaction-schema";

interface EditTransactionTemplateProps {
  products: Product[];
  defaultValues: TransactionSchemaType
}

export default function EditTransactionTemplate({
  products,
  defaultValues
}: EditTransactionTemplateProps) {
  console.log(defaultValues)
  return (
    <AddTransactionProvider products={products}>
      <MainWrapper className="block space-y-4">
        <h1 className="text-center font-bold text-xl">Tambah Transaksi</h1>
        <TransactionForm handler={(v) => console.log(v)} defaultValuesForm={defaultValues} />
      </MainWrapper>
    </AddTransactionProvider>
  );
}

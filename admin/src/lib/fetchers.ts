import { Transaction, TransactionItem } from "@/@types/transaction";

export const fetchProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Gagal memuat data produk");
  return res.json();
};
export async function fetchTransactions(): Promise<{
  transactions: Transaction[];
  transactionItems: TransactionItem[];
}> {
  const res = await fetch("/api/transaction");
  const json = await res.json();
  return {
    transactions: json.transactions,
    transactionItems: json.transactionItems,
  };
}
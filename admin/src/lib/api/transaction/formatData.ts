import { Transaction, TransactionItem } from "@/@types/transaction";
import { TransactionSchemaType } from "@/schema/transaction-schema";

export function formatToTransactionData(
  raw: TransactionSchemaType,
  transactionId: string
): Transaction {
  const items = formatToTransactionItem(raw.transaction_items, transactionId);
  const total_amount = items
    .map((item) => item.subtotal)
    .reduce((acc, curr) => acc + curr, 0);

  const data: Transaction = {
    id: transactionId,
    transaction_code: raw.transaction_code,
    total_amount,
    payment_method: raw.payment_method,
    customer_name: raw.customer_name,
    notes: raw.notes,
    transaction_at: String(raw.transaction_at),
  };

  return data;
}

export function formatToTransactionItem(
  raw: TransactionSchemaType["transaction_items"],
  transaction_id: string
): TransactionItem[] {
  const data: TransactionItem[] = [];
  for (const r of raw) {
    const subtotal = r.quantity * r.subtotal + r.tip - r.discount;
    const hppTotal = r.quantity * r.hpp;
    const margin = subtotal - hppTotal;

    const transactionItem: TransactionItem = {
      ...r,
      margin,
      hpp: hppTotal,
      transaction_id,
      subtotal,
    };

    data.push(transactionItem);
  }

  return data;
}

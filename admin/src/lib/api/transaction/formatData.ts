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
  return raw.map((r) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { product_name, ...rest } = r; // 🔥 product_name dibuang

    const subtotal = r.quantity * r.subtotal + r.tip - r.discount;
    const hppTotal = r.quantity * r.hpp;
    const margin = subtotal - hppTotal;

    return {
      ...rest, // tanpa product_name
      margin,
      hpp: hppTotal,
      transaction_id,
      subtotal,
    };
  });
}


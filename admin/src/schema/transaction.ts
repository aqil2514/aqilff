/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "@/@types/transaction";
import { z } from "zod";

export function formatTransaction(raw: Transaction): Transaction {
  return {
    id: raw.id,
    transaction_code: raw.transaction_code,
    payment_method: raw.payment_method,
    total_amount: Number(raw.total_amount),
    customer_name: raw.customer_name || undefined,
    notes: raw.notes || undefined,
    transaction_at: raw.transaction_at,
    items: raw?.items?.map((item: any) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      price_per_unit: Number(item.price_per_unit),
      discount:
        item.discount !== undefined && item.discount !== ""
          ? Number(item.discount)
          : undefined,
      tip:
        item.tip !== undefined && item.tip !== ""
          ? Number(item.tip)
          : undefined,
      product_unit: item.product_unit || undefined,
      product_sku: item.product_sku || undefined,
      quantity: Number(item.quantity),
      subtotal: Number(item.subtotal),
      margin: Number(item.margin),
    })),
  };
}

export const TransactionItemSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  price_per_unit: z.number({ message: "Harga per Produk harus berupa angka" }),
  product_unit: z.string().optional(),
  discount: z.number({ message: "Diskon harus berupa angka" }).optional(),
  tip: z.number({ message: "Tip harus berupa angka" }).optional(),
  product_sku: z.string().optional(),
  quantity: z.number({ message: "Kuantiti harus berupa angka" }),
  subtotal: z.number({ message: "Subtotal harus berupa angka" }),
  margin: z.number(),
});

export const TransactionSchema = z.object({
  transaction_code: z
    .string({ message: "Kode harus berupa string" })
    .min(1, "Kode harus diisi")
    .refine(
      (val) => val.startsWith("TRX"),
      "Kode transaksi harus diawali oleh TRX"
    ),
  items: z.array(TransactionItemSchema),
  total_amount: z.number(),
  payment_method: z.union([
    z.literal("cash"),
    z.literal("transfer"),
    z.literal("ewallet"),
    z.string(),
  ]),
  transaction_at: z.string(),
  customer_name: z.string().optional(),
  notes: z.string().optional(),
});

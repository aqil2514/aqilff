import { z } from "zod";

// export const transactionSchema = z.object({
//   transaction_code: z.string().min(1, "Kode transaksi wajib diisi"),
//   transaction_at: z.date(),
//   customer_name: z.string().min(1, "Nama pembeli wajib diisi"),
//   payment_method: z.string().min(1, "Metoe pembayaran wajib diisi"),
//   notes: z.string().optional(),
//   transaction_items: z
//     .array(
//       z.object({
//         product_id: z.string().min(1, "Produk wajib diisi"),
//         discount: z.number(),
//         quantity: z.number().min(1, "Kuantiti wajib diisi"),
//         subtotal: z.number(),
//         tip: z.number(),
//         margin: z.number(),
//         hpp: z.number(),
//       })
//     )
//     .min(1, "Minimal ada 1 produk yang dibeli"),
// });

export const transactionSchema = z.object({
  transaction_code: z.string().min(1, "Kode transaksi wajib diisi"),
  transaction_at: z.date(),
  customer_name: z.string().min(1, "Nama pembeli wajib diisi"),
  payment_method: z.string().min(1, "Metoe pembayaran wajib diisi"),
  notes: z.string().optional(),
  transaction_items: z
    .array(
      z.object({
        product_name: z.string().min(1, "Produk wajib diisi"),
        product_id: z.string().min(1, "Produk wajib diisi"),
        discount: z.number(),
        quantity: z.number().min(1, "Kuantiti wajib diisi"),
        subtotal: z.number(),
        tip: z.number(),
        margin: z.number(),
        hpp: z.number(),
      })
    )
    .min(1, "Minimal ada 1 produk yang dibeli"),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;

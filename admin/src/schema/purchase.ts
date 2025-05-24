import { z } from "zod";

/**
 * Zod schema untuk item produk dalam pembelian tertentu.
 */
export const purchaseItemSchema = z.object({
  id: z.string().uuid().optional(),
  purchase_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  product_name: z.string(),
  quantity: z.number().min(1, "Quantity minimal 1"),
  remaining_quantity: z.number().min(0, "Remaining quantity tidak boleh negatif"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  hpp: z.number().min(0, "HPP tidak boleh negatif"),
  created_at: z.string().datetime().optional(),
});

/**
 * Zod schema untuk data pembelian.
 */
export const purchaseSchema = z.object({
  id: z.string().uuid().optional(),
  purchase_date: z.string(),
  purchase_code: z.string(),
  supplier_name: z.string().nullable().optional(),
  supplier_type: z
    .union([
      z.literal("Toko Fisik"),
      z.literal("Shopee"),
      z.literal("Buatan Sendiri"),
      z.string(),
    ])
    .optional(),
  notes: z.string().nullable().optional(),
  items: z.array(purchaseItemSchema).min(1, "Minimal 1 item harus ada"),
  created_at: z.string().datetime().optional(),
});

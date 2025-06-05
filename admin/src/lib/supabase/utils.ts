import { Product } from "@/@types/products";
import { PurchaseItem } from "@/@types/purchases";
import { TransactionItem } from "@/@types/transaction";
import { supabaseAdmin } from "../supabaseServer";

export async function updateStock(
  items: TransactionItem[],
  productData: Product[],
  purchaseItemData: PurchaseItem[]
) {
  for (const item of items) {
    // Update purchase_items
    const relatedBatches = purchaseItemData
      .filter(
        (p) => p.product_name === item.product_name && p.remaining_quantity > 0
      )
      .sort((a, b) => {
        const aDate = new Date(a.created_at as string).getTime();
        const bDate = new Date(b.created_at as string).getTime();
        return aDate - bDate;
      });

    let remainingQty = item.quantity;

    for (const batch of relatedBatches) {
      if (remainingQty === 0) break;

      const takeQty = Math.min(batch.remaining_quantity, remainingQty);
      const newRemainingQty = batch.remaining_quantity - takeQty;

      const { error } = await supabaseAdmin
        .from("purchase_items")
        .update({ remaining_quantity: newRemainingQty })
        .eq("id", batch.id);

      if (error) {
        console.warn(
          `Gagal update purchase_item id ${batch.id} (${batch.product_name}):`,
          error.message
        );
      }

      remainingQty -= takeQty;
    }

    // Update products
    const selectedProduct = productData.find(
      (p) => p.name === item.product_name
    );
    if (!selectedProduct) {
      console.warn(`Produk tidak ditemukan: ${item.product_name}`);
      continue;
    }

    const newStock = selectedProduct.stock - item.quantity;

    const { error: productError } = await supabaseAdmin
      .from("products")
      .update({ stock: newStock, is_active: newStock === 0 ? false : true })
      .eq("id", selectedProduct.id);

    if (productError) {
      console.warn(
        `Gagal update stok untuk produk ${selectedProduct.name}:`,
        productError.message
      );
    }
  }
}
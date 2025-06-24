import { ChartPieData } from "@/@types/general";
import { Product } from "@/@types/products";
import { PurchaseItem } from "@/@types/purchases";
import { formatToRupiah } from "@/lib/utils";

export function getAmountCurrentStock(
  items: PurchaseItem[],
  showInRupiah: boolean = true
) {
  const result = items.reduce((acc, curr) => {
    if (curr.remaining_quantity !== 0) {
      return acc + curr.hpp * curr.remaining_quantity;
    }

    return acc;
  }, 0);

  return showInRupiah ? formatToRupiah(result) : result;
}

export function getAmountShoppingItem(
  items: PurchaseItem[],
  showInRupiah: boolean = true
) {
  const result = items.reduce((acc, curr) => acc + curr.price, 0);

  return showInRupiah ? formatToRupiah(result) : result;
}

export function getCategoryAmountAllocationStock(
  items: PurchaseItem[],
  products: Product[]
): ChartPieData[] {
  const totals = new Map<string, number>();

  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) continue;

    const category = product.parent_category;
    const value = item.price;
    totals.set(category, (totals.get(category) ?? 0) + value);
  }

  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}
export function getCategoryAmountCurrentStock(
  items: PurchaseItem[],
  products: Product[]
): ChartPieData[] {
  const totals = new Map<string, number>();

  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) continue;

    const category = product.parent_category;
    const value = (item.hpp * item.remaining_quantity);
    totals.set(category, (totals.get(category) ?? 0) + value);
  }

  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}

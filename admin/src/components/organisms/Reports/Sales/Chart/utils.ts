import { ChartPieData } from "@/@types/general";
import { Product } from "@/@types/products";
import { TransactionItem } from "@/@types/transaction";
import { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies ChartConfig;

export const COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe"];

// Format angka ke rupiah
export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Hitung total harga per kategori
export function getCategoryTotals(
  items: TransactionItem[],
  products: Product[]
): ChartPieData[] {
  const totals = new Map<string, number>();

  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) continue;

    const category = product.parent_category;
    const subtotal = item.quantity * product.price; // total uang per item
    totals.set(category, (totals.get(category) ?? 0) + subtotal);
  }

  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}

// Hitung total margin per kategori
export function getCategoryMargins(
  items: TransactionItem[],
  products: Product[]
): ChartPieData[] {
  const totals = new Map<string, number>();

  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) continue;

    const category = product.parent_category;
    const margins = item.margin; // total uang per item
    totals.set(category, (totals.get(category) ?? 0) + margins);
  }

  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}

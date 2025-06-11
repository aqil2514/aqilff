import { ChartPieData } from "@/@types/general";
import { Product } from "@/@types/products";
import { Transaction, TransactionItem } from "@/@types/transaction";
import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies ChartConfig;

const COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe"];

// Format angka ke rupiah
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

// Hitung total harga per kategori
function getCategoryTotals(
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

// Komponen utama chart
export default function Chart() {
  const { transaction, products } = useReportSalesData();

  const items = useMemo(() => {
    return transaction.flatMap((tr: Transaction) => tr.items);
  }, [transaction]);

  const data: ChartPieData[] = useMemo(() => {
    return getCategoryTotals(items as TransactionItem[], products);
  }, [items, products]);

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  return (
    <ChartContainer config={chartConfig} className="bg-white shadow-md rounded-xl p-4 flex-1 overflow-auto h-full w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            dataKey="value"
            label={({ name, value }) =>
              `${name}: ${((value / total) * 100).toFixed(1)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatRupiah(value)}
            labelFormatter={() => "Kategori"}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

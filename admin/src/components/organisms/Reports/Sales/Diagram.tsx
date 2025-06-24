import { ChartPieData } from "@/@types/general";
import { Product } from "@/@types/products";
import { Transaction, TransactionItem } from "@/@types/transaction";
import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies ChartConfig;

export const COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe"];

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

// Hitung total margin per kategori
function getCategoryMargins(
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

// Komponen utama chart
export default function Chart() {
  return (
    <ScrollArea className="bg-white shadow-md rounded-xl p-4 max-h-[450px]">
      <Tabs defaultValue="omzet" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="omzet">Omzet</TabsTrigger>
          <TabsTrigger value="margin">Margin</TabsTrigger>
        </TabsList>
        <TabsContent value="omzet">
          <OmzetChart />
        </TabsContent>
        <TabsContent value="margin">
          <MarginChart />
        </TabsContent>
      </Tabs>{" "}
    </ScrollArea>
  );
}

const OmzetChart = () => {
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
    <ChartContainer config={chartConfig}>
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
    </ChartContainer>
  );
};

const MarginChart = () => {
  const { transaction, products } = useReportSalesData();

  const items = useMemo(() => {
    return transaction.flatMap((tr: Transaction) => tr.items);
  }, [transaction]);

  const data: ChartPieData[] = useMemo(() => {
    return getCategoryMargins(items as TransactionItem[], products);
  }, [items, products]);

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  return (
    <ChartContainer config={chartConfig}>
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
    </ChartContainer>
  );
};

export const OmzetPerDay = () => {
  const { transaction } = useReportSalesData();

  const data = useMemo(() => {
    const grouped = new Map<string, number>();

    for (const tr of transaction) {
      const date = new Date(tr.transaction_at);
      const day = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);

      grouped.set(day, (grouped.get(day) || 0) + tr.total_amount);
    }

    return Array.from(grouped, ([name, total]) => ({ name, total }));
  }, [transaction]);

  // Validasi
  if (!transaction || transaction.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Tidak ada data transaksi.</p>
    );
  }

  if (data.length < 2) {
    return (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Data tidak cukup untuk ditampilkan.</p>
        <p>Minimal harus ada transaksi pada dua hari berbeda.</p>
      </div>
    );
  }

  // Hitung info tambahan
  const totalOmzet = data.reduce((acc, curr) => acc + curr.total, 0);
  const avgOmzet = totalOmzet / data.length;
  const bestDay = data.reduce(
    (prev, curr) => (curr.total > prev.total ? curr : prev),
    data[0]
  );

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig}>
        <LineChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [
              `Rp ${value.toLocaleString("id-ID")}`,
              "Omzet",
            ]}
            labelFormatter={(label) => `Tanggal: ${label}`}
          />

          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ChartContainer>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <div className="p-3 border rounded-lg bg-muted/50">
          <div className="text-xs font-medium">Total Omzet</div>
          <div className="text-base font-semibold text-primary">
            {formatRupiah(totalOmzet)}
          </div>
        </div>
        <div className="p-3 border rounded-lg bg-muted/50">
          <div className="text-xs font-medium">Rata-rata Per Hari</div>
          <div className="text-base font-semibold text-primary">
            {formatRupiah(avgOmzet)}
          </div>
        </div>
        <div className="p-3 border rounded-lg bg-muted/50">
          <div className="text-xs font-medium">Hari Tertinggi</div>
          <div className="text-base font-semibold text-primary">
            {bestDay.name} ({formatRupiah(bestDay.total)})
          </div>
        </div>
      </div>
    </div>
  );
};

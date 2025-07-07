import { TabsContent } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { chartConfig, formatRupiah } from "./utils";
import { useTabsContentOmzetPerDayLogics } from "./logics";

export default function TabsContentOmzetPerDay(){
  const { avgOmzet, bestDay, data, isLessData, isNoData, totalOmzet } =
    useTabsContentOmzetPerDayLogics();

  if (isNoData) {
    return (
      <p className="text-sm text-muted-foreground">Tidak ada data transaksi.</p>
    );
  }

  if (isLessData) {
    return (
      <TabsContent value="chart">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Data tidak cukup untuk ditampilkan.</p>
          <p>Minimal harus ada transaksi pada dua hari berbeda.</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="chart">
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
              {bestDay ? (
                <>
                  {bestDay.name} ({formatRupiah(bestDay.total)})
                </>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

import { TabsContent } from "@/components/ui/tabs";
import { useTabsMarginOmzetChartLogics } from "./logics";
import { ChartContainer } from "@/components/ui/chart";
import { chartConfig, COLORS, formatRupiah } from "./utils";
import { Cell, Pie, PieChart, Tooltip } from "recharts";


export default function TabsContentMarginChart(){
 const { data, total } = useTabsMarginOmzetChartLogics()

  return (
    <TabsContent value="margin">
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="50%"
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
    </TabsContent>
  );
};
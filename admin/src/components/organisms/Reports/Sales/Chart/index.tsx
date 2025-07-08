import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabsContentOmzetChart from "./TabsContentOmzetChart";
import TabsContentMarginChart from "./TabsContentMarginChart";

export default function Chart() {
  return (
    <Tabs defaultValue="omzet" className="bg-white shadow-md rounded-xl p-4">
        <TabsList>
          <TabsTrigger value="omzet">Omzet</TabsTrigger>
          <TabsTrigger value="margin">Margin</TabsTrigger>
        </TabsList>

        <TabsContentOmzetChart />

        <TabsContentMarginChart />
    </Tabs>
  );
}

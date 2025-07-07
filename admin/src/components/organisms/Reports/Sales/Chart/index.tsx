import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabsContentOmzetChart from "./TabsContentOmzetChart";
import TabsContentMarginChart from "./TabsContentMarginChart";

// Komponen utama chart
export default function Chart() {
  return (
    <ScrollArea className="bg-white shadow-md rounded-xl p-4 max-h-[450px]">
      <Tabs defaultValue="omzet" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="omzet">Omzet</TabsTrigger>
          <TabsTrigger value="margin">Margin</TabsTrigger>
        </TabsList>

        <TabsContentOmzetChart />

        <TabsContentMarginChart />
      </Tabs>{" "}
    </ScrollArea>
  );
}
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionItemTable from "./Tables";
import { OmzetPerDay } from "./Diagram";

export default function TransactionItemTabs() {
  return (
    <Tabs defaultValue="table" className="bg-white shadow-md rounded-xl p-4 h-full">
      <TabsList>
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="chart">Diagram</TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <TransactionItemTable />
      </TabsContent>
      <TabsContent value="chart">
        <OmzetPerDay />
      </TabsContent>
    </Tabs>
  );
}

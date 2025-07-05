import { Tabs } from "@/components/ui/tabs";
import { TabsContentOmzetPerDay } from "./Diagram";
import TabsContentTransactionItemTable from "./Tables";
import TabSwitcher, {
  TabOption,
} from "@/components/molecules/Tabs/TabsSwitcher";

const tabs: TabOption[] = [
  {
    label: "Table",
    value: "table",
  },
  {
    label: "Diagram",
    value: "chart",
  },
];

export default function TransactionItemTabs() {
  return (
    <Tabs
      defaultValue="table"
      className="bg-white shadow-md rounded-xl p-4 h-full"
    >
      <TabSwitcher tabs={tabs} />

      <TabsContentTransactionItemTable />

      <TabsContentOmzetPerDay />
    </Tabs>
  );
}

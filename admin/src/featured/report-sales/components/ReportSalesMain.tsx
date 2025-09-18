"use client";
import { DataTable } from "@/components/molecules/DataTable";
import { useReportSalesData } from "../provider";
import { ColumnsDef } from "./Columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ReportSalesMain() {
  const { data, columnsFilter, setColumnsFilter } = useReportSalesData();

  return (
    <main className="bg-white">
      <ScrollArea className="h-[500px] w-full overflow-auto">
        <DataTable
          data={data}
          columns={ColumnsDef}
          columnFilters={columnsFilter}
          setColumnFilters={setColumnsFilter}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  );
}

"use client";
import RetrieveHandlerCard from "@/components/molecules/Cards/RetrieveHandlerCard";
import { useReportSalesData } from "./provider";
import { getReportSalesData } from "@/lib/api/report-sales/getReportSalesData";
import FilterHandlerCard from "@/components/molecules/Cards/FilterHandlerCard";
import { DataListOption } from "@/@types/general";
import { ColumnsDef } from "./Columns";

export default function ReportSalesHeader() {
  const { setData, setColumnsFilter } = useReportSalesData();
  const retireveHandler = async (startDate: string, endDate: string) => {
    const data = await getReportSalesData(startDate, endDate);

    setData(data);
  };

  const filterColumns: DataListOption[] = ColumnsDef.map((col) => ({
    key: col.id,
    value: String(col.header),
  }));

  return (
    <header className="bg-white col-span-2 p-4">
      <h1 className="underline font-bold">Laporan Penjualan</h1>
      <div className="grid grid-cols-3 gap-4">
        <RetrieveHandlerCard
          retrieveHandler={(startDate, endDate) =>
            retireveHandler(startDate, endDate)
          }
        />
        <FilterHandlerCard
          options={filterColumns}
          setColumnsFilter={setColumnsFilter}
        />
      </div>
    </header>
  );
}

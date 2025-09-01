"use client";
import { useEffect, useState } from "react";
import { useReportSalesData } from "./provider";
import { TableReportSales } from "@/@types/transaction";
import SummaryItem from "./SummaryItem";
import { GrTransaction } from "react-icons/gr";
import { FaProductHunt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { formatToPercent, formatToRupiah } from "@/lib/utils";

export default function ReportSalesFooter() {
  const { data, columnsFilter } = useReportSalesData();
  const [filteredData, setFilteredData] = useState<TableReportSales[]>(data);

  useEffect(() => {
    if(data.length === 0) return;
    if (columnsFilter.length === 0) return setFilteredData(data);
    const dataKeys = Object.keys(data[0]);
    const filterKey = columnsFilter[0].id;
    const filterValue = columnsFilter[0].value as string;

    const selectedFilterKey = dataKeys.find((key) => key === filterKey) as
      | keyof TableReportSales
      | undefined;

    if (!selectedFilterKey) return;

    const filtered = data.filter((d) => {
      const matched = d[selectedFilterKey];

      if (typeof matched === "string")
        return matched.toLowerCase().includes(filterValue.toLowerCase());

      return null;
    });

    setFilteredData(filtered);
  }, [columnsFilter, data]);

  const transactionSet = new Set<string>(
    filteredData.map((f) => f.transaction_code)
  );
  const productSet = new Set<string>(filteredData.map((f) => f.product_code));
  const omzet = filteredData.reduce((acc, curr) => acc + curr.subtotal, 0);
  const hpp = filteredData.reduce((acc, curr) => acc + (curr.hpp ?? 0), 0);
  const margin = filteredData.reduce((acc, curr) => acc + (curr.margin ?? 0), 0);

  return (
    <footer className="bg-white col-span-2 p-4">
      <h3>Hasil Filter</h3>
      <div className="grid grid-cols-3 gap-4">
        <SummaryItem
          icon={<GrTransaction size={20} />}
          label="Transaksi"
          value={`${transactionSet.size} Transaksi`}
        />
        <SummaryItem
          icon={<FaProductHunt size={20} />}
          label="Produk"
          value={`${productSet.size} Jenis Produk`}
        />
        <SummaryItem
          icon={<MdAttachMoney size={20} />}
          label="Omzet"
          value={`${formatToRupiah(omzet)}`}
        />
        <SummaryItem
          icon={<MdAttachMoney size={20} />}
          label="HPP"
          value={`${formatToRupiah(hpp)}`}
        />
        <SummaryItem
          icon={<MdAttachMoney size={20} />}
          label="Margin"
          value={`${formatToRupiah(margin)}`}
        />
        <SummaryItem
          icon={<MdAttachMoney size={20} />}
          label="Omzet"
          value={`${formatToPercent(margin / omzet * 100)}`}
        />
      </div>
    </footer>
  );
}

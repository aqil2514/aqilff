"use client";
import { GrTransaction } from "react-icons/gr";
import { FaProductHunt } from "react-icons/fa";
import { MdAttachMoney, MdOutlineInventory } from "react-icons/md";
import { useReportSalesData } from "./provider";
import { formatToPercent, formatToRupiah } from "@/lib/utils";
import SummaryItem from "./SummaryItem";

export default function ReportSalesSummary() {
  const { statistic } = useReportSalesData();

  const omzet = statistic.total_subtotal;
  const hpp = statistic.total_hpp;
  const margin = omzet - hpp;
  const marginPercentage = (margin / omzet) * 100;

  return (
    <aside className="bg-white h-[500px] p-6 space-y-4 border-l border-gray-200 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
        Ringkasan Laporan Penjualan
      </h2>

      <ul className="space-y-3">
        <SummaryItem
          icon={<GrTransaction size={20} />}
          label="Transaksi"
          value={`${statistic.total_transactions} transaksi`}
        />
        <SummaryItem
          icon={<FaProductHunt size={20} />}
          label="Produk"
          value={`${statistic.total_unique_products_sold} produk`}
        />
        <SummaryItem
          icon={<MdAttachMoney size={20} />}
          label="Omzet"
          value={formatToRupiah(omzet)}
        />
        <SummaryItem
          icon={<MdOutlineInventory size={20} />}
          label="Harga Pokok"
          value={formatToRupiah(hpp)}
        />
        <SummaryItem
          icon={<MdAttachMoney size={20} />}
          label="Margin Kotor"
          value={formatToRupiah(margin)}
        />
        <SummaryItem
          icon={<MdAttachMoney size={20} />}
          label="Margin %"
          value={formatToPercent(marginPercentage)}
        />
      </ul>
    </aside>
  );
}


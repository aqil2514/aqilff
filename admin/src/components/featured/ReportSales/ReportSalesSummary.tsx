"use client";
import { GrTransaction } from "react-icons/gr";
import { FaProductHunt } from "react-icons/fa";
import { MdAttachMoney, MdOutlineInventory } from "react-icons/md";
import { useReportSalesData } from "./provider";
import { formatToPercent, formatToRupiah } from "@/lib/utils";

export default function ReportSalesSummary() {
  const { data, statistic } = useReportSalesData();

  const transactionSet = new Set<string>(
    data.map((trx) => trx.transaction_code)
  );
  const productSet = new Set<string>(data.map((trx) => trx.product_code));

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
          value={`${transactionSet.size} transaksi`}
        />
        <SummaryItem
          icon={<FaProductHunt size={20} />}
          label="Produk"
          value={`${productSet.size} produk`}
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

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border">
      <div className="text-gray-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-semibold text-gray-700">{value}</span>
      </div>
    </li>
  );
}

import ReportSalesTemplate from "@/components/templates/Reports/ReportSalesTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Penjualan",
};

export default function ReportSales() {
  return <ReportSalesTemplate />;
}

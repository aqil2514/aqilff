import TransactionTemplate from "@/components/templates/TransactionTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaksi",
};

export const dynamic = "force-static";
export default function TransactionPage() {
  return <TransactionTemplate />;
}

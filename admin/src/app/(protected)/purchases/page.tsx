import PurchaseTemplate from "@/components/templates/PurchasesTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembelian",
};

export default function PurchasePage() {
  return <PurchaseTemplate />;
}

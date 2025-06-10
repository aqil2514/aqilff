import PurchasePlanningTemplate from "@/components/templates/Tools/PurchasePlanningTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rencana Pembelian",
};

export default function PurchasePlanningPage() {
  return <PurchasePlanningTemplate /> ;
}

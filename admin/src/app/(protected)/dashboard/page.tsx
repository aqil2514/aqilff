import DashboardTemplate from "@/components/templates/Navigations/DashboardTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return <DashboardTemplate />;
}

"use client";

import useSWR from "swr";
import MainWrapper from "../../atoms/main-wrapper";
import SummarySection from "@/components/featured/Dashboard/SummarySection";
import { getDashboardRss } from "@/lib/api/dashboard/getDashboardRss";

export default function DashboardTemplate() {
  const { data, error } = useSWR("/dashboard", getDashboardRss);

  if (error) {
    <MainWrapper>Terjadi kesalahan</MainWrapper>;
  }

  const transactionStatistic = data?.statistic;
  return (
    <MainWrapper>
      <h1 className="font-bold mb-4 text-center text-2xl">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen gap-4">
        <SummarySection data={transactionStatistic} />
        <div>Soon</div>
        <div>Soon</div>
        <div>Soon</div>
      </div>
    </MainWrapper>
  );
}

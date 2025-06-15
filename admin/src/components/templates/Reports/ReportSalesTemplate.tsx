"use client";

import TransactionItemTabs from "@/components/organisms/Reports/Sales/Tab";
import MainWrapper from "../../atoms/main-wrapper";
import Chart from "../../organisms/Reports/Sales/Diagram";
import Summary from "../../organisms/Reports/Sales/Summary";
import ReportSalesProvider from "../../providers/ReportSalesProvider";

export default function ReportSalesTemplate() {
  return (
    <ReportSalesProvider>
      <MainWrapper className="grid grid-cols-[60%_auto] pt-20 px-4 pb-6 bg-gray-50 min-h-screen overflow-auto">
        <TransactionItemTabs />

        <div className="flex flex-col gap-4">
          <Summary />

          <Chart />
        </div>
      </MainWrapper>
    </ReportSalesProvider>
  );
}

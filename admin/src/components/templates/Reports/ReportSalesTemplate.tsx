"use client";

import TransactionItemTabs from "@/components/organisms/Reports/Sales/Tab";
import MainWrapper from "../../atoms/main-wrapper";
import Chart from "../../organisms/Reports/Sales/Chart";
import Summary from "../../organisms/Reports/Sales/Summary";
import ReportSalesProvider from "../../providers/ReportSalesProvider";
import FilterControl from "@/components/organisms/Reports/Sales/FilterControl";

export default function ReportSalesTemplate() {
  return (
    <ReportSalesProvider>
      <MainWrapper className="block py-16 px-2 md:px-8 bg-gray-50 space-y-2 overflow-y-auto">
        <FilterControl />

        <div className="grid grid-cols-1 md:grid-cols-[60%_auto] gap-4">
          <TransactionItemTabs />

          <div className="flex flex-col gap-4">
            <Summary />

            <Chart />
          </div>
        </div>
      </MainWrapper>
    </ReportSalesProvider>
  );
}

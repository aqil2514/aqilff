"use client";

import MainWrapper from "../../atoms/main-wrapper";
import Chart from "../../organisms/Reports/Sales/Diagram";
import Summary from "../../organisms/Reports/Sales/Summary";
import Table from "../../organisms/Reports/Sales/Tables";
import ReportSalesProvider from "../../providers/ReportSalesProvider";

export default function ReportSalesTemplate() {
  return (
    <ReportSalesProvider>
      <MainWrapper className="grid grid-cols-[60%_auto] pt-20 px-4 pb-6 bg-gray-50 min-h-screen overflow-auto">
        <Table />

        <div className="grid grid-rows-2 gap-4">
          <Summary />

          <Chart />
        </div>
      </MainWrapper>
    </ReportSalesProvider>
  );
}

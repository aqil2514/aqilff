"use client";
import MainWrapper from "../atoms/main-wrapper";
import Chart from "../organisms/Reports/Sales/Diagram";
import Summary from "../organisms/Reports/Sales/Summary";
import Table from "../organisms/Reports/Sales/Tables";
import ReportSalesProvider from "../providers/ReportSalesProvider";

export default function ReportSalesTemplate() {
  return (
    <ReportSalesProvider>
      <MainWrapper className="pt-20 px-4 pb-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 h-[calc(100vh-5rem)]">
          <div className="bg-white shadow-md rounded-xl p-4 overflow-auto">
            <Table />
          </div>

          <div className="flex flex-col gap-4 h-full">
            <div className="bg-white shadow-md rounded-xl p-4 flex-1 overflow-auto">
              <Summary />
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 flex-1 overflow-auto">
              <Chart />
            </div>
          </div>
        </div>
      </MainWrapper>
    </ReportSalesProvider>
  );
}

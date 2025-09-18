// "use client";

import MainWrapper from "@/components/atoms/main-wrapper";
import ReportSalesProvider from "@/featured/report-sales/provider";
import ReportSalesFooter from "@/featured/report-sales/components/ReportSalesFooter";
import ReportSalesHeader from "@/featured/report-sales/components/ReportSalesHeader";
import ReportSalesMain from "@/featured/report-sales/components/ReportSalesMain";
import ReportSalesSummary from "@/featured/report-sales/components/ReportSalesSummary";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ReportSalesTemplate() {
  return (
    <ReportSalesProvider>
      <MainWrapper className="bg-gray-50 space-y-4">
        <ReportSalesHeader />

        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <ReportSalesMain />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25}>
            <ReportSalesSummary />
          </ResizablePanel>
        </ResizablePanelGroup>

        <ReportSalesFooter />
      </MainWrapper>
    </ReportSalesProvider>
  );
}

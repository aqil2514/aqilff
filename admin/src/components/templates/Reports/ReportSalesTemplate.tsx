// "use client";

import MainWrapper from "@/components/atoms/main-wrapper";
import ReportSalesProvider from "@/components/featured/ReportSales/provider";
import ReportSalesFooter from "@/components/featured/ReportSales/ReportSalesFooter";
import ReportSalesHeader from "@/components/featured/ReportSales/ReportSalesHeader";
import ReportSalesMain from "@/components/featured/ReportSales/ReportSalesMain";
import ReportSalesSummary from "@/components/featured/ReportSales/ReportSalesSummary";
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

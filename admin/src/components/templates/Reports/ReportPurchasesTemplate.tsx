"use client"
import MainWrapper from "../../atoms/main-wrapper";
import ReportPurchaseSummary from "../../organisms/Reports/Purchases/Summary";
import ReportPurchaseTable from "../../organisms/Reports/Purchases/Tables";
import ReportPurchaseProvider from "../../providers/ReportPurchaseProvider";

export default function ReportPurchaseTemplate() {
  return (
    <ReportPurchaseProvider>
      <MainWrapper className="!grid grid-cols-[70%_auto] px-4 pb-4 pt-16 justify-normal">
        <ReportPurchaseTable />
        <ReportPurchaseSummary />
      </MainWrapper>
    </ReportPurchaseProvider>
  );
}

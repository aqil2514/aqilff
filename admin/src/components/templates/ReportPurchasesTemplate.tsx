"use client"
import MainWrapper from "../atoms/main-wrapper";
import ReportPurchaseSummary from "../organisms/Reports/Purchases/Summary";
import ReportPurchaseProvider from "../providers/ReportPurchaseProvider";

export default function ReportPurchaseTemplate() {
  return (
    <ReportPurchaseProvider>
      <MainWrapper className="!grid grid-cols-[70%_auto] px-4 pb-4 pt-16 justify-normal">
        <div className="bg-white shadow-2xl h-full w-full rounded-2xl p-4">
          Table
        </div>
        <ReportPurchaseSummary />
      </MainWrapper>
    </ReportPurchaseProvider>
  );
}

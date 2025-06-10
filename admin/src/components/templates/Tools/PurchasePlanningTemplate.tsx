"use client";
import MainWrapper from "@/components/atoms/main-wrapper";
import PurchasePlanningDialog from "@/components/organisms/Tools/PurchasePlanning/Dialog";

export default function PurchasePlanningTemplate() {
  return (
    <MainWrapper className="!block pt-16 px-4">
      <div>
        <PurchasePlanningDialog type="addForm" />
      </div>
      <div>Table</div>
      <div>footer</div>
    </MainWrapper>
  );
}

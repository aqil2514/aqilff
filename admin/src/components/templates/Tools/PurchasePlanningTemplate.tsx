"use client";
import MainWrapper from "@/components/atoms/main-wrapper";
import { RetrieveDataPopover } from "@/components/molecules/RetrieveData";
import PurchasePlanningDialog from "@/components/organisms/Tools/PurchasePlanning/Dialog";
import PurchasePlanItemProvider, {
  usePurchasePlanItemData,
} from "@/components/providers/PurchasePlanItemProvider";
import { fetchPurchaseResources } from "@/lib/fetchers";
import useSWR from "swr";

export default function PurchasePlanningTemplate() {
  const {
    data: resource,
    isLoading,
    error,
  } = useSWR("/api/purchases/get-resource", fetchPurchaseResources);

  if (isLoading) return <MainWrapper>Loading data...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat data!</MainWrapper>;
  if (!resource) return null;

  return (
    <PurchasePlanItemProvider resource={resource}>
      <InnerContext />
    </PurchasePlanItemProvider>
  );
}

const InnerContext = () => {
  const {
    dateRange,
    isLoadingPurchasePlanItem,
    setData,
    setDateRange,
    setIsLoadingPurchasePlanItem,
  } = usePurchasePlanItemData();
  return (
    <MainWrapper className="!block pt-16 px-4">
      <div className="space-x-2">
        {dateRange && <PurchasePlanningDialog type="addForm" />}
        <RetrieveDataPopover
          data_src="purchasePlanning"
          isLoading={isLoadingPurchasePlanItem}
          setIsLoading={setIsLoadingPurchasePlanItem}
          setDateRange={setDateRange}
          setData={setData}
        />
      </div>
      <div>Table</div>
      <div>footer</div>
    </MainWrapper>
  );
};

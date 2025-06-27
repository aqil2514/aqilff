"use client";
import MainWrapper from "@/components/atoms/main-wrapper";
import { RetrieveDataPopover } from "@/components/molecules/RetrieveData";
import PurchasePlanningDialog from "@/components/organisms/Tools/PurchasePlanning/Dialog";
import PurchasePlanningTable from "@/components/organisms/Tools/PurchasePlanning/Table";
import PurchasePlanItemProvider, {
  usePurchasePlanItemData,
} from "@/components/providers/PurchasePlanItemProvider";
import { Button } from "@/components/ui/button";
import { fetchPurchaseResources } from "@/lib/fetchers";
import { BiSelectMultiple } from "react-icons/bi";
import { TbBoxMultiple } from "react-icons/tb";
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
    isMultipleSelectionRow,
    setIsMultipleSelectionRow,
  } = usePurchasePlanItemData();
  return (
    <MainWrapper className="!block pt-16 px-4 space-y-2">
      <div className="space-x-2">
        {dateRange && (
          <>
            <PurchasePlanningDialog type="addForm" />
            <Button
              className="bg-amber-600 cursor-pointer duration-100 hover:bg-amber-500 active:scale-95"
              onClick={() => {
                setIsMultipleSelectionRow(!isMultipleSelectionRow);
              }}
            >
              {isMultipleSelectionRow ? (
                <>
                  <BiSelectMultiple />
                  Mode : Multiple
                </>
              ) : (
                <>
                  <TbBoxMultiple />
                  Mode : Single
                </>
              )}
            </Button>
          </>
        )}
        <RetrieveDataPopover
          data_src="purchasePlanning"
          isLoading={isLoadingPurchasePlanItem}
          setIsLoading={setIsLoadingPurchasePlanItem}
          setDateRange={setDateRange}
          setData={setData}
        />
      </div>
      <PurchasePlanningTable />
      <div>footer</div>
    </MainWrapper>
  );
};

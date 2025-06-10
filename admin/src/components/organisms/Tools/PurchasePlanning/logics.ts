import { usePurchasePlanningFormContext } from "./FormProvider";

export const usePurchasePlanningFormLogic = () => {
  const { form } = usePurchasePlanningFormContext();
  const { register } = form;

  return { register };
};

export const usePurchasePlanningFormAutomateLogic = () => {
  const { form } = usePurchasePlanningFormContext();
  const { watch } = form;

  const itemName = watch("itemName")?.trim() || "Belum ditentukan";
  const sourceItem = watch("sourceItem");

  const quantityPerPack = watch("quantityPerPack");
  const packCount = watch("packCount");
  const totalQty = quantityPerPack * packCount;

  const purchasePrice = watch("purchasePrice");
  const hpp = purchasePrice / quantityPerPack;

  const sellingPrice = watch("sellingPrice");
  const margin = sellingPrice - hpp;
  const marginFromBuy = (margin / hpp) * 100;
  const marginFromSelling = (margin / sellingPrice) * 100;

  const totalPurchase = purchasePrice * packCount;
  const totalSellingPrice = sellingPrice * totalQty;
  const profit = totalSellingPrice - totalPurchase;

  const purchaseSummary = {
    itemName,
    sourceItem,
    packCount,
    totalQty,
    purchasePrice,
    hpp,
    sellingPrice,
    margin,
    marginFromBuy,
    marginFromSelling,
    totalPurchase,
    totalSellingPrice,
    profit,
  };

  return { purchaseSummary };
};

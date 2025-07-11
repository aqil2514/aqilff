import { SubmitHandler } from "react-hook-form";
import { usePurchasePlanningFormContext } from "./FormProvider";
import { PurchasePlanItem } from "@/@types/purchases";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { Row } from "@tanstack/react-table";

export const usePurchasePlanningFormLogic = () => {
  const { form, isLoading, setIsLoading } = usePurchasePlanningFormContext();
  const { register, handleSubmit } = form;

  const submitHandler: SubmitHandler<PurchasePlanItem> = async (formData) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "/api/tools/purchase-planning",
        formData
      );

      toast(data.message, { type: "success" });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast(data.message, { type: "error" });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, handleSubmit, submitHandler, isLoading };
};

export const usePurchasePlanningFormAutomateLogic = () => {
  const { form } = usePurchasePlanningFormContext();
  if(!form) return {}
  const { watch, setValue } = form;

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

  setValue("marginFromSelling", marginFromSelling);
  setValue("marginFromCost", marginFromBuy);
  setValue("marginPerItem", margin);
  setValue("profit", profit);
  setValue("totalPurchaseValue", totalPurchase);
  setValue("totalSellingValue", totalSellingPrice);

  return { purchaseSummary };
};

export const usePurchasePlanningItemDetailLogic = (
  row: Row<PurchasePlanItem>
) => {
  const dbData = row.original;

  const itemName = dbData.itemName?.trim() || "Belum ditentukan";
  const sourceItem = dbData.sourceItem;

  const quantityPerPack = dbData.quantityPerPack;
  const packCount = dbData.packCount;
  const totalQty = quantityPerPack * packCount;

  const purchasePrice = dbData.purchasePrice;
  const hpp = dbData.totalPurchaseValue / (dbData.packCount * dbData.quantityPerPack);

  const sellingPrice = dbData.sellingPrice;
  const margin = sellingPrice - hpp;
  const marginFromBuy = margin / hpp * 100;
  const marginFromSelling = margin / sellingPrice * 100;

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
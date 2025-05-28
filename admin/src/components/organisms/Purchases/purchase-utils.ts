import { Purchase, PurchaseItem } from "@/@types/purchases";
import { DialogType } from "./Form";
import { getLocalDateTimeValue } from "@/lib/utils";
import { Row } from "@tanstack/react-table";

export const defaultPurchaseItemValue: PurchaseItem = {
  hpp: 0,
  price: 0,
  quantity: 1,
  remaining_quantity: 1,
  product_name: "",
};

export const getPurchaseDefaultValue: (
  type: DialogType,
  row: Row<Purchase>
) => Purchase = (type, row) => {
  if (type === "add-form") return getDefaultAddFormValue();
  if (type === "edit-form") return getDefaultEditFormValue(row);

  return {} as Purchase;
};

const getDefaultAddFormValue: () => Purchase = () => {
  const value: Purchase = {
    purchase_code: "",
    purchase_date: getLocalDateTimeValue(),
    items: [defaultPurchaseItemValue],
  };

  return value;
};

const getDefaultEditFormValue: (row: Row<Purchase>) => Purchase = (row) =>
  row.original;

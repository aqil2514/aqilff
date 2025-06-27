import { formatToPercent, formatToRupiah, isValidUrl } from "@/lib/utils";
import { ShoppingCart, Package, BadgeDollarSign } from "lucide-react";
import { JSX } from "react";
import { usePurchasePlanningFormAutomateLogic } from "./logics";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface PurchasePlanItemFormDataAutomateProps {
  data?: {
    itemName: string;
    sourceItem: string;
    packCount: number;
    totalQty: number;
    purchasePrice: number;
    hpp: number;
    sellingPrice: number;
    margin: number;
    marginFromBuy: number;
    marginFromSelling: number;
    totalPurchase: number;
    totalSellingPrice: number;
    profit: number;
  };
}

export default function FormDataAutomate({
  data,
}: PurchasePlanItemFormDataAutomateProps) {
  const logic = usePurchasePlanningFormAutomateLogic(); // tetap panggil di atas

  const purchaseSummary = data ?? logic.purchaseSummary;

  if(!purchaseSummary) throw new Error("Purchase Summary tidak ada")

  const {
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
  } = purchaseSummary;

  const itemNameValue = isValidUrl(sourceItem) ? (
    <a
      href={sourceItem}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {itemName}
    </a>
  ) : (
    <div className="flex items-center gap-2">
      <span>{itemName}</span>
      {sourceItem && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-xs text-blue-500 underline hover:text-blue-700">
              lihat asal
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 text-sm">
            <p className="text-gray-500 mb-1">Asal barang:</p>
            <p className="font-medium text-gray-800">{sourceItem}</p>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );

  const infoList: {
    label: string;
    value: string | number | JSX.Element;
    icon?: JSX.Element;
  }[] = [
    {
      label: "Nama Item",
      value: itemNameValue,
      icon: <ShoppingCart className="w-4 h-4 text-primary" />,
    },
    {
      label: "Kuantiti",
      value: `${packCount} Pak (${totalQty} pcs)`,
      icon: <Package className="w-4 h-4 text-primary" />,
    },
    {
      label: "Harga Beli Per Pak",
      value: `${formatToRupiah(purchasePrice)} (${formatToRupiah(hpp)} / 1pcs)`,
    },
    {
      label: "Harga Jual",
      value: `${formatToRupiah(sellingPrice)} / 1pcs`,
    },
    {
      label: "Margin",
      value: `${formatToRupiah(margin)} / 1pcs`,
    },
    {
      label: "Margin Beli",
      value: `${formatToPercent(marginFromBuy)}`,
    },
    {
      label: "Margin Jual",
      value: `${formatToPercent(marginFromSelling)}`,
    },
    {
      label: "Total Harga Beli",
      value: `${formatToRupiah(totalPurchase)}`,
    },
    {
      label: "Total Perkiraan Nilai Jual",
      value: `${formatToRupiah(totalSellingPrice)}`,
    },
    {
      label: "Profit",
      value: `${formatToRupiah(profit)}`,
      icon: <BadgeDollarSign className="w-4 h-4 text-green-600" />,
    },
  ];

  return (
    <div className="px-4 py-6 bg-white rounded-2xl shadow-md">
      {!data && <h2 className="text-center text-xl font-bold mb-6 text-gray-800">
        Identitas Pembelian Barang
      </h2>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {infoList.map(({ label, value, icon }, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200"
          >
            {icon && <div className="mt-1">{icon}</div>}
            <div>
              <p className="text-gray-500 font-medium">{label}</p>
              <div className="font-semibold text-gray-800">{value}</div>{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { usePurchasePlanningFormLogic } from "./logics";
import { Input } from "@/components/ui/input";
import { usePurchasePlanningFormContext } from "./FormProvider";

export default function PurchasePlanningForm() {
  const { type } = usePurchasePlanningFormContext();
  if (type === "addForm") return <AddForm />;
  return null;
}

const AddForm = () => {
  const { register } = usePurchasePlanningFormLogic();
  return (
    <div className="px-4">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="itemName">Nama Item</Label>
          <Input type="text" id="itemName" {...register("itemName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sourceItem">Asal</Label>
          <Input type="text" id="sourceItem" {...register("sourceItem")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="packCount">Jumlah Pak</Label>
          <Input type="number" id="packCount" {...register("packCount")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantityPerPack">Jumlah Kuantiti Per Pak</Label>
          <Input
            type="number"
            id="quantityPerPack"
            {...register("quantityPerPack")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Harga Beli Per Pack</Label>
          <Input
            type="number"
            id="purchasePrice"
            {...register("purchasePrice")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Harga Jual Satuan</Label>
          <Input
            type="number"
            id="sellingPrice"
            {...register("sellingPrice")}
          />
        </div>
      </form>
    </div>
  );
};

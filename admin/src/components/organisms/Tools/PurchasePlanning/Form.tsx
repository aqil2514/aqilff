import { Label } from "@/components/ui/label";
import { usePurchasePlanningFormLogic } from "./logics";
import { Input } from "@/components/ui/input";
import { usePurchasePlanningFormContext } from "./FormProvider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchasePlanItem } from "@/@types/purchases";
import { useState } from "react";

export default function PurchasePlanningForm() {
  const { type } = usePurchasePlanningFormContext();
  if (type === "addForm") return <AddForm />;
  return null;
}

const AddForm = () => {
  const { register, handleSubmit, submitHandler, isLoading } =
    usePurchasePlanningFormLogic();
  return (
    <div className="px-4">
      <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
        <div className="space-y-2">
          <Label htmlFor="itemName">Nama Item</Label>
          <Input
            disabled={isLoading}
            type="text"
            id="itemName"
            {...register("itemName")}
          />
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              disabled={isLoading}
              type="text"
              id="category"
              {...register("category")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sourceItem">Asal</Label>
          <Input
            disabled={isLoading}
            type="text"
            id="sourceItem"
            {...register("sourceItem")}
          />
        </div>
        <StatusPlanSelect />
        <div className="space-y-2">
          <Label htmlFor="packCount">Jumlah Pak</Label>
          <Input
            disabled={isLoading}
            type="number"
            id="packCount"
            {...register("packCount")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantityPerPack">Jumlah Kuantiti Per Pak</Label>
          <Input
            disabled={isLoading}
            type="number"
            id="quantityPerPack"
            {...register("quantityPerPack")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Harga Beli Per Pack</Label>
          <Input
            disabled={isLoading}
            type="number"
            id="purchasePrice"
            {...register("purchasePrice")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Harga Jual Satuan</Label>
          <Input
            disabled={isLoading}
            type="number"
            id="sellingPrice"
            {...register("sellingPrice")}
          />

          <Button
            disabled={isLoading}
            className="disabled:bg-green-300 disabled:cursor-not-allowed bg-green-500 hover:scale-95 hover:bg-green-600 cursor-pointer active:scale-90"
          >
            {isLoading ? "Menambah Data..." : "Tambah Data"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const StatusPlanSelect = () => {
  const { form } = usePurchasePlanningFormContext();
  const { setValue } = form;

  const [desc, setDesc] = useState<string>("");
  const status: PurchasePlanItem["status"][] = [
    "Arrived",
    "Collecting",
    "Delivery",
    "Fixed",
    "Planning",
  ];

  const statusDescription: Record<PurchasePlanItem["status"], string> = {
    Collecting: "Barang sedang dalam pengumpulan",
    Fixed: "Barang sudah fix dan akan dibeli",
    Planning: "Barang baru planning akan dibeli",
    Delivery: "Barang sedang dalam pengiriman",
    Arrived: "Barang sudah sampai",
  };
  return (
    <div className="space-y-2">
      <Label>Status Pembelian</Label>
      <Select
        onValueChange={(e) => {
          setValue("status", e);
          setDesc(statusDescription[e]);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status Pembelian" />
        </SelectTrigger>
        <SelectContent>
          {status.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground">{desc && "Keterangan : " + desc}</p>
    </div>
  );
};

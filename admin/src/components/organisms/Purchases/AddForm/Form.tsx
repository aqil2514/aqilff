import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListForm, usePurchaseAddTransactionLogics } from "./logics";
import { Button } from "@/components/ui/button";
import { IoBarcode } from "react-icons/io5";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Purchase } from "@/@types/purchases";
import React from "react";
import { defaultPurchaseItemValue } from "../purchase-utils";
import { IoMdAddCircle } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";

export default function PurchaseAddForm() {
  const { register, getCode, list, isLoading, purchaseSubmit, ...restProps } =
    usePurchaseAddTransactionLogics();
  return (
    <>
      <form
        className="my-4 space-y-4"
        onSubmit={restProps.handleSubmit(purchaseSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="purchase_date">Waktu Pembelian</Label>
          <Input
            id="purchase_date"
            type="datetime-local"
            {...register("purchase_date")}
          />
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Label htmlFor="purchase_code">Kode Pembelian :</Label>
            <Button
              type="button"
              variant={"ghost"}
              className="cursor-pointer"
              onClick={getCode}
            >
              <IoBarcode />
            </Button>
          </div>
          <Input id="purchase_code" {...register("purchase_code")} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier_name">Nama Supplier :</Label>
          <Input
            id="supplier_name"
            list="supplier-name-list"
            {...register("supplier_name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier_type">Tipe Supplier :</Label>
          <Input
            id="supplier_type"
            list="supplier-type-list"
            {...register("supplier_type")}
          />
        </div>
        <div className="border rounded-2xl px-2 py-2 space-y-4">
          <p className="italic">Barang yang dibeli</p>
          <PurchaseItem register={register} list={list} {...restProps} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Keterangan :</Label>
          <Textarea id="notes" {...register("notes")} />
        </div>
        <div className="flex gap-2 items-center">
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 cursor-pointer"
          >
            {isLoading ? "Menyimpan" : "Simpan Pembelian"}
          </Button>
          <Button
            className="cursor-pointer"
            type="button"
            onClick={() => restProps.reset()}
          >
            Reset
          </Button>
        </div>
      </form>

      <datalist id="supplier-name-list">
        {list.supplierName().map((li) => (
          <option value={li} key={li} />
        ))}
      </datalist>
      <datalist id="supplier-type-list">
        {list.supplierType().map((li) => (
          <option value={li} key={li} />
        ))}
      </datalist>
    </>
  );
}

interface PurchaseItemProps {
  fields: FieldArrayWithId<Purchase, "items", "id">[];
  watch: UseFormWatch<Purchase>;
  register: UseFormRegister<Purchase>;
  list: ListForm;
  append: UseFieldArrayAppend<Purchase, "items">;
  remove: UseFieldArrayRemove;
  setValue: UseFormSetValue<Purchase>;
}

const PurchaseItem: React.FC<PurchaseItemProps> = ({
  fields,
  watch,
  register,
  list,
  append,
  remove,
  setValue,
}) => {
  return (
    <>
      {fields.map((field, index) => {
        const quantity = watch(`items.${index}.quantity`);
        const price = watch(`items.${index}.price`);
        const hpp = (price / quantity).toFixed(0);

        return (
          <div key={field.id} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`items.${index}.product_name`}>
                Nama Produk :{" "}
              </Label>
              <Input
                list="product-name-list"
                id={`items.${index}.product_name`}
                {...register(`items.${index}.product_name`)}
                onBlur={(e) => {
                  const selectedProd = list
                    .productName()
                    .filter((prod) => prod.name === e.target.value)[0];
                  if (!selectedProd) return;

                  setValue(`items.${index}.product_id`, selectedProd.id);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`items.${index}.quantity`}>Kuantiti : </Label>
              <Input
                type="number"
                id={`items.${index}.quantity`}
                {...register(`items.${index}.quantity`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`items.${index}.remaining_quantity`}>
                Kuantiti Tersisa :{" "}
              </Label>
              <Input
                type="number"
                id={`items.${index}.remaining_quantity`}
                disabled
                value={quantity}
                {...register(`items.${index}.remaining_quantity`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`items.${index}.price`}>Harga : </Label>
              <Input
                type="number"
                step={500}
                id={`items.${index}.price`}
                {...register(`items.${index}.price`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`items.${index}.hpp`}>
                Harga per Produk (HPP) :{" "}
              </Label>
              <Input
                type="number"
                step={500}
                id={`items.${index}.hpp`}
                readOnly
                onChange={(e) => {
                  setValue(`items.${index}.hpp`, Number(e.target.value))
                }}
                value={hpp}
                disabled
              />
            </div>
          </div>
        );
      })}

      <div className="space-x-2">
        <Button
          type="button"
          variant={"ghost"}
          className="cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={() => append(defaultPurchaseItemValue)}
        >
          <IoMdAddCircle />
        </Button>
        {fields.length > 1 && (
          <Button
            type="button"
            variant={"ghost"}
            className="cursor-pointer text-red-500 hover:text-red-600"
            onClick={() => remove(0)}
          >
            <FaTrashAlt />
          </Button>
        )}
      </div>

      <datalist id="product-name-list">
        {list.productName().map((li) => (
          <option value={li.name} key={li.id} />
        ))}
      </datalist>
    </>
  );
};

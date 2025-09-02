import InventoryCombobox from "@/components/atoms/Combobox/InventoryCombobox";
import { DatePicker } from "@/components/molecules/Date/DatePicker";
import { useAddTransactionData } from "@/components/providers/AddTransactionProvider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getHPPItem } from "@/lib/api/transaction/clientApiHelper";
import { productMapper } from "@/lib/mapper/products.mapper";
import { cn, formatToPercent, formatToRupiah } from "@/lib/utils";
import {
  transactionSchema,
  TransactionSchemaType,
} from "@/schema/transaction-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { Plus, RefreshCcw, SkipBack, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";

// const defaultForm: TransactionSchemaType = {
//   customer_name: "",
//   payment_method: "cash",
//   transaction_at: new Date(),
//   transaction_code: "",
//   transaction_items: [
//     {
//       discount: 0,
//       hpp: 0,
//       margin: 0,
//       product_id: "",
//       quantity: 1,
//       subtotal: 0,
//       tip: 0,
//     },
//   ],
//   notes: "",
// };

const defaultForm: TransactionSchemaType = {
  customer_name: "",
  payment_method: "cash",
  transaction_at: new Date(),
  transaction_code: "",
  transaction_items: [
    {
      discount: 0,
      hpp: 0,
      margin: 0,
      product_name: "",
      product_id: "",
      quantity: 1,
      subtotal: 0,
      tip: 0,
    },
  ],
  notes: "",
};

interface TransactionFormProps {
  defaultValuesForm?: TransactionSchemaType;
  handler: (values: TransactionSchemaType) => Promise<void> | void;
}

export default function TransactionForm({
  handler,
  defaultValuesForm,
}: TransactionFormProps) {
  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValuesForm ?? defaultForm,
  });
  const [isGettingCode, setIsGettingCode] = useState<boolean>(false);

  const getTransactionCode = async () => {
    try {
      setIsGettingCode(true);
      const { data } = await axios.get(`/api/transaction/get-code`, {
        params: {
          start: form.getValues("transaction_at"),
          end: form.getValues("transaction_at"),
        },
      });

      toast.success(data.message ?? "Kode berhasil dibuat");
      form.setValue("transaction_code", data.newCode);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast.error(data.message ?? "Terjadi kesalahan");
      }
    } finally {
      setIsGettingCode(false);
    }
  };

  const resetHandler = () => {
    form.reset(defaultValuesForm ?? defaultForm);
    form.setFocus("transaction_code");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="space-y-8 bg-white px-4 py-8 rounded-2xl shadow-2xl"
      >
        <Link href={"/transactions"}>
          <Button
            type="button"
            size={"icon"}
            variant={"ghost"}
            className="cursor-pointer"
          >
            <SkipBack />
          </Button>
        </Link>

        <FormField
          control={form.control}
          name="transaction_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Transaksi</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={"ghost"}
                    disabled={isGettingCode || isSubmitting}
                    onClick={getTransactionCode}
                    className={cn(
                      "cursor-pointer block my-auto",
                      isGettingCode && "animate-spin"
                    )}
                  >
                    <RefreshCcw />
                  </Button>
                  <Input
                    disabled
                    placeholder="Contoh : 250501...."
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Kode transaksi dihasilkan otomatis
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transaction_at"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pembeli</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Contoh : Pembeli 1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metode Pembayaran</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Contoh : cash..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ItemForm form={form} />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  placeholder="Contoh : cash..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-700 cursor-pointer"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>

          <Button
            type="button"
            variant={"ghost"}
            disabled={isSubmitting}
            className="cursor-pointer"
            onClick={resetHandler}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

const ItemForm: React.FC<{ form: UseFormReturn<TransactionSchemaType> }> = ({
  form,
}) => {
  const { products } = useAddTransactionData();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "transaction_items",
  });

  // const blurHandler = async (
  //   index: number,
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const target = e.target as HTMLInputElement;
  //   const selectedProduct = products.find((prod) => prod.name === target.value);
  //   if (!target.value) return;

  //   if (!selectedProduct) {
  //     target.value = "";
  //     toast.error("Nama produk tidak ditemukan");
  //     return;
  //   }

  //   form.setValue(
  //     `transaction_items.${index}.product_id`,
  //     String(selectedProduct?.id)
  //   );

  //   form.setValue(
  //     `transaction_items.${index}.subtotal`,
  //     Number(selectedProduct?.price)
  //   );

  //   try {
  //     const hpp = await getHPPItem(selectedProduct!.id);
  //     form.setValue(`transaction_items.${index}.hpp`, hpp);
  //   } catch (error) {
  //     console.error(error);
  //     target.value = "";
  //     toast.info(
  //       `Stok "${selectedProduct?.name}" di database tidak tersedia. Harap tindaklanjuti`
  //     );
  //   }
  // };

  const selectHandler = async (value: string, index: number) => {
    const selectedProduct = products.find((prod) => prod.name === value);
    if (!value) return;

    if (!selectedProduct) {
      value = "";
      toast.error("Nama produk tidak ditemukan");
      return;
    }

    form.setValue(
      `transaction_items.${index}.product_id`,
      String(selectedProduct?.id)
    );

    form.setValue(
      `transaction_items.${index}.subtotal`,
      Number(selectedProduct?.price)
    );

    try {
      const hpp = await getHPPItem(selectedProduct!.id);
      form.setValue(`transaction_items.${index}.hpp`, hpp);
    } catch (error) {
      console.error(error);
      value = "";
      toast.info(
        `Stok "${selectedProduct?.name}" di database tidak tersedia. Harap tindaklanjuti`
      );
    }
  };

  const transactionItems = form.watch("transaction_items");

  const total = transactionItems.reduce(
    (acc, item) => {
      const qty = item.quantity || 0;
      const subtotal = (item.subtotal || 0) * qty;
      const hpp = (item.hpp || 0) * qty;
      const tip = item.tip || 0;
      const discount = item.discount || 0;
      const margin = subtotal + tip - (hpp + discount);

      acc.subtotal += subtotal + tip - discount;
      acc.hpp += hpp;
      acc.margin += margin;
      return acc;
    },
    { subtotal: 0, hpp: 0, margin: 0 }
  );

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="border border-gray-300 rounded-2xl p-4 space-y-4">
      <ProductNameList />

      {fields.map((item, index) => {
        const quantity = form.watch(`transaction_items.${index}.quantity`);
        const price =
          form.watch(`transaction_items.${index}.subtotal`) * quantity;
        const hpp = form.watch(`transaction_items.${index}.hpp`) * quantity;
        const tip = form.watch(`transaction_items.${index}.tip`);
        const discount = form.watch(`transaction_items.${index}.discount`);
        const margin = price + tip - (hpp + discount);
        const subtotal = price + tip - discount;
        // const productId = form.watch(`transaction_items.${index}.product_id`);
        // const productName = products.find((pr) => pr.id === productId)?.name;

        return (
          <div key={item.id} className="space-y-4">
            <p>Produk #{index + 1}</p>

            {/* Produk, Produk Id, harga */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* <div>
                <Label htmlFor="product_name">Nama Produk</Label>
                <Input
                  disabled={isSubmitting}
                  id="product_name"
                  defaultValue={defaultForm ? productName : ""}
                  list="product-name-list"
                  onBlur={(e) => blurHandler(index, e)}
                />
              </div> */}

              <FormField
                control={form.control}
                name={`transaction_items.${index}.product_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Produk</FormLabel>
                    <FormControl>
                      <ProductName
                        selectHandler={(value) => selectHandler(value, index)}
                        setValue={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`transaction_items.${index}.product_id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produk Id</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Contoh : Otomatis jika nama produk valid"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`transaction_items.${index}.subtotal`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Contoh : Otomatis jika nama produk valid"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Kuantitas, diskon, tip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`transaction_items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kuantitas</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        type="number"
                        placeholder="Contoh : cash..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`transaction_items.${index}.discount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diskon</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        type="number"
                        placeholder="Contoh : cash..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`transaction_items.${index}.tip`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tip</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        type="number"
                        placeholder="Contoh : cash..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Margin dan HPP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`transaction_items.${index}.margin`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Contoh : cash..."
                        {...field}
                        value={margin}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`transaction_items.${index}.hpp`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HPP</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Contoh : Otomatis jika nama produk valid"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Margin %</Label>
                <Input
                  disabled
                  value={formatToPercent((margin / price) * 100)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm items-center">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  disabled={isSubmitting}
                  className="cursor-pointer"
                  onClick={() => remove(index)}
                >
                  <Trash />
                </Button>
              )}

              <p>
                <strong>Subtotal #{index + 1}:</strong>{" "}
                {formatToRupiah(subtotal)}
              </p>
              <p>
                <strong>HPP #{index + 1}:</strong> {formatToRupiah(hpp)}
              </p>
              <p>
                <strong>Margin #{index + 1}:</strong> {formatToRupiah(margin)}
              </p>
            </div>
          </div>
        );
      })}
      <Separator />
      <div className="flex gap-4">
        <Button
          type="button"
          size={"icon"}
          disabled={isSubmitting}
          onClick={() => append(defaultForm.transaction_items)}
          className="bg-green-500 cursor-pointer hover:bg-green-600 active:scale-95"
        >
          <Plus />
        </Button>
      </div>

      <div className="flex flex-wrap gap-6 text-sm items-center justify-end border-t pt-4 mt-6">
        <p>
          <strong>Total Subtotal:</strong> {formatToRupiah(total.subtotal)}
        </p>
        <p>
          <strong>Total HPP:</strong> {formatToRupiah(total.hpp)}
        </p>
        <p>
          <strong>Total Margin:</strong> {formatToRupiah(total.margin)}
        </p>
      </div>
    </div>
  );
};

const ProductNameList = () => {
  const { products } = useAddTransactionData();

  return (
    <datalist id="product-name-list">
      {products.map((prod) => (
        <option key={prod.id} value={prod.name}></option>
      ))}
    </datalist>
  );
};

const ProductName: React.FC<{
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  selectHandler: (value: string) => Promise<void>;
}> = ({ value, setValue, selectHandler }) => {
  const { products } = useAddTransactionData();
  const comboboxItems = products
    .map(productMapper.mapProductsToInventoryItems)
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
  const [open, setOpen] = useState<boolean>(false);

  return (
    <InventoryCombobox
      items={comboboxItems}
      label="Produk"
      open={open}
      setOpen={setOpen}
      setValue={setValue}
      value={value}
      selectHandler={(value) => selectHandler(value)}
    />
  );
};

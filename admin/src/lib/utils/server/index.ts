import axios, { isAxiosError } from "axios";
import { UseFormReturn, Path, FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import React, { SetStateAction } from "react";

type DataSource = "transaction" | "purchase";

interface GetDataCodeOptions<T extends FieldValues> {
  setIsGettingCode: React.Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<T>;
  dateField: Path<T>;
  codeField: Path<T>;
  dataSrc: DataSource;
}

export const getDataCode = async <T extends FieldValues>(
  options: GetDataCodeOptions<T>
) => {
  const { form, setIsGettingCode, dateField, codeField, dataSrc } = options;
  try {
    const { getValues, setValue } = form;
    const date = getValues(dateField);

    if (typeof date !== "string") {
      throw new Error("Tanggal harus berupa string");
    }

    const apiRoute: Record<DataSource, string> = {
      purchase: "/api/purchases/get-code",
      transaction: "/api/transaction/get-code",
    };

    setIsGettingCode(true);
    const { data } = await axios.get(apiRoute[dataSrc], {
      params: {
        start: date.slice(0, 10).split("-").join(""),
        end: date.slice(0, 10).split("-").join(""),
      },
    });

    toast(data.message, { type: "success" });

    const newCode = data.newCode;
    setValue(codeField, newCode);
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data;
      toast(data?.message ?? "Terjadi kesalahan", { type: "error" });
    }
    console.error(error);
  } finally {
    setIsGettingCode(false);
  }
};
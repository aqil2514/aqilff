"From Client API to Server";
import { SimpleTransaction } from "@/@types/transaction";
import { TransactionSchemaType } from "@/schema/transaction-schema";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export async function createNewTransaction(formData: TransactionSchemaType) {
  try {
    const { data } = await axios.post(`/api/transaction`, formData);

    toast.success(data.message ?? "Berhasil");
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;
      toast.error(data.message ?? "Terjadi kesalahan");
    }
  }
}

export async function getTransactionHandler(
  startDate: string,
  endDate: string
) {
  try {
    const { data } = await axios.get(
      `/api/transaction/get-transaction?startDate=${startDate}&endDate=${endDate}`
    );

    const transactions: SimpleTransaction[] = data.data;

    toast.success(data.message ?? "Data berhasil diambil");
    return {
      success: true,
      data: transactions ?? [],
    };
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;

      toast.error(data.message ?? "Terjadi kesalahan");
    }
    return {
      success: false,
      data: [],
    };
  }
}

export async function getTransactionByIdHandler(transactionId: string) {
  try {
    const { data } = await axios.get(
      `/api/transaction/get-transaction/${transactionId}`
    );
    return data;
  } catch (error) {
    console.error(error);
    toast.error("Terjadi kesalahan");
    throw error;
  }
}

export async function getHPPItem(productId: string) {
  try {
    const { data } = await axios.get(
      `/api/transaction/get-hpp?product-id=${productId}`
    );
    const hpp = data.hpp;

    return Number(hpp);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTransactionById(transactionId: string) {
  try {
    await axios.delete(`/api/transaction`, {
      params: {
        transactionId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

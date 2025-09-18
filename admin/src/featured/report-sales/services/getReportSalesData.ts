import { ResponseWithData } from "@/@types/http";
import { TransactionStatisic } from "@/@types/rpc";
import { SimpleTransaction } from "@/@types/transaction";
import { serverEndpoint } from "@/config/endpoint";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

type ReportSalesApiReturn = {
  data: SimpleTransaction[];
  statistic: TransactionStatisic;
};

export async function getReportSalesData(startDate: string, endDate: string) {
  try {
    const { data } = await axios.get<ResponseWithData<ReportSalesApiReturn>>(
      `${serverEndpoint}/sales/report`,
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;

      toast.error(data.message ?? "Terjadi kesalahan");
    }
    throw error;
  }
}

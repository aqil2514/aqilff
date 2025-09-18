import { ResponseWithData } from "@/@types/http";
import { TransactionStatisic } from "@/@types/rpc";
import { SimpleTransaction } from "@/@types/transaction";
import { serverEndpoint } from "@/config/endpoint";
import axios from "axios";
import { dailySalesBuilder } from "./queryBuilder";

interface DailySalesReportReturn {
  data: SimpleTransaction[];
  statistic: TransactionStatisic;
}

export async function getDailySalesReport() {
  try {
    const { data } = await axios.post<ResponseWithData<DailySalesReportReturn>>(
      `${serverEndpoint}/sales/report`,
      { query: dailySalesBuilder() }
    );
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

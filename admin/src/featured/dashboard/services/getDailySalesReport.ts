import { ResponseWithData } from "@/@types/http";
import { TransactionStatisic } from "@/@types/rpc";
import { SimpleTransaction } from "@/@types/transaction";
import { serverEndpoint } from "@/config/endpoint";
import axios from "axios";

interface DailySalesReportReturn {
  data: SimpleTransaction[];
  statistic: TransactionStatisic;
}

export async function getDailySalesReport() {
  try {
    const { data } = await axios.get<ResponseWithData<DailySalesReportReturn>>(
      `${serverEndpoint}/sales/daily`
    );
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

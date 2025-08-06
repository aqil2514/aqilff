import { getDefaultDateRange } from "@/lib/utils";
import { getReportSalesData } from "../report-sales/getReportSalesData";
import { TransactionStatisic } from "@/@types/rpc";

interface GetDashboardRssReturn {
  statistic: TransactionStatisic;
}

export async function getDashboardRss() {
  const { defaultEndDate } = getDefaultDateRange();
  const [reportSales] = await Promise.allSettled([
    getReportSalesData(defaultEndDate, defaultEndDate),
  ]);

  const data: GetDashboardRssReturn = {} as GetDashboardRssReturn;

  if (reportSales.status === "fulfilled") {
    data.statistic = reportSales.value.statistic;
  }

  return data;
}

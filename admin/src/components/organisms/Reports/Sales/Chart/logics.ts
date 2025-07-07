import { ChartPieData } from "@/@types/general";
import { Transaction, TransactionItem } from "@/@types/transaction";
import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { useEffect, useMemo, useState } from "react";
import { getCategoryMargins, getCategoryTotals } from "./utils";

export function useTabsContentOmzetChartLogics() {
  const { transaction, products } = useReportSalesData();

  const items = useMemo(() => {
    return transaction.flatMap((tr: Transaction) => tr.items);
  }, [transaction]);

  const data: ChartPieData[] = useMemo(() => {
    return getCategoryTotals(items as TransactionItem[], products);
  }, [items, products]);

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );
  return { total, data };
}

export function useTabsMarginOmzetChartLogics() {
  const { transaction, products } = useReportSalesData();

  const items = useMemo(() => {
    return transaction.flatMap((tr: Transaction) => tr.items);
  }, [transaction]);

  const data: ChartPieData[] = useMemo(() => {
    return getCategoryMargins(items as TransactionItem[], products);
  }, [items, products]);

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );
  return { data, total };
}

export function useTabsContentOmzetPerDayLogics() {
  const [isNoData, setIsNoData] = useState<boolean>(false);
  const [isLessData, setIsLessData] = useState<boolean>(false);
  const { transaction } = useReportSalesData();

  const data = useMemo(() => {
    const grouped = new Map<string, number>();

    for (const tr of transaction) {
      const date = new Date(tr.transaction_at);
      const day = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);

      grouped.set(day, (grouped.get(day) || 0) + tr.total_amount);
    }

    return Array.from(grouped, ([name, total]) => ({ name, total }));
  }, [transaction]);

  useEffect(() => {
    if (!transaction || transaction.length === 0) {
      setIsNoData(true);
      setIsLessData(false);
    } else if (data.length < 2) {
      setIsNoData(false);
      setIsLessData(true);
    } else {
      setIsNoData(false);
      setIsLessData(false);
    }
  }, [data, transaction]);

  // Hitung info tambahan
  const totalOmzet = data.reduce((acc, curr) => acc + curr.total, 0);
  const avgOmzet = totalOmzet / data.length;
  const bestDay =
    data.length > 0
      ? data.reduce((prev, curr) => (curr.total > prev.total ? curr : prev))
      : undefined;

  return { avgOmzet, bestDay, data, isNoData, isLessData, totalOmzet };
}

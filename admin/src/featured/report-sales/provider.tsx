"use client";

import { TransactionStatisic } from "@/@types/rpc";
import { TableReportSales } from "@/@types/transaction";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ReportSalesContextState {
  data: TableReportSales[];
  setData: Dispatch<SetStateAction<TableReportSales[]>>;
  statistic: TransactionStatisic;
  setStatistic: Dispatch<SetStateAction<TransactionStatisic>>;
  columnsFilter: ColumnFiltersState;
  setColumnsFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
}

const ReportSalesContext = createContext<ReportSalesContextState>(
  {} as ReportSalesContextState
);

interface ReportSalesProviderProps {
  children: React.ReactNode;
}

export default function ReportSalesProvider({
  children,
}: ReportSalesProviderProps) {
  const [data, setData] = useState<TableReportSales[]>([]);
  const [statistic, setStatistic] = useState<TransactionStatisic>({
    total_discount: 0,
    total_hpp: 0,
    total_margin: 0,
    total_subtotal: 0,
    total_tip: 0,
    total_transactions: 0,
    total_unique_products_sold: 0,
  });
  const [columnsFilter, setColumnsFilter] = useState<ColumnFiltersState>([]);

  const value: ReportSalesContextState = {
    data,
    setData,
    columnsFilter,
    setColumnsFilter,
    setStatistic,
    statistic,
  };

  return (
    <ReportSalesContext.Provider value={value}>
      {children}
    </ReportSalesContext.Provider>
  );
}

export const useReportSalesData = () => useContext(ReportSalesContext);

"use client";

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
  const [columnsFilter, setColumnsFilter] = useState<ColumnFiltersState>([]);

  const value: ReportSalesContextState = {
    data,
    setData,
    columnsFilter,
    setColumnsFilter,
  };

  return (
    <ReportSalesContext.Provider value={value}>
      {children}
    </ReportSalesContext.Provider>
  );
}

export const useReportSalesData = () => useContext(ReportSalesContext);

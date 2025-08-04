import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { columns, simpleColumns } from "../Columns";

export function useFilterDateLogics() {
  const {
    endDate,
    setEndDate,
    startDate,
    setStartDate,
    isLoadingFetch,
    setIsLoadingFetch,
    setTransaction,
    setProducts,
    setColumnFilters,
  } = useReportSalesData();

  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "startDate") setStartDate(value);
    if (id === "endDate") setEndDate(value);
  };

  const handlerRetrieve = async () => {
    if (!startDate || !endDate) {
      setError("Tanggal tidak boleh kosong.");
      return;
    }

    if (startDate > endDate) {
      setError("Tanggal mulai tidak boleh lebih besar dari tanggal akhir.");
      return;
    }

    setError(null);
    setIsLoadingFetch(true);
    setColumnFilters([]);

    try {
      const { data } = await axios.get("/api/reports/sales", {
        params: {
          startDate,
          endDate,
        },
      });

      setTransaction(data.transactions);
      setProducts(data.products);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoadingFetch(false);
    }
  };

  return {
    isLoadingFetch,
    startDate,
    handleDateChange,
    endDate,
    error,
    handlerRetrieve,
  };
}

export function useFilterTextLogics() {
  const { columnFilters, setColumnFilters, viewMode } = useReportSalesData();
  const [selectedId, setSelectedId] = useState<string>("");
  const inputValueRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!selectedId) return;

    const existingFilterIndex = columnFilters.findIndex(
      (f) => f.id === selectedId
    );
    const updatedFilters = [...columnFilters];

    if (existingFilterIndex !== -1) {
      updatedFilters[existingFilterIndex] = { id: selectedId, value: newValue };
    } else {
      updatedFilters.push({ id: selectedId, value: newValue });
    }

    setColumnFilters(updatedFilters);
  };

  const columnsToDisplay = viewMode === "summary" ? simpleColumns : columns;

  const columnFilterList = useMemo(() => {
    const result = columnsToDisplay.map((col) => {
      return {
        id: `accessorKey` in col ? col.accessorKey : "unknown",
        header: col.header,
      };
    });

    return result;
  }, [columnsToDisplay]);

  useEffect(() => {
    if (!inputValueRef) return;

    setColumnFilters([]);
    setSelectedId("");
    inputValueRef.current!.value = "";
  }, [viewMode, setColumnFilters]);

  return {
    selectedId,
    setSelectedId,
    columnFilterList,
    inputValueRef,
    handleInputChange,
  };
}

export function useSortingControl() {
  const { setSorting, viewMode } = useReportSalesData();
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSortChange = () => {
    if (!sortColumn) return;

    setSorting([
      {
        id: sortColumn,
        desc: sortDirection === "desc",
      },
    ]);
  };

  const columnsToDisplay = viewMode === "summary" ? simpleColumns : columns;

  const columnFilterList = useMemo(() => {
    const result = columnsToDisplay.map((col) => {
      return {
        id: `accessorKey` in col ? col.accessorKey : "unknown",
        header: col.header,
      };
    });

    return result;
  }, [columnsToDisplay]);

  useEffect(() => {
    setSorting([]);
    setSortColumn("");
    setSortDirection("asc");
  }, [viewMode, setSorting]);

  return {sortColumn, setSortColumn, columnFilterList, sortDirection, setSortDirection, handleSortChange};
}

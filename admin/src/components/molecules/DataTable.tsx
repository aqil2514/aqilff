"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
  getFilteredRowModel,
  InitialTableState,
  ColumnSort,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { JSX, SetStateAction } from "react";

interface ColumnFilter {
  id: string;
  value: unknown;
}

export type ColumnFiltersState = ColumnFilter[];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: React.Dispatch<SetStateAction<ColumnFiltersState>>;
  initialState?: InitialTableState;
  sorting?: ColumnSort[];
  setSorting?: React.Dispatch<SetStateAction<ColumnSort[]>>;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<SetStateAction<RowSelectionState>>;
  SelectionRowMenu?: (
    table: ReturnType<typeof useReactTable<TData>>
  ) => JSX.Element | null;
  enableMultiRowSelection?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialState,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
  enableRowSelection,
  rowSelection,
  SelectionRowMenu,
  setRowSelection,
  enableMultiRowSelection
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    initialState,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection,
  });

  return (
    <div className="space-y-2">
      {enableRowSelection && SelectionRowMenu && SelectionRowMenu(table)}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[#df1111] text-white"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 bg-[#df1111] text-white z-10 text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isSelectionMode = enableRowSelection ?? false;
                const isSelected = isSelectionMode && row.getIsSelected();

                const selectionHandler = () => {
                  if (!isSelectionMode) return;

                  row.toggleSelected();
                };

                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={`nth-[even]:bg-[#f9f9f9] nth-[odd]:bg-[#fff] text-center cursor-default`}
                    onClick={selectionHandler}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import React from "react";
import { ColumnSort } from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TableSortControlProps {
  sorting: ColumnSort[];
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort[]>>;
}

const sortOptions = [
  { label: "Jumlah Terjual", value: "quantity" },
  { label: "Subtotal Penjualan", value: "subtotal" },
];

export default function TableSortControl({
  sorting,
  setSorting,
}: TableSortControlProps) {
  const currentSort = sorting[0]?.id ?? "";

  const handleChange = (value: string) => {
    if (value === "nothing") {
      setSorting([]);
    } else {
      setSorting([{ id: value, desc: true }]);
    }
  };

  const handleReset = () => {
    setSorting([]);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
      <div className="flex-1">
        <Label htmlFor="sort" className="text-sm text-gray-700">
          Urutkan berdasarkan
        </Label>
        <Select onValueChange={handleChange} value={currentSort || ""}>
          <SelectTrigger id="sort" className="w-full">
            <SelectValue placeholder="Pilih kriteria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nothing">— Tidak Diurutkan —</SelectItem>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sorting.length > 0 && (
        <Button
          variant="outline"
          onClick={handleReset}
          className="sm:mb-[2px]"
        >
          Reset Sorting
        </Button>
      )}
    </div>
  );
}

"use client";

import { DataListOption } from "@/@types/general";
import { LabeledInput } from "@/components/atoms/inputs/LabeledInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface FilterHandlerCardProps {
  options: DataListOption[];
  setColumnsFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
}

export default function FilterHandlerCard({
  options,
  setColumnsFilter,
}: FilterHandlerCardProps) {
  const [value, setValue] = useState<string>("");
  const [columns, setColumns] = useState<string>("customer_name");

  useEffect(() => {
    setColumnsFilter([{ id: columns, value }]);
  }, [value, columns, setColumnsFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Berdasarkan</CardTitle>
        <CardDescription>Pilih kolom filter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SelectColumns options={options} setColumns={setColumns} />
        <InputValue setValue={setValue} value={value} />
      </CardContent>
    </Card>
  );
}

const SelectColumns = ({
  options,
  setColumns,
}: {
  options: DataListOption[];
  setColumns: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Select onValueChange={(e) => setColumns(e)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Kolom" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.key} value={String(opt.key)}>
            {opt.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const InputValue = ({
  setValue,
  value,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <LabeledInput
      label="Nilai"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

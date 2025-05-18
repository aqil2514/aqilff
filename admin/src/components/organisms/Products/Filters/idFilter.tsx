import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductsData } from "@/components/providers/ProductsProvider";

export function IdSelect() {
  const { columnFilters, setColumnFilters, products } = useProductsData();

  const idData: string[] = React.useMemo(() => {
    const idSet = new Set<string>();

    for (const prod of products) {
      idSet.add(prod.id.slice(0, 4));
    }

    return Array.from(idSet).sort();
  }, [products]);

  const valueChangeHandler = (e: string) => {
    const newFilters = columnFilters.filter((f) => f.id !== "id");

    if (e === "none") {
      setColumnFilters(newFilters);
      return;
    }

    setColumnFilters([
      ...newFilters,
      {
        id: "id",
        value: e,
      },
    ]);
  };

  return (
    <Select onValueChange={valueChangeHandler}>
      <SelectTrigger className="w-[180px] px-0 py-0 bg-transparent border-none shadow-none focus:ring-0 focus:outline-none !text-white flex justify-center items-center cursor-pointer">
        <SelectValue placeholder="ID" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter ID</SelectLabel>
          <SelectItem value="none">ID</SelectItem>
          {idData.map((id) => (
            <SelectItem value={id} key={id}>
              {id}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

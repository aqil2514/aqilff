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
import { Product } from "@/@types/products";

interface GenericSelectFilterProps {
  field: string; 
  label: string; 
  extractor: (product: Product) => string;
}

export function GenericSelectFilter({
  field,
  label,
  extractor,
}: GenericSelectFilterProps) {
  const { columnFilters, setColumnFilters, products } = useProductsData();

  const options: string[] = React.useMemo(() => {
    const set = new Set<string>();
    for (const prod of products) {
      const val = extractor(prod);
      if (val) set.add(val);
    }
    return Array.from(set).sort();
  }, [products, extractor]);

  const valueChangeHandler = (e: string) => {
    const newFilters = columnFilters.filter((f) => f.id !== field);

    if (e === "none") {
      setColumnFilters(newFilters);
      return;
    }

    setColumnFilters([
      ...newFilters,
      {
        id: field,
        value: e,
      },
    ]);
  };

  return (
    <Select onValueChange={valueChangeHandler}>
      <SelectTrigger className="w-[180px] px-0 py-0 bg-transparent border-none shadow-none focus:ring-0 focus:outline-none !text-white flex justify-center items-center cursor-pointer">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{`Filter ${label}`}</SelectLabel>
          <SelectItem value="none">{label}</SelectItem>
          {options.map((opt) => (
            <SelectItem value={opt} key={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InventoryItem } from "@/@types/ui";

interface Props {
  items: InventoryItem[];
  label?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  selectHandler?: (value: string) => Promise<void>

}

export default function InventoryCombobox({
  items,
  label = "item",
  open,
  setOpen,
  setValue,
  selectHandler,
  value,
}: Props) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : `Pilih ${label}`}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Cari ${label}...`} />
          <CommandList>
            <CommandEmpty>Tidak ada {label} yang ditemukan.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={ async(currentValue) => {
                    const selectedItem = items.find(
                      (item) => item.label === currentValue
                    );
                    if (!selectedItem) return;

                    const id = selectedItem.value;
                    setValue(id === value ? "" : id);
                    setOpen(false);

                    if(selectHandler){
                      console.log(selectedItem.label)
                      await selectHandler(selectedItem.label)
                    }
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.stock} pcs
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilterDate from "./FilterDate";
import FilterText from "./FilterText";
import SortingControl from "./SortingControl";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FilterControl() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-white text-black hover:bg-amber-50 cursor-pointer data-[state=open]:bg-amber-50">
          <Database />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 mb-4 p-4 bg-white flex flex-col md:flex-row gap-2 w-full">
        <FilterDate />
        <FilterText />
        <SortingControl />
      </PopoverContent>
    </Popover>
  );
}

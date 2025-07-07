import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSortingControl } from "./logics";

export default function SortingControl() {
  const {
    columnFilterList,
    handleSortChange,
    setSortColumn,
    setSortDirection,
    sortColumn,
    sortDirection,
  } = useSortingControl();

  return (
    <div className="space-y-2">
      <Label>Urutkan Berdasarkan</Label>
      <div className="flex flex-col md:flex-row items-start md:items-center flex-wrap gap-2">
        <Select value={sortColumn} onValueChange={setSortColumn}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Kolom" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Kolom</SelectLabel>
              {columnFilterList.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.header as string}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(val) => setSortDirection(val as "asc" | "desc")}
        >
          <SelectTrigger className="w-[120px]" disabled={!sortColumn}>
            <SelectValue placeholder="Arah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleSortChange}>
          Terapkan
        </Button>
      </div>
    </div>
  );
}

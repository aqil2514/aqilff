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
import { Input } from "@/components/ui/input";
import { useFilterTextLogics } from "./logics";

export default function FilterText() {
  const {
    columnFilterList,
    handleInputChange,
    inputValueRef,
    selectedId,
    setSelectedId,
  } = useFilterTextLogics();

  return (
    <div className="space-y-2">
      <Label htmlFor="search-value">
        <span className="text-xs mb-1 block">Cari Data Berdasarkan</span>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Kolom" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter Kolom</SelectLabel>
              {columnFilterList.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.header as string}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>

      <div className="space-y-2">
        <Label htmlFor="search-value">Kata Kunci</Label>
        <Input
          type="text"
          ref={inputValueRef}
          id="search-value"
          placeholder="Masukkan kata kunci"
          onChange={handleInputChange}
          disabled={!selectedId}
        />
      </div>
    </div>
  );
}

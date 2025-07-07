import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFilterDateLogics } from "./logics";

export default function FilterDate() {
  const {
    endDate,
    error,
    handleDateChange,
    handlerRetrieve,
    isLoadingFetch,
    startDate,
  } = useFilterDateLogics();

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Tanggal Mulai</Label>
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Tanggal Selesai</Label>
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <Button
        className="cursor-pointer active:scale-95"
        onClick={handlerRetrieve}
        disabled={isLoadingFetch}
      >
        {isLoadingFetch ? "Mengambil Data..." : "Ambil Data"}
      </Button>
    </div>
  );
}

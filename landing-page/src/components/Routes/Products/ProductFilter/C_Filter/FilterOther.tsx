import { poppins, tuffy } from "@/app/fonts";
import { useFilterProductsLogic } from "../logic/useFilterProductsLogic";

export default function OtherFilter() {
  const { otherChangeHandler, filter } = useFilterProductsLogic();
  return (
    <div>
      <p className={`${tuffy.className} !font-semibold text-base`}>Lain-lain</p>
      <div className="flex gap-4 justify-center flex-wrap mb-4 md:mb-0">
        <span className="flex gap-1">
          <input
            type="checkbox"
            id="inStockOnly"
            name="category-filter"
            checked={filter.inStockOnly}
            onChange={() => otherChangeHandler.inStockOnly()}
          />
          <label
            htmlFor="inStockOnly"
            className={`${poppins.className} text-sm`}
          >
            Stok Tersedia Saja
          </label>
        </span>
      </div>
    </div>
  );
}

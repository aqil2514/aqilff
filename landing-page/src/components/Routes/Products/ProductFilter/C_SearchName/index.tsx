import { useSearchNameLogic } from "../logic/useSearchNameLogic";

export default function SearchName() {
  const { searchHandler, filter } = useSearchNameLogic();

  return (
    <input
      type="text"
      className="border-b border-white outline-0 text-white w-full"
      onChange={searchHandler}
      placeholder="Cari Produk..."
      value={filter.productName}
    />
  );
}

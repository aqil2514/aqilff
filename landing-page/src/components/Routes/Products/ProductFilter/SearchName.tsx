import { useProductsData } from "@/components/Providers/ProductsProvider";

export default function SearchName(){
    const { setFilter, filter, products, setFilteredProducts } =
    useProductsData();

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const name = target.value;
    
        setFilter({ ...filter, productName: name });
    
        const newProducts = products.filter((prod) =>
            prod.name.toLowerCase().includes(name.toLowerCase())
          );
          setFilteredProducts(newProducts);
      };
    return(
        <input
        type="text"
        className="border-b border-white outline-0 text-white w-full"
        onChange={searchHandler}
        placeholder="Cari Produk..."
        value={filter.productName}
      />
    )
}
export const fetchProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Gagal memuat data produk");
  return res.json();
};

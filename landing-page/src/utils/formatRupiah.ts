export function formatRupiah(number: number) {
  const result = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
    minimumFractionDigits: 0,
  }).format(number);

  return result;
}

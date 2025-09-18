import { SimpleTransaction, TableReportSales } from "@/@types/transaction";

export function tableReportSalesMapper(transactions: SimpleTransaction[]) {
  const reports: TableReportSales[] = transactions.flatMap((trx) => {
    const items = allItems.filter((item) => item.transaction_id === trx.id);

    return items.map((item): TableReportSales => {
      return {
        margin: item.margin ?? 0,
        product_id: item.product_id,
        quantity: item.quantity ?? 0,
        subtotal: item.subtotal ?? 0,
        deleted_at: item.deleted_at ?? undefined,
        discount: item.discount ?? 0,
        hpp: item.hpp ?? 0,
        id: item.id?.toString(),
        product_code: item.product_id?.code ?? "",
        tip: item.tip ?? 0,
        transaction_id: item.transaction_id,

        category: item.product_id?.category ?? "-",
        transaction_at: trx.transaction_at ?? "",
        transaction_code: trx.transaction_code,
        customer_name: trx.customer_name ?? "-",
      };
    });
  });
  return reports;
}

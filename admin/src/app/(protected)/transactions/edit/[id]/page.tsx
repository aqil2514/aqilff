import EditTransactionTemplate from "@/components/templates/Navigations/TransactionEditTemplate";
import { getProductData } from "@/lib/supabase/products";
import { getTransactionDataById } from "@/lib/supabase/transaction";
import { getTransactionItemDataByTransactionId } from "@/lib/supabase/transactionItem";
import { TransactionSchemaType } from "@/schema/transaction-schema";

export default async function TransactionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [products, transaction, transactionItem] = await Promise.all([
    getProductData(),
    getTransactionDataById(id),
    getTransactionItemDataByTransactionId(id),
  ]);

  console.log(transactionItem)

  const items: TransactionSchemaType["transaction_items"] = transactionItem.map(
    (tr) => ({
      discount: Number(tr.discount),
      hpp: Number(tr.hpp),
      margin: Number(tr.margin),
      product_id: String(tr.product_id.id),
      quantity: Number(tr.quantity),
      subtotal: Number(tr.subtotal),
      tip: Number(tr.tip),
    })
  );

  const data: TransactionSchemaType = {
    ...transaction,
    customer_name: String(transaction.customer_name),
    transaction_at: new Date(transaction.transaction_at),
    transaction_items: items,
  };

  return <EditTransactionTemplate products={products} defaultValues={data} />;
}

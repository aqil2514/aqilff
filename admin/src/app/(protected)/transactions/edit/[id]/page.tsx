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

  const items: TransactionSchemaType["transaction_items"] = transactionItem
    .map((tr) => {
      if (typeof tr.product_id === "string") return;
      const produtName = products.find((pro) => pro.id === tr.product_id);

      return {
        discount: Number(tr.discount),
        hpp: Number(tr.hpp) / tr.quantity,
        margin: Number(tr.margin),
        product_name: String(produtName),
        product_id: String(tr.product_id.id),
        quantity: Number(tr.quantity),
        subtotal: Number(tr.product_id.price),
        tip: Number(tr.tip),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  const data: TransactionSchemaType = {
    ...transaction,
    customer_name: String(transaction.customer_name),
    transaction_at: new Date(transaction.transaction_at),
    transaction_items: items,
  };

  return <EditTransactionTemplate products={products} defaultValues={data} />;
}

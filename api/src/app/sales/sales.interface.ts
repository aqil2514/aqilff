export interface SimpleTransaction {
  transaction_code: string;
  customer_name: string;
  id: string;
  transaction_at: string;
  payment_method: string;
  total_amount: number;
}

export interface TransactionStatisic {
  total_subtotal: number;
  total_margin: number;
  total_hpp: number;
  total_discount: number;
  total_tip: number;
  total_transactions:number;
  total_unique_products_sold:number;
}

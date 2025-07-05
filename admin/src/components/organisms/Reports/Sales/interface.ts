import { TransactionItem } from "@/@types/transaction";

export type TableReportSales = TransactionItem & {
  category: string;
  transaction_at: string;
  transaction_code: string;
  customer_name: string;
};
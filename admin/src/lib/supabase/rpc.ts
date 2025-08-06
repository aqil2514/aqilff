import { TransactionStatisic } from "@/@types/rpc";
import { supabaseAdmin } from "../supabaseServer";

export async function getTransactionStatisic(
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabaseAdmin
    .rpc("get_aggregate_sales_report", {
      start_date: startDate,
      end_date: endDate,
    })
    .single();

  if (error || !data) {
    console.error(error);
    throw error;
  }

  return data as TransactionStatisic;
}

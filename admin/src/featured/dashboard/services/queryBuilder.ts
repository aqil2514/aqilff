import { QueryOptions } from "@/@types/supabase";
import { formatDateToTimeZone } from "@/utils/date";

export function dailySalesBuilder(): QueryOptions {
  // hitung rentang [>= start, < nextDay) agar aman
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const nextDay = new Date(start);
  nextDay.setDate(start.getDate() + 1);

  return {
    filters: [
      {
        key: "transaction_at",
        operator: "gte",
        value: formatDateToTimeZone(start),
      },
      {
        key: "transaction_at",
        operator: "lt",
        value: formatDateToTimeZone(nextDay),
      },
      { key: "deleted_at", operator: "is", value: null },
    ],
    select:
      "transaction_code, customer_name, id, transaction_at, payment_method, total_amount",
    sort: [{ key: "transaction_at", direction: "desc" }],
  };
}

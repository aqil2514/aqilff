import { QueryOptions } from 'src/services/supabase/supabase.interface';

// hitung rentang [>= start, < nextDay) agar aman
const now = new Date();
const start = new Date(now);
start.setHours(0, 0, 0, 0);

const nextDay = new Date(start);
nextDay.setDate(start.getDate() + 1); // 00:00 hari berikutnya

export const dailySalesReportQuery: QueryOptions = {
  filters: [
    { key: 'transaction_at', operator: 'gte', value: start.toISOString() },
    { key: 'transaction_at', operator: 'lt', value: nextDay.toISOString() },
    { key: 'deleted_at', operator: 'is', value: null },
  ],
  select:
    'transaction_code, customer_name, id, transaction_at, payment_method, total_amount',
  sort: [{ key: 'transaction_at', direction: 'desc' }],
};

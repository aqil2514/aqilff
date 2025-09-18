import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { dailySalesReportQuery } from './sales.query';
import { SimpleTransaction, TransactionStatisic } from './sales.interface';

@Injectable()
export class SalesService {
  private readonly db: SupabaseClient;

  constructor(private readonly supabase: SupabaseService) {
    this.db = this.supabase.getAdmin();
  }

  async getDailySalesReport() {
    const q = this.supabase.buildQuery(
      this.db,
      'transactions',
      dailySalesReportQuery,
    );

    const { data, error } = await q;

    if (error) {
      // bisa mapping pakai handleSupabaseError
      throw new Error(this.supabase.handleSupabaseError(error));
    }

    return data as unknown as SimpleTransaction[];
  }

  async getDailyStatisticReport() {
    const { data, error } = await this.db
      .rpc('get_daily_sales_aggregate')
      .single();

    if (error || !data) {
      console.error(error);
      throw error;
    }

    return data as TransactionStatisic;
  }
}

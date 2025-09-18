import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QueryOptions } from './supabase.interface';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
    );

    this.supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ADMIN_SECRET,
    );
  }

  buildQuery(client: SupabaseClient, table: string, options: QueryOptions) {
    let q = client
      .from(table)
      .select(options.select || '*', { count: 'exact' });

    // Filters
    if (options.filters) {
      for (const f of options.filters) {
        q = (q as any)[f.operator](f.key, f.value);
      }
    }

    // Sort
    if (options.sort) {
      for (const s of options.sort) {
        q = q.order(s.key, { ascending: s.direction !== 'desc' });
      }
    }

    // Pagination
    if (options.page !== undefined && options.limit !== undefined) {
      const from = (options.page - 1) * options.limit;
      const to = options.page * options.limit - 1;
      q = q.range(from, to);
    } else if (options.limit !== undefined) {
      q = q.limit(options.limit);
    }

    return q;
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAdmin(): SupabaseClient {
    return this.supabaseAdmin;
  }

  handleSupabaseError(error: any) {
    const messages: Record<string, string> = {
      // Unique violation
      '23505': 'Data sudah ada.',

      // Foreign key violation
      '23503': 'Data sedang digunakan oleh entitas lain.',

      // Not null violation
      '23502': 'Field wajib diisi.',

      // Check constraint violation
      '23514': 'Data tidak memenuhi ketentuan.',

      // Invalid text representation (misal parsing angka gagal)
      '22P02': 'Format data tidak valid.',

      // String data right truncation (panjang string melebihi batas kolom)
      '22001': 'Teks terlalu panjang.',

      // Numeric value out of range
      '22003': 'Nilai angka di luar jangkauan yang diizinkan.',

      // Syntax error (biasanya query custom)
      '42601': 'Terjadi kesalahan pada query.',

      // Insufficient privilege
      '42501': 'Anda tidak memiliki izin untuk melakukan aksi ini.',
    };

    return messages[error.code] || 'Terjadi kesalahan.';
  }
}

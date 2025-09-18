import { SupabaseService } from './supabase.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

// Builder palsu untuk meniru chainable query Supabase
function makeQueryMock() {
  const self: any = {};
  self.from = jest.fn().mockReturnValue(self);
  self.select = jest.fn().mockReturnValue(self);
  self.order = jest.fn().mockReturnValue(self);
  self.range = jest.fn().mockReturnValue(self);
  self.limit = jest.fn().mockReturnValue(self);

  // Operator umum yang mungkin dipakai di filters
  self.eq = jest.fn().mockReturnValue(self);
  self.ilike = jest.fn().mockReturnValue(self);
  self.gte = jest.fn().mockReturnValue(self);
  self.lte = jest.fn().mockReturnValue(self);
  self.gt = jest.fn().mockReturnValue(self);
  self.lt = jest.fn().mockReturnValue(self);
  self.neq = jest.fn().mockReturnValue(self);
  self.in = jest.fn().mockReturnValue(self);

  return self;
}

describe('SupabaseService', () => {
  const OLD_ENV = process.env;
  let userClientMock: any;
  let adminClientMock: any;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...OLD_ENV };

    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_API_KEY = 'public-anon-key';
    process.env.SUPABASE_ADMIN_SECRET = 'service-role-secret';

    userClientMock = makeQueryMock();
    adminClientMock = makeQueryMock();

    (createClient as jest.Mock).mockImplementation((_url: string, key: string) => {
      // Kembalikan mock berbeda untuk kunci berbeda
      if (key === process.env.SUPABASE_ADMIN_SECRET) return adminClientMock;
      return userClientMock;
    });
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('menginisialisasi 2 client (user dan admin) dengan env yang benar', () => {
    const svc = new SupabaseService();

    expect(createClient).toHaveBeenCalledTimes(2);
    expect(createClient).toHaveBeenNthCalledWith(
      1,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY
    );
    expect(createClient).toHaveBeenNthCalledWith(
      2,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ADMIN_SECRET
    );

    expect(svc.getClient()).toBe(userClientMock);
    expect(svc.getAdmin()).toBe(adminClientMock);
  });

  it('buildQuery: menerapkan select default, filter, sort desc, dan pagination (page+limit)', () => {
    const svc = new SupabaseService();
    const q = svc.buildQuery(userClientMock as unknown as SupabaseClient, 'products', {
      select: 'id,name,created_at',
      filters: [
        { operator: 'eq', key: 'status', value: 'active' },
        { operator: 'ilike', key: 'name', value: '%chip%' },
      ],
      sort: [{ key: 'created_at', direction: 'desc' }],
      page: 2,
      limit: 10,
    });

    // Memastikan builder yang dikembalikan adalah mock yang sama (chainable)
    expect(q).toBe(userClientMock);

    // Urutan panggilan dasar
    expect(userClientMock.from).toHaveBeenCalledWith('products');
    expect(userClientMock.select).toHaveBeenCalledWith('id,name,created_at', { count: 'exact' });

    // Filter diterapkan
    expect(userClientMock.eq).toHaveBeenCalledWith('status', 'active');
    expect(userClientMock.ilike).toHaveBeenCalledWith('name', '%chip%');

    // Sort descending
    expect(userClientMock.order).toHaveBeenCalledWith('created_at', { ascending: false });

    // Pagination: page=2, limit=10 -> range(10, 19)
    expect(userClientMock.range).toHaveBeenCalledWith(10, 19);
  });

  it('buildQuery: sorting default ascending jika direction tidak diisi', () => {
    const svc = new SupabaseService();
    svc.buildQuery(userClientMock as unknown as SupabaseClient, 'users', {
      sort: [{ key: 'name' }],
    });

    expect(userClientMock.order).toHaveBeenCalledWith('name', { ascending: true });
  });

  it('buildQuery: jika hanya limit tanpa page maka pakai limit()', () => {
    const svc = new SupabaseService();
    svc.buildQuery(userClientMock as unknown as SupabaseClient, 'logs', {
      limit: 5,
    });

    expect(userClientMock.limit).toHaveBeenCalledWith(5);
    expect(userClientMock.range).not.toHaveBeenCalled();
  });

  it('buildQuery: tanpa select akan default "*" dan count exact', () => {
    const svc = new SupabaseService();
    svc.buildQuery(userClientMock as unknown as SupabaseClient, 'orders', {});

    expect(userClientMock.select).toHaveBeenCalledWith('*', { count: 'exact' });
  });

  it('handleSupabaseError: mengembalikan pesan yang sesuai untuk kode umum', () => {
    const svc = new SupabaseService();

    expect(svc.handleSupabaseError({ code: '23505' })).toBe('Data sudah ada.');
    expect(svc.handleSupabaseError({ code: '23503' })).toBe('Data sedang digunakan oleh entitas lain.');
    expect(svc.handleSupabaseError({ code: '22P02' })).toBe('Format data tidak valid.');
    expect(svc.handleSupabaseError({ code: '22001' })).toBe('Teks terlalu panjang.');
    expect(svc.handleSupabaseError({ code: '22003' })).toBe('Nilai angka di luar jangkauan yang diizinkan.');
    expect(svc.handleSupabaseError({ code: '42601' })).toBe('Terjadi kesalahan pada query.');
    expect(svc.handleSupabaseError({ code: '42501' })).toBe('Anda tidak memiliki izin untuk melakukan aksi ini.');
  });

  it('handleSupabaseError: fallback ke pesan umum jika kode tidak dikenal', () => {
    const svc = new SupabaseService();
    expect(svc.handleSupabaseError({ code: 'XXXX' })).toBe('Terjadi kesalahan.');
    expect(svc.handleSupabaseError({})).toBe('Terjadi kesalahan.');
  });
});

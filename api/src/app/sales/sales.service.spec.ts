// sales.service.spec.ts
import { SalesService } from './sales.service';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock untuk dailySalesReportQuery agar tidak tergantung implementasi aslinya
jest.mock('./sales.query', () => ({
  dailySalesReportQuery: {
    select:
      'transaction_code, customer_name, id, transaction_at, payment_method, total_amount',
    filters: [],
    sort: [{ key: 'transaction_at', direction: 'desc' }],
  },
}));

// Tipe helper agar nyaman memanggil jest.fn()
type MockedSupabase = {
  getAdmin: jest.Mock<SupabaseClient, []>;
  buildQuery: jest.Mock<
    Promise<{ data: any; error: any }>,
    [SupabaseClient, string, any]
  >;
  handleSupabaseError: jest.Mock<string, [any]>;
};

describe('SalesService', () => {
  let supabaseMock: MockedSupabase;
  let service: SalesService;
  let clientMock: Partial<SupabaseClient>;

  beforeEach(() => {
    clientMock = {}; // tidak perlu properti apa-apa karena kita mock buildQuery di SupabaseService

    supabaseMock = {
      getAdmin: jest.fn(() => clientMock as SupabaseClient),
      buildQuery: jest.fn(),
      handleSupabaseError: jest.fn(),
    };

    // Inisialisasi service dengan mock SupabaseService
    service = new SalesService(supabaseMock as unknown as SupabaseService);
  });

  it('mengambil client admin saat konstruktor dipanggil', () => {
    expect(supabaseMock.getAdmin).toHaveBeenCalledTimes(1);
  });

  it('berhasil mengembalikan data laporan harian saat query sukses', async () => {
    const fakeData = [
      {
        id: 'trx_1',
        transaction_code: 'TRX001',
        customer_name: 'Aqil',
        transaction_at: '2025-09-18T03:21:00.000Z',
        payment_method: 'cash',
        total_amount: 50000,
      },
    ];

    // buildQuery mengembalikan hasil siap-ditunggu (Promise<{data,error}>)
    supabaseMock.buildQuery.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    const result = await service.getDailySalesReport();

    // Pastikan dipanggil dengan parameter yang sesuai
    const { dailySalesReportQuery } = jest.requireMock('./sales.query');
    expect(supabaseMock.buildQuery).toHaveBeenCalledTimes(1);
    expect(supabaseMock.buildQuery).toHaveBeenCalledWith(
      clientMock,
      'transactions',
      dailySalesReportQuery
    );

    expect(result).toEqual(fakeData);
  });

  it('melempar error terformat saat Supabase mengembalikan error', async () => {
    const fakeError = { code: '23505', message: 'duplicate key' };
    supabaseMock.buildQuery.mockResolvedValue({
      data: null,
      error: fakeError,
    });
    supabaseMock.handleSupabaseError.mockReturnValue('Data sudah ada.');

    await expect(service.getDailySalesReport()).rejects.toThrow(
      'Data sudah ada.'
    );

    expect(supabaseMock.handleSupabaseError).toHaveBeenCalledWith(fakeError);
  });
});

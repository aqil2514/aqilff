import { Controller, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ResponseWithData } from 'src/@types/http';
import { SimpleTransaction, TransactionStatisic } from './sales.interface';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  //   Mengambil ringkasan data penjualan harian
  @Get('/daily')
  async getDailyReport() {
    const [data, statistic] = await Promise.all([
      this.salesService.getDailySalesReport(),
      this.salesService.getDailyStatisticReport(),
    ]);

    const response: ResponseWithData<{
      data: SimpleTransaction[];
      statistic: TransactionStatisic;
    }> = {
      data: {
        data,
        statistic,
      },
      message: 'Data berhasil diambil',
      ok: true,
    };

    return response;
  }
}

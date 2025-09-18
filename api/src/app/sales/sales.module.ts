import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { SupabaseModule } from '../../services/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}

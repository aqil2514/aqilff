import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SalesModule } from './app/sales/sales.module';
import { SupabaseModule } from './services/supabase/supabase.module';

@Module({
  imports: [ConfigModule.forRoot(), SalesModule, SupabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

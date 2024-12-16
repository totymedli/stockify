import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './features/stock/stock.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StockModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FinnhubModule } from 'src/services/finnhub/finnhub.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

export const FINNHUB_API_KEY = 'FINNHUB_API_KEY';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    FinnhubModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>(FINNHUB_API_KEY),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}

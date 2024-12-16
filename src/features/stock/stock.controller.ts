import {
  Controller,
  Get,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { InvalidSymbolException } from './stock.exceptions';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SymbolReponse } from './stock.types';
import { SymbolReponseType } from './stock.swagger';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get(':symbol')
  @ApiOperation({
    summary:
      'Retrieves and displays the stock price, last updated time and moving average for the given symbol.',
  })
  @ApiResponse({
    status: 200,
    description: 'description goes here',
    type: SymbolReponseType,
  })
  getSymbol(@Param('symbol') symbol: string): SymbolReponse {
    try {
      const stat = this.stockService.getStats(symbol);
      return {
        currentStockPrice: stat.currentStockPrice,
        lastUpdate: stat.lastUpdate,
        movingAverage: stat.movingAverage,
      };
    } catch (e) {
      if (e instanceof InvalidSymbolException) {
        throw new BadRequestException('Invalid symbol', {
          cause: e,
          description: `The provided symbol [${symbol}] can't be found. Make sure you started tracking and provided the correct symbol!`,
        });
      }
    }
  }

  @Put(':symbol')
  @ApiOperation({
    summary: 'Starts a periodic checks (every minute) for the given symbol.',
  })
  async putSymbol(@Param('symbol') symbol: string): Promise<void> {
    try {
      await this.stockService.startSymbolTracking(symbol);
    } catch (e) {
      if (e instanceof InvalidSymbolException) {
        throw new BadRequestException('Invalid symbol', {
          cause: e,
          description: `The provided symbol [${symbol}] can't be found, tracking of this symbol will not start.`,
        });
      }
    }
  }
}

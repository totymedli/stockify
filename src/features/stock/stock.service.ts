import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FinnhubService } from 'src/services/finnhub/finnhub.service';
import { InvalidSymbolException } from './stock.exceptions';
import { SymbolStatsCollection } from './stock.types';
import { InvalidArgumentException } from '../../exceptions';
import { Quote } from 'src/services/finnhub/stock.types';

const MOVING_AVERAGE_INTERVAL_IN_QUOTE_COUNT =
  'MOVING_AVERAGE_INTERVAL_IN_QUOTE_COUNT';

@Injectable()
export class StockService {
  constructor(
    private finnhubService: FinnhubService,
    private configService: ConfigService,
  ) {}

  private statsByTrackedSymbols: SymbolStatsCollection = {};

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchQuotes() {
    console.log('Stock Service State: ', this.statsByTrackedSymbols);
    const trackedSymbols = Object.keys(this.statsByTrackedSymbols);
    const quotesBySymbols =
      await this.finnhubService.fetchQuotes(trackedSymbols);
    const lastUpdate = new Date();
    const interval = parseInt(
      this.configService.get<string>(MOVING_AVERAGE_INTERVAL_IN_QUOTE_COUNT),
      10,
    );
    for (const [symbol, quote] of Object.entries(quotesBySymbols)) {
      const stats = this.statsByTrackedSymbols[symbol];
      stats.quotes.push(quote);
      stats.currentStockPrice = quote.currentPrice;
      stats.lastUpdate = lastUpdate;
      stats.movingAverage = this.calculateMovingAverage(stats.quotes, interval);
    }
  }

  async startSymbolTracking(symbol: string): Promise<void> {
    const normalizedSymbol = symbol.toUpperCase();
    const isSymbolAlreadyTracked = Object.keys(
      this.statsByTrackedSymbols,
    ).includes(normalizedSymbol);
    if (isSymbolAlreadyTracked) {
      return;
    }
    const quotesBySymbols = await this.finnhubService.fetchQuotes([
      normalizedSymbol,
    ]);
    const quote = quotesBySymbols[normalizedSymbol];
    const quoteChange = quote?.change;
    if (quoteChange === null) {
      throw new InvalidSymbolException(
        `The Finnhub API can't find symbol [${normalizedSymbol}]!`,
      );
    }
    this.statsByTrackedSymbols[normalizedSymbol] = {
      symbol: normalizedSymbol,
      quotes: [quote],
      currentStockPrice: quote.currentPrice,
      lastUpdate: new Date(),
      movingAverage: quote.currentPrice,
    };
  }

  endSymbolTracking(symbol: string): void {
    const normalizedSymbol = symbol.toUpperCase();
    delete this.statsByTrackedSymbols[normalizedSymbol];
  }

  getTrackedSymbols(): string[] {
    return Object.keys(this.statsByTrackedSymbols);
  }

  getStats(symbol: string) {
    const normalizedSymbol = symbol.toUpperCase();
    if (!Object.keys(this.statsByTrackedSymbols).includes(normalizedSymbol)) {
      throw new InvalidSymbolException(
        `There is no symbol [${normalizedSymbol}] tracked currently. Request tracking first!`,
      );
    }
    return this.statsByTrackedSymbols[normalizedSymbol];
  }

  calculateMovingAverage(quotes: Quote[], interval: number): number {
    if (!Number.isInteger(interval) && interval < 1) {
      throw new InvalidArgumentException(
        `Interval must be a positive integer but [${interval}] was given`,
      );
    }
    if (quotes.length === 0) {
      return null;
    }
    const lastQuotes = quotes.slice(interval * -1);
    return (
      lastQuotes.reduce((a, b) => a + b.currentPrice, 0) / lastQuotes.length
    );
  }
}

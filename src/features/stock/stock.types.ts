import { Quote } from 'src/services/finnhub/stock.types';

export interface SymbolStats {
  symbol: string;
  quotes: Quote[];
  currentStockPrice: number;
  lastUpdate: Date;
  movingAverage: number;
}

export interface SymbolReponse {
  currentStockPrice: number;
  lastUpdate: Date;
  movingAverage: number;
}

export type SymbolStatsCollection = {
  [key: string]: SymbolStats;
};

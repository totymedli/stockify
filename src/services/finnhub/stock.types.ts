export interface FinnhubQuote {
  c: number;
  d: number | null;
  dp: number | null;
  h: number;
  l: number;
  o: number;
  pc: number;
}

export interface Quote {
  currentPrice: number;
  change: number | null;
  percentChange: number | null;
  highPriceOfTheDay: number;
  lowPriceOfTheDay: number;
  openPriceOfTheDay: number;
  previousClosePrice: number;
}

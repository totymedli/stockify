import { FinnhubQuote, Quote } from './stock.types';

export const normalizeFinnhubQuote = (input: FinnhubQuote): Quote => {
  return {
    currentPrice: input.c,
    change: input.d,
    percentChange: input.dp,
    highPriceOfTheDay: input.h,
    lowPriceOfTheDay: input.l,
    openPriceOfTheDay: input.o,
    previousClosePrice: input.pc,
  };
};

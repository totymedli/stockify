import { Inject, Injectable } from '@nestjs/common';
import { DefaultApi, ApiClient } from 'finnhub';
import {
  FINNHUB_MODULE_OPTIONS,
  FinnhubModuleOptions,
  QuoteCollection,
} from './finnhub.types';
import { FinnhubQuote } from './stock.types';
import { normalizeFinnhubQuote } from './finnhub.normalizer';
import { FinnhubApiException } from './finnhub.exceptions';

@Injectable()
export class FinnhubService {
  private apiClient;

  constructor(
    @Inject(FINNHUB_MODULE_OPTIONS)
    private readonly config: FinnhubModuleOptions,
  ) {
    const apiKeyAuthentication = ApiClient.instance.authentications['api_key'];
    apiKeyAuthentication.apiKey = config.apiKey;
    this.apiClient = new DefaultApi();
  }

  async fetchQuotes(symbols): Promise<QuoteCollection> {
    console.log(`Fetch quotes for: ${symbols}`);
    try {
      const promises = symbols.map((symbol) =>
        this.createSymbolRequest(symbol),
      );
      const finnhubQuotes: FinnhubQuote[] = await Promise.all(promises);
      return this.mapNormalizedQuotesToSymbols(finnhubQuotes, symbols);
    } catch (error) {
      throw new FinnhubApiException(
        `Error during fetching symbols from Finnhub: ${error.message}`,
      );
    }
  }

  createSymbolRequest(symbol: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiClient.quote(symbol, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  mapNormalizedQuotesToSymbols(
    finnhubQuotes: FinnhubQuote[],
    symbols: string[],
  ): QuoteCollection {
    return symbols.reduce((acc, key, index) => {
      acc[key] = normalizeFinnhubQuote(finnhubQuotes[index]);
      return acc;
    }, {});
  }
}

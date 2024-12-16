import { Provider, ModuleMetadata } from '@nestjs/common';
import { Quote } from './stock.types';

export const FINNHUB_MODULE_OPTIONS = 'FINNHUB_MODULE_OPTIONS';

export interface FinnhubModuleOptions {
  global?: boolean;
  apiKey: string;
}

export interface FinnhubModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useFactory?: (
    ...args: any[]
  ) => Promise<FinnhubModuleOptions> | FinnhubModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export type QuoteCollection = {
  [key: string]: Quote;
};

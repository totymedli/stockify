import { Module, DynamicModule } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';
import {
  FINNHUB_MODULE_OPTIONS,
  FinnhubModuleOptions,
  FinnhubModuleAsyncOptions,
} from './finnhub.types';

@Module({})
export class FinnhubModule {
  static register(options: FinnhubModuleOptions): DynamicModule {
    return {
      module: FinnhubModule,
      global: options.global,
      providers: [
        {
          provide: FinnhubService,
          useValue: new FinnhubService(options),
        },
      ],
      exports: [FinnhubService],
    };
  }

  static registerAsync(options: FinnhubModuleAsyncOptions): DynamicModule {
    return {
      module: FinnhubModule,
      global: options.global,
      imports: options.imports || [],
      providers: [
        {
          provide: FINNHUB_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        FinnhubService,
      ],
      exports: [FinnhubService],
    };
  }
}

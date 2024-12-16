import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

describe('StockController', () => {
  let stockController: StockController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [StockService],
    }).compile();

    stockController = app.get<StockController>(StockController);
  });

  describe('getSymbol', () => {
    it('should return "Hello World!"', () => {
      expect(stockController.getSymbol('AMD')).toBe('Hello World!');
    });
  });
});

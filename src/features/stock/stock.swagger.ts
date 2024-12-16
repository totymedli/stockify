import { ApiProperty } from '@nestjs/swagger';

export class SymbolReponseType {
  @ApiProperty({
    description: 'The current stock price',
    example: 123.45,
  })
  currentStockPrice: number;

  @ApiProperty({
    description: 'The last time the stock price was updated',
    type: String,
    example: '2024-12-16T10:00:00Z',
  })
  lastUpdate: Date;

  @ApiProperty({
    description: 'The moving average of the stock price',
    example: 120.5,
  })
  movingAverage: number;
}

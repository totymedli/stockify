export class InvalidSymbolException extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'InvalidSymbolException';
    Error.captureStackTrace(this, InvalidSymbolException);
  }
}

export class FinnhubApiException extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'FinnhubApiException';
    Error.captureStackTrace(this, FinnhubApiException);
  }
}

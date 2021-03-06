export class AppError extends Error {
  constructor(message: string, public readonly name = 'AppError') {
    super(message);

    Error.captureStackTrace(this, AppError.captureStackTrace);
  }

  public toString() {
    return `[Error: ${this.name}]: ${this.message}`;
  }
}

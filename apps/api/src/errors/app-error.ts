export interface AppErrorOptions {
  statusCode: number;
  message: string;
  code: string;
  isOperational?: boolean;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly isOperational: boolean;

  constructor({ statusCode, message, code, isOperational = true }: AppErrorOptions) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
  }
}

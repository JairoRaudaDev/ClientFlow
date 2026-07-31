export interface AppErrorOptions {
  statusCode: number;
  message: string;
  code: string;
  details?: ReadonlyArray<AppErrorDetail>;
  isOperational?: boolean;
}

export interface AppErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: ReadonlyArray<AppErrorDetail>;
  readonly isOperational: boolean;

  constructor({ statusCode, message, code, details, isOperational = true }: AppErrorOptions) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
  }
}

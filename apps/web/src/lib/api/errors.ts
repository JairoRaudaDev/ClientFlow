export interface ApiErrorDetail {
  field: string;
  message: string;
}

export type ApiRequestErrorKind = 'api' | 'timeout' | 'network' | 'parse' | 'aborted';

interface ApiRequestErrorOptions {
  kind: ApiRequestErrorKind;
  message: string;
  status?: number;
  code?: string;
  details?: ApiErrorDetail[];
}

export class ApiRequestError extends Error {
  readonly kind: ApiRequestErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly details?: ApiErrorDetail[];

  constructor({ kind, message, status, code, details }: ApiRequestErrorOptions) {
    super(message);

    this.name = 'ApiRequestError';
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

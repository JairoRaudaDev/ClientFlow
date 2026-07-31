import { ApiRequestError } from './errors';

const REQUEST_TIMEOUT_MS = 12_000;

interface ApiErrorBody {
  success: false;
  message: string;
  code: string;
  details?: { field: string; message: string }[];
}

interface ApiSuccessBody<T> {
  success: true;
  data: T;
}

function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  return configured.replace(/\/+$/, '');
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && 'success' in value && !value.success;
}

interface ApiRequestOptions<TBody> {
  method: 'GET' | 'POST';
  body?: TBody;
}

export async function apiRequest<TResponse, TBody = undefined>(
  path: string,
  options: ApiRequestOptions<TBody>,
): Promise<TResponse> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method,
      headers: {
        Accept: 'application/json',
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError({
        kind: 'timeout',
        message: 'The request took too long. Please try again.',
      });
    }

    throw new ApiRequestError({
      kind: 'network',
      message: 'We could not reach the server. Check your connection and try again.',
    });
  } finally {
    clearTimeout(timeoutId);
  }

  const rawBody = await response.text();
  let parsedBody: unknown = undefined;

  if (rawBody.length > 0) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      throw new ApiRequestError({
        kind: 'parse',
        message: 'Something went wrong. Please try again.',
        status: response.status,
      });
    }
  }

  if (!response.ok) {
    if (isApiErrorBody(parsedBody)) {
      throw new ApiRequestError({
        kind: 'api',
        message: parsedBody.message,
        status: response.status,
        code: parsedBody.code,
        details: parsedBody.details,
      });
    }

    throw new ApiRequestError({
      kind: 'api',
      message: 'Something went wrong. Please try again.',
      status: response.status,
    });
  }

  return (parsedBody as ApiSuccessBody<TResponse>).data;
}

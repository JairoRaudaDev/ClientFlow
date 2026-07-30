import type { ErrorRequestHandler, Response } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

interface ErrorResponse {
  success: false;
  message: string;
  code: string;
}

function sendError(response: Response, statusCode: number, message: string, code: string): void {
  const body: ErrorResponse = {
    success: false,
    message,
    code,
  };

  response.status(statusCode).json(body);
}

function isErrorRecord(error: unknown): error is Error & Record<string, unknown> {
  return error instanceof Error;
}

function isMalformedJsonError(error: unknown): boolean {
  return (
    error instanceof SyntaxError &&
    isErrorRecord(error) &&
    error['status'] === 400 &&
    error['type'] === 'entity.parse.failed'
  );
}

function isPayloadTooLargeError(error: unknown): boolean {
  return isErrorRecord(error) && error['status'] === 413 && error['type'] === 'entity.too.large';
}

function logUnexpectedError(error: unknown): void {
  const errorDetails =
    error instanceof Error
      ? env.nodeEnv === 'development'
        ? (error.stack ?? error.message)
        : `${error.name}: ${error.message}`
      : 'A non-Error value was thrown';

  process.stderr.write(`[clientflow-api] Unexpected error: ${errorDetails}\n`);
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (isMalformedJsonError(error)) {
    sendError(response, 400, 'The request body contains invalid JSON', 'INVALID_JSON');
    return;
  }

  if (isPayloadTooLargeError(error)) {
    sendError(response, 413, 'The request body exceeds the 1mb limit', 'PAYLOAD_TOO_LARGE');
    return;
  }

  if (error instanceof AppError && error.isOperational) {
    sendError(response, error.statusCode, error.message, error.code);
    return;
  }

  logUnexpectedError(error);
  sendError(response, 500, 'An unexpected error occurred', 'INTERNAL_SERVER_ERROR');
};

import type { RequestHandler } from 'express';

import { AppError } from '../../errors/app-error.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';
import { loginUser, registerUser } from './auth.service.js';
import type { AuthenticationData, AuthContext } from './auth.types.js';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

export const register: RequestHandler<
  Record<string, never>,
  SuccessResponse<AuthenticationData>,
  RegisterInput
> = async (request, response, next) => {
  try {
    const data = await registerUser(request.body);

    response.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler<
  Record<string, never>,
  SuccessResponse<AuthenticationData>,
  LoginInput
> = async (request, response, next) => {
  try {
    const data = await loginUser(request.body);

    response.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe: RequestHandler<Record<string, never>, SuccessResponse<AuthContext>> = (
  request,
  response,
  next,
) => {
  if (request.auth === undefined) {
    next(
      new AppError({
        statusCode: 401,
        message: 'Authentication is required',
        code: 'AUTHENTICATION_REQUIRED',
      }),
    );
    return;
  }

  response.status(200).json({
    success: true,
    data: request.auth,
  });
};

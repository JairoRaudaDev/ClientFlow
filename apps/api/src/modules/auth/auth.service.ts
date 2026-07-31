import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { AppError } from '../../errors/app-error.js';
import { MembershipRole, Prisma } from '../../generated/prisma/client.js';
import { createAccessToken } from '../../services/jwt.service.js';
import { hashPassword, verifyPassword } from '../../services/password.service.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';
import { type AuthContext, type AuthenticationData, mapAuthContext } from './auth.types.js';

const authContextSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  memberships: {
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      role: true,
      workspace: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

export async function registerUser(input: RegisterInput): Promise<AuthenticationData> {
  const passwordHash = await hashPassword(input.password);
  const workspaceName = input.workspaceName ?? createDefaultWorkspaceName(input.name);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        memberships: {
          create: {
            role: MembershipRole.OWNER,
            workspace: {
              create: {
                name: workspaceName,
              },
            },
          },
        },
      },
      select: authContextSelect,
    });

    return createAuthenticationData(mapAuthContext(user));
  } catch (error) {
    if (isUserUniqueConstraintError(error)) {
      throw new AppError({
        statusCode: 409,
        message: 'An account with this email is already registered',
        code: 'EMAIL_ALREADY_REGISTERED',
      });
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput): Promise<AuthenticationData> {
  const userCredentials = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (userCredentials === null) {
    await hashPassword(input.password);
    throw invalidCredentialsError();
  }

  if (!(await verifyPassword(input.password, userCredentials.passwordHash))) {
    throw invalidCredentialsError();
  }

  const authContext = await getCurrentUserAuthContext(userCredentials.id);

  if (authContext === null) {
    throw invalidCredentialsError();
  }

  return createAuthenticationData(authContext);
}

export async function getCurrentUserAuthContext(userId: string): Promise<AuthContext | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: authContextSelect,
  });

  return user === null ? null : mapAuthContext(user);
}

async function createAuthenticationData(authContext: AuthContext): Promise<AuthenticationData> {
  const accessToken = await createAccessToken(authContext.user.id);

  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: env.jwtAccessTokenTtl,
    ...authContext,
  };
}

function createDefaultWorkspaceName(name: string): string {
  const [firstName = name] = name.split(/\s+/);
  const possessiveSuffix = firstName.toLowerCase().endsWith('s') ? "'" : "'s";
  const suffix = `${possessiveSuffix} Workspace`;
  const baseName = firstName.slice(0, 100 - suffix.length);

  return `${baseName}${suffix}`;
}

function invalidCredentialsError(): AppError {
  return new AppError({
    statusCode: 401,
    message: 'Invalid email or password',
    code: 'INVALID_CREDENTIALS',
  });
}

function isUserUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002' &&
    error.meta?.['modelName'] === 'User'
  );
}

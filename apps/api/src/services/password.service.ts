import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

const algorithm = 'scrypt';
const version = 1;
const cost = 16_384;
const blockSize = 8;
const parallelization = 1;
const saltLength = 16;
const derivedKeyLength = 64;
const maximumMemory = 64 * 1024 * 1024;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(saltLength);
  const derivedKey = await deriveKey(password, salt);

  return [
    algorithm,
    version,
    cost,
    blockSize,
    parallelization,
    salt.toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parsedHash = parseStoredHash(storedHash);

  if (parsedHash === undefined) {
    return false;
  }

  try {
    const derivedKey = await deriveKey(password, parsedHash.salt);

    return timingSafeEqual(derivedKey, parsedHash.derivedKey);
  } catch {
    return false;
  }
}

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      derivedKeyLength,
      {
        N: cost,
        r: blockSize,
        p: parallelization,
        maxmem: maximumMemory,
      },
      (error, derivedKey) => {
        if (error !== null) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });
}

function parseStoredHash(storedHash: string): { salt: Buffer; derivedKey: Buffer } | undefined {
  const parts = storedHash.split('$');

  if (
    parts.length !== 7 ||
    parts[0] !== algorithm ||
    parts[1] !== String(version) ||
    parts[2] !== String(cost) ||
    parts[3] !== String(blockSize) ||
    parts[4] !== String(parallelization)
  ) {
    return undefined;
  }

  const encodedSalt = parts[5];
  const encodedDerivedKey = parts[6];

  if (encodedSalt === undefined || encodedDerivedKey === undefined) {
    return undefined;
  }

  try {
    const salt = Buffer.from(encodedSalt, 'base64url');
    const derivedKey = Buffer.from(encodedDerivedKey, 'base64url');

    if (
      salt.length !== saltLength ||
      derivedKey.length !== derivedKeyLength ||
      salt.toString('base64url') !== encodedSalt ||
      derivedKey.toString('base64url') !== encodedDerivedKey
    ) {
      return undefined;
    }

    return { salt, derivedKey };
  } catch {
    return undefined;
  }
}

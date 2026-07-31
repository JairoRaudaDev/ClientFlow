import type { AuthContext } from '../modules/auth/auth.types.js';
import type { RequestWorkspaceContext } from '../middleware/require-workspace.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
      workspace?: RequestWorkspaceContext;
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export {};

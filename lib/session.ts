/**
 * @deprecated Use @/src/infrastructure/authentication/session instead
 * This file is kept for backwards compatibility during refactoring
 */
export {
  type SessionUser,
  createSession,
  loginUser,
  getSessionUser,
  requireSession,
  hasRole,
  logoutUser,
  isAdmin,
} from '@/src/infrastructure/authentication/session';

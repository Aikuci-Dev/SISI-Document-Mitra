// REF: https://github.com/atinux/nuxt-auth-utils/blob/main/src/runtime/types/session.ts

export interface User {}

export interface UserSession {
  /**
   * User session data, available on client and server
   */
  user?: User;
  /**
   * Extra session data, available on client and server
   */
  [key: string]: unknown;
}

export interface UserSessionComposable {
  /**
   * Computed indicating if the user is logged in.
   */
  loggedIn: ComputedRef<boolean>;
  /**
   * The user object if logged in, null otherwise.
   */
  user: ComputedRef<User | null>;
  /**
   * The session object.
   */
  session: Ref<UserSession>;
  /**
   * Fetch the user session from the server.
   */
  fetch: () => Promise<void>;
  /**
   * Clear the user session and remove the session cookie.
   */
  clear: () => Promise<void>;
}

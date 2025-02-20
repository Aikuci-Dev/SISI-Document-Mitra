export interface User {}

export interface UserSession {
  user?: User;
  [key: string]: unknown;
}

export interface UserSessionComposable {
  loggedIn: ComputedRef<boolean>;
  user: ComputedRef<User | null>;
  session: Ref<UserSession>;
  fetch: () => Promise<void>;
  clear: () => Promise<void>;
}

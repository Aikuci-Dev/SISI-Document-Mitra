interface UserOauth {
  id: string | number;
  email?: string;
  name?: string;
}

export interface User {
  oauth?: UserOauth;
  name?: string;
}

export interface UserSession {
  user?: User;
  [key: string]: unknown;
}

export interface UserSessionRequired extends UserSession {
  user: User;
}

export interface UserSessionComposable {
  loggedIn: ComputedRef<boolean>;
  user: ComputedRef<User | undefined>;
  session: Ref<UserSession>;
  fetch: () => Promise<void>;
  clear: () => Promise<void>;
}

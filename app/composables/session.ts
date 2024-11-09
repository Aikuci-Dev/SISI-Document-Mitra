// REF: https://github.com/atinux/nuxt-auth-utils/blob/main/src/runtime/app/composables/session.ts

import type { UserSession, UserSessionComposable } from "~~/types/session";

const useSessionState = () => useState<UserSession>("nuxt-session", () => ({}));

/**
 * Composable to get back the user session and utils around it.
 * @see https://github.com/atinux/nuxt-auth-utils
 */
export function useUserSession(): UserSessionComposable {
  const sessionState = useSessionState();
  return {
    loggedIn: computed(() => Boolean(sessionState.value.user)),
    user: computed(() => sessionState.value.user || null),
    session: sessionState,
    fetch,
    clear,
  };
}

async function fetch() {
  useSessionState().value = await useRequestFetch()("/api/auth/session").catch(
    () => ({})
  );
}

async function clear() {
  await $fetch("/api/_auth/session", { method: "DELETE" });
  useSessionState().value = {};
}

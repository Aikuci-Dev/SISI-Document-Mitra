import type { UserSession, UserSessionComposable } from "~~/types/session";

const useSessionState = () => useState<UserSession>("nuxt-session", () => ({}));

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
  // // https://github.com/nuxt/nuxt/issues/24813
  // useSessionState().value = await useRequestFetch()("/api/auth/session").catch(
  //   () => ({})
  // );

  // https://github.com/nuxt/nuxt/issues/21772#issuecomment-1606272783
  // https://github.com/nuxt/nuxt/issues/23434#issuecomment-1737484680
  // https://github.com/nuxt/nuxt/issues/25099#issuecomment-1881116359
  // https://github.com/nuxt/nuxt/issues/28485#issuecomment-2283319706
  const nuxtApp = useNuxtApp();
  const { data } = await useFetch("/api/auth/session");
  await nuxtApp.runWithContext(() => {
    useSessionState().value = data.value!;
  });
}

async function clear() {
  await $fetch("/api/auth/session", { method: "DELETE" });
  useSessionState().value = {};
}

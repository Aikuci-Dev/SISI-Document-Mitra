export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  if (isString(to.name) && to.name.startsWith('[public]')) return;

  if (!loggedIn.value) {
    if (to.path === '/') return;

    if (import.meta.client) localStorage.setItem(redirectKey, to.fullPath);

    return navigateTo('/');
  }

  if (!user.value?.name && user.value?.oauth) {
    if (to.path === '/onboarding') return;
    return navigateTo('/onboarding');
  }

  if (['/', '/onboarding'].includes(to.path)) return navigateTo('/dashboard');

  return;
});

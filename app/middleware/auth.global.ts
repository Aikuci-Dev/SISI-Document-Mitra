import { redirectKey } from '~/lib/const';
import { isString } from '~/lib/utils';

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  if (isString(to.name) && to.name.startsWith('[public]')) return;

  if (to.path === '/dashboard')
    return navigateTo('/documents', { redirectCode: 301 });

  if (!loggedIn.value) {
    if (to.path === '/') return;

    if (import.meta.client) localStorage.setItem(redirectKey, to.fullPath);

    return navigateTo('/');
  }

  if (!user.value?.name && user.value?.oauth) {
    if (to.path === '/onboarding') return;
    return navigateTo('/onboarding');
  }

  if (to.path === '/onboarding') return navigateTo('/dashboard');

  if (to.path === '/') return navigateTo('/dashboard', { redirectCode: 301 });

  return;
});

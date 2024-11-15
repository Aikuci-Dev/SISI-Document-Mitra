export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  if (to.name && String(to.name).startsWith('[public]')) return;

  if (to.path === '/dashboard')
    return navigateTo('/documents', { redirectCode: 301 });

  if (!loggedIn.value) {
    if (to.path === '/') return;
    return navigateTo('/');
  }

  if (!user.value?.name && user.value?.oauth) {
    if (to.path === '/onboarding') return;
    return navigateTo('/onboarding');
  }

  if (['/', '/onboarding'].includes(to.path)) return navigateTo('/dashboard');

  return;
});

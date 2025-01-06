export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const redirect = localStorage.getItem(redirectKey);
  localStorage.removeItem(redirectKey);
  if (redirect) return navigateTo(redirect);

  return;
});

export default defineNuxtRouteMiddleware((to, from) => {
  if (from.name !== 'documents') return abortNavigation();

  return;
});

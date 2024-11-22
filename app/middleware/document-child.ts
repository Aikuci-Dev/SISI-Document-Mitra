export default defineNuxtRouteMiddleware((to, from) => {
  if (to.name === 'documents-bast' && from.name === 'documents-bapp') return;

  if (from.name !== 'documents') return abortNavigation();

  return;
});

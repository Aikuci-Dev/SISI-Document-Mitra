export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (!user.value || !user.value.oauth) return abortNavigation();

  if (user.value.name) return navigateTo('/documents');
});

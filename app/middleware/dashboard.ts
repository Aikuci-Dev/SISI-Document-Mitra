export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (!user.value) return abortNavigation();

  if (!user.value.name) return navigateTo("/onboarding");
});

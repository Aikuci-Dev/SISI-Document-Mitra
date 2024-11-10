export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (!user.value?.name) {
    return navigateTo("/onboarding");
  }
});

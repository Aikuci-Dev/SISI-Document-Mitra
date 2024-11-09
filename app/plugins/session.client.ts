// REF: https://github.com/atinux/nuxt-auth-utils/blob/main/src/runtime/app/plugins/session.client.ts

export default defineNuxtPlugin(async (nuxtApp) => {
  if (!nuxtApp.payload.serverRendered) await useUserSession().fetch();
  else if (
    Boolean(nuxtApp.payload.prerenderedAt) ||
    Boolean(nuxtApp.payload.isCached)
  ) {
    // To avoid hydration mismatch
    nuxtApp.hook("app:mounted", async () => await useUserSession().fetch());
  }
});

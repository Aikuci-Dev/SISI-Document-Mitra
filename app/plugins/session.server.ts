// REF: https://github.com/atinux/nuxt-auth-utils/blob/main/src/runtime/app/plugins/session.server.ts

export default defineNuxtPlugin({
  name: "session-fetch-plugin",
  enforce: "pre",
  async setup(nuxtApp) {
    // Flag if request is cached
    nuxtApp.payload.isCached = Boolean(useRequestEvent()?.context.cache);
    if (
      nuxtApp.payload.serverRendered &&
      !nuxtApp.payload.prerenderedAt &&
      !nuxtApp.payload.isCached
    ) {
      await useUserSession().fetch();
    }
  },
});

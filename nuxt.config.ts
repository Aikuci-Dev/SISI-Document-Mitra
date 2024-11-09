// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      auth: {
        google: {
          clientId: "",
          loginUri: "",
        },
      },
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  shadcn: {
    prefix: "shadcn",
    componentDir: "./app/components/shadcn/ui",
  },
});

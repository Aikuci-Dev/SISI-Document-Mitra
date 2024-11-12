export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      auth: {
        google: {
          clientId: "",
          loginUri: "",
        },
      },
    },
    google: {
      apiKey: "",
      sheet: {
        id: "",
        range: "",
      },
    },
    session: {
      password: "",
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

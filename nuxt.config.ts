export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/eslint'],
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      auth: {
        google: {
          clientId: '',
          loginUri: '',
        },
      },
    },
    google: {
      apiKey: '',
      sheet: {
        id: '',
        range: '',
      },
    },
    session: {
      password: '',
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  shadcn: {
    prefix: 'shadcn',
    componentDir: './app/components/shadcn/ui',
  },
});

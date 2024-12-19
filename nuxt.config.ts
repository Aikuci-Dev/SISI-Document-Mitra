export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/eslint',
    'nuxt-signature-pad',
  ],
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
        freelancerKey: 'freelancer',
        supervisorKey: 'pm',
      },
      form: {
        id: '',
      },
    },
    session: {
      password: '',
    },
    user: {
      admin: {
        email: '',
      },
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

// @ts-check
import tailwind from 'eslint-plugin-tailwindcss';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    ignores: ['app/components/shadcn'],
  },
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        whitelist: ['aik\\-[a-zA-Z]+', 'g_id_signin'],
      },
    },
  },
);

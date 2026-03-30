// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";',
        },
      },
    },
  },

  typescript: {
    shim: false,
    strict: true,
    typeCheck: true,
  },

  modules: [
    'nuxt-microcms-module',
    [
      '@nuxtjs/google-adsense',
      {
        id: 'ca-pub-7931455677905492',
        pageLevelAds: true,
        analyticsUacct: process.env.GA_TRACKING_ID,
        analyticsDomainName: 'gadgetgurashi.com',
        onPageLoad: true,
        test: true, // 開発終了時に無効化
      },
    ],
  ],

  microCMS: {
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: process.env.MICROCMS_API_KEY,
  },
});

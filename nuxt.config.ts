// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/variables.scss" as *;',
        },
      },
    },
  },

  typescript: {
    shim: false,
    strict: true,
    typeCheck: false,
  },

  app: {
    head: {
      title: 'がじぇっとぐらし！',
      htmlAttrs: {
        lang: 'ja',
        prefix: 'og: http://ogp.me/ns#',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'オタクがガジェットやその他話題について書き散らします' },
        { property: 'og:site_name', content: 'がじぇっとぐらし！' },
        { property: 'og:type', content: 'blog' },
        { property: 'og:url', content: 'https://www.gadgetgurashi.com' },
        { property: 'og:title', content: 'がじぇっとぐらし！' },
        {
          property: 'og:description',
          content: 'オタクがガジェットやその他話題について書き散らします',
        },
        {
          property: 'og:image',
          content: 'https://gadgetgurashi.com/_nuxt/img/20210824_022917.47cb9f8.jpg',
        },
        { property: 'og:locale', content: 'ja_JP' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@gadgetgurashi' },
        { name: 'twitter:site', content: '@nzn_gadget' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  modules: [
    'nuxt-simple-sitemap',
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

  site: {
    url: 'https://gadgetgurashi.com',
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/draft/**'],
  },
});

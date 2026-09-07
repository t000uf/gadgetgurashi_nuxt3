// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-04-02',

  css: ['@/assets/styles/global.scss'],

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

  runtimeConfig: {
    public: {
      adsenseId: 'ca-pub-7931455677905492',
    },
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
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=JetBrains+Mono:wght@500;700&display=swap',
        },
      ],
      script: [
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          'data-ad-client': 'ca-pub-7931455677905492',
          async: true,
        },
      ],
    },
  },

  modules: [
    '@nuxtjs/sitemap',
    [
      'nuxt-gtag',
      {
        id: process.env.GA_TRACKING_ID,
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

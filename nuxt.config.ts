// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/projects/ancient-lens',
        '/projects/teotale',
        '/projects/creative-service-marketplace',
      ],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Rodion Hordiienko',
      meta: [
        {
          name: 'description',
          content: 'Frontend Engineer · Technical Ownership. Odesa, Ukraine.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})

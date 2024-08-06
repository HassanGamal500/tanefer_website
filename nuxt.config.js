// import colors from 'vuetify/es5/util/colors'
// import axios from 'axios'

export default {
  router: {
    base: ''
  },
  store: true,
  // serverMiddleware: [
  //   { path: '/', handler: '~/server-middleware/redirects.js' }
  // ],
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | Tanefer',
    title: 'tanefer',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://unpkg.com/@mdi/font@7.2.96/css/materialdesignicons.min.css' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js', body: true }
      // { src: '~/asets/js/webflow.js', body: true }
    ]
  },

  // Customize the progress bar color
  loading: { color: '#39b982' },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/style/normalize.css',
    '~/assets/style/webflow.css',
    '~/assets/style/tanefer.webflow.css',
    '~/assets/style/custom.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false },
    { src: '~/plugins/vue-gallery.js', ssr: false },
    { src: '~/plugins/vueSocial.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    [
      'nuxt-gmaps', {
        key: 'AIzaSyCMpLmI6ZbrtqkEA_hIP7aWCJvRsCLz11c',
        libraries: ['places']
      }
    ],
    'vue-social-sharing/nuxt',
    '@nuxtjs/gtm'
  ],

  // Configure the module
  gtm: {
    id: 'GTM-NW2KVR7' // Your GTM ID
  },

  // baseURL = 'https://be.tanefer.com/api/v2'
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: 'https://tanefer.nahrdev.com/api/v2'
    baseURL: 'https://api.tanefer.com/api/v2'

    // baseURL: 'http://localhost:8000/api/v2'
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'data',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/profile', method: 'get' }
        }
      }
    }
  },
  // private API secret
  env: {
    clientSecret: 'GshMa0/o/hOZlR79Ns6hkg==',
    wpClientSecret: 'XQfhNag1poc2i1tnC5Id2VyAuoFegRqR'
  },

  privateRuntimeConfig: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          brown: '#51371B',
          darkbrown: '#4f3316',
          brownish: '#5E432C',
          late: '#BD9468',
          bluish: '#6A6E80',
          lightBrown: '#8a5926',
          darkYellow: '#D68A2D'
        }
      }
    }
  },

  target: 'static',
  generate: {
    // interval: 100,
    fallback: true,
    routes: [
      '/',
      '/trips',
      '/booking/trip',
      // '/trips/Cairo',
      // '/trips/Luxor',
      // '/trips/Aswan',
      // '/trips/Alexandria',
      // '/trips/Hurghada',
      // '/trips/Sharm El Sheikh',
      // '/trips/Dahab',
      '/adventures',
      '/booking/adventure',
      // '/adventures/Cairo',
      '/adventures/cairo',
      // '/adventures/Luxor',
      '/adventures/luxor',
      // '/adventures/Aswan',
      '/adventures/aswan',
      // '/adventures/Alexandria',
      '/adventures/alexandria',
      // '/adventures/Hurghada',
      '/adventures/hurghada',
      '/adventures/Sharm El Sheikh',
      // '/adventures/Dahab',
      '/adventures/dahab',
      // '/adventures/Giza',
      '/adventures/giza',
      '/booking/cruise',
      '/cruises/Cairo',
      '/cruises/Luxor',
      '/cruises/Aswan',
      '/cruises/Alexandria',
      '/cruises/Hurghada',
      '/cruises/Sharm El Sheikh',
      '/cruises/Dahab',
      '/comingSoon',
      '/hotels'
    ]
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  }
}

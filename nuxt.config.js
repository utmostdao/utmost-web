export default {
  target: 'static',
  ssr: false,
  server: {
    port: 4009,
    host: '0.0.0.0',
  },
  head: {
    title: 'Utmost Swap',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,user-scalable=no,minimum-scale=1,maximum-scale=1',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.png' }],
  },

  css: ['@/assets/style/main.scss'],
  styleResources: {
    scss: ['~/assets/style/_mixin.scss', '~/assets/style/_variables.scss'],
    hoistUseStatements: true,
  },
  router: {
    middleware: ['route'],
  },

  plugins: [
    '~/plugins/element-ui.js',
    '~/plugins/axios.ts',
    '~/plugins/helpers.ts',
    '~/plugins/wallet/index.ts',
    '~/plugins/api/index.ts',
    '~/plugins/confirm-dialog.ts',
    '~/plugins/floating-vue.ts',
    '~/plugins/vue-final-modal.ts',
    '~/plugins/overlay-scrollbars.ts',
    '~/plugins/directive/index.ts',
    '~/plugins/message.ts',
    '~/plugins/debounce.ts',
    '~/plugins/init.ts',
  ],

  publicRuntimeConfig: {
    baseUrl: process.env.APP_BASE_URL,
    appUrl: process.env.APP_URL,
    isProduction: process.env.IS_PRODUCTION,
  },

  components: {
    dirs: [
      '~/components',
      '~/components/dialogs',
      '~/components/icons',
      '~/components/buttons',
      '~/components/cards',
      '~/components/menus',
      '~/blocks',
      { path: '~/blocks/layout/', prefix: 'layout', ignore: ['**/*.ts'] },
    ],
  },

  breakpoints: {
    sm: 600,
    md: 800,
    lg: 992,
    xl: 1200,
    options: {
      polyfill: true,
      throttle: 10,
    },
  },

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    'nuxt-typed-vuex',
    '@nuxtjs/style-resources',
    '@nuxt/image',
    '@nuxtjs/color-mode',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/i18n',
    'nuxt-breakpoints',
    'nuxt-breakpoints-ssr',
  ],

  axios: {
    baseURL: process.env.APP_BASE_URL,
  },

  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
  },

  loadingIndicator: {
    name: 'chasing-dots',
    color: 'rgba(123, 87, 224, 1)',
    background: 'rgba(241, 243, 244, 1)',
  },

  i18n: {
    locales: [
      { code: 'en-US', name: 'English', file: 'en-US.ts' },
      // { code: 'zh-TW', name: '繁體中文 ', file: 'zh-TW.ts' },
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en-US',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_bool_swap',
      redirectOn: 'root',
    },
  },

  loading: {
    color: '#006cc4',
    height: '2px',
  },

  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  build: {
    // analyze: true,
    transpile: [
      /^element-ui/,
      '@solana/wallet-adapter-base',
      '@solana/web3.js',
      '@walletconnect/ethereum-provider',
      '@walletconnect/modal',
      '@walletconnect/modal-ui',
      '@walletconnect/modal-core',
      '@walletconnect/universal-provider',
      '@walletconnect/sign-client',
      'web3-onboard-core',
    ],
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: `https://oversea-proxy.safematrix.io/https://tokens.1inch.io/.*`,
        strategyOptions: {
          cacheName: 'token-cache',
        },
        strategyPlugins: [
          {
            use: 'Expiration',
            config: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        ],
      },
      {
        urlPattern: `https://oss.utmost.finance/abm/token-logo/.*`,
        strategyOptions: {
          cacheName: 'chain-cache',
        },
        strategyPlugins: [
          {
            use: 'Expiration',
            config: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        ],
      },
    ],
  },
}

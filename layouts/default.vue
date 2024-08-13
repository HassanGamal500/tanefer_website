<!-- eslint-disable vue/order-in-components -->
<template>
  <v-app dark>
    <LoadingScreen v-if="loading" />
    <site-nav-bar />
    <v-main>
      <Nuxt keep-alive />
    </v-main>
    <site-footer />
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SiteNavBar from '../components/SiteNavBar'
import SiteFooter from '../components/SiteFooter'
import LoadingScreen from '../components/LoadingScreen'

export default {
  name: 'DefaultLayout',
  components: {
    SiteNavBar,
    SiteFooter,
    LoadingScreen
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.startLoading()
    })
  },
  beforeRouteLeave (to, from, next) {
    this.startLoading()
    next()
  },
  beforeRouteUpdate (to, from, next) {
    this.startLoading()
    next()
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  head () {
    return {
      meta: [
        { name: 'google-site-verification', content: 'E2ISgM_Kei1fnjTBFbK1rV3YbTTxvEzuk9DS_q_uCCM' }
      ],
      script: [
        {
          hid: 'gtm-script',
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NW2KVR7');`,
          type: 'text/javascript'
        }
      ],
      noscript: [
        {
          hid: 'gtm-noscript',
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NW2KVR7"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          body: true
        }
      ],
      __dangerouslyDisableSanitizers: ['script', 'noscript']
    }
  },
  computed: {
    ...mapState('loading', {
      loading: state => state.isLoading
    })
  },
  watch: {
    $route (to, from) {
      this.startLoading()
    }
  },
  mounted () {
    this.stopLoading()
  },
  methods: {
    ...mapActions('loading', ['startLoading', 'stopLoading'])
  }
}
</script>

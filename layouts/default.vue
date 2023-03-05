<template>
  <v-app dark>
    <site-nav-bar />
    <v-main>
      <Nuxt keep-alive />
    </v-main>
    <site-footer />
  </v-app>
</template>

<script>
import SiteNavBar from '../components/SiteNavBar'
import SiteFooter from '../components/SiteFooter'

export default {
  name: 'DefaultLayout',
  components: {
    SiteNavBar,
    SiteFooter
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
  }
}
</script>

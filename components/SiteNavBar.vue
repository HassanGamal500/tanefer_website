<template>
  <div :class="getClass()">
    <header class="header">
      <!-- contact info -->
      <div class="t-container">
        <div class="header-upper">
          <NuxtLink
            to="/"
            aria-current="page"
            exact
            active-class="logo w-inline-block w--current"
            class="logo w-inline-block"
          >
            <img src="../assets/images/TaNeferLogo.png" loading="lazy" alt="">
          </NuxtLink>
          <div>
            <div class="d-flex-end" />
            <div class="phone-num">
              <div class="hed-number">
                +1-877-334-3890
              </div>
              <div class="hed-number">
                +20 3 3384000
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- medium and up navbar -->
      <div data-collapse="medium" data-animation="over-left" data-duration="400" role="banner" class="nav-bar w-nav">
        <div class="t-container w-container">
          <nav role="navigation" class="nav-bar-flex w-nav-menu justify-space-between">
            <div>
              <a
                href="https://flights.tanefer.com/"
                target="_blank"
                rel="noopener noreferrer"
                active-class="w--current"
                class="nav-link w-nav-link"
              >Flights</a>
              <NuxtLink to="/hotels" exact active-class="w--current" class="nav-link w-nav-link">
                Hotels
              </NuxtLink>
              <NuxtLink to="/cruises" exact active-class="w--current" class="nav-link w-nav-link">
                Nile cruises
              </NuxtLink>
              <NuxtLink to="/trips" exact active-class="w--current" class="nav-link w-inline-block">
                <div class="hot">
                  <div>Pick & Custom your trip</div>
                  <div class="hot-pointer" />
                  <div class="hot-lable">
                    HOT
                  </div>
                </div>
              </NuxtLink>
              <NuxtLink to="/adventures" exact active-class="w--current" class="nav-link w-nav-link">
                Adventures
              </NuxtLink>
            </div>
          </nav>
          <div class="menu-button w-nav-button" @click="toggleSidebar = !toggleSidebar">
            <div class="icon-menu w-icon-nav-menu" />
          </div>
        </div>
      </div>

      <side-nav v-if="toggleSidebar" @close="toggleSidebar = false" />
    </header>

    <!-- slogans -->
    <div v-if="$route.name === 'hotels'" class="t-container">
      <div class="hed-txt-bg">
        <h1 class="page-h1 _w-txt">
          Hotels
        </h1>
        <div class="page-subtitle-white">
          Need a place to stay?
        </div>
        <div class="page-subtitle-white-sm">
          Find the best stay deals that&#x27;s right for you.
        </div>
      </div>
    </div>
    <div v-if="$route.name === 'trips'" class="t-container">
      <div class="hed-txt-bg">
        <h1 class="page-h1 _w-txt">
          Trips
        </h1>
        <div class="page-subtitle-white">
          Discover the civilization of Egypt with TaNefer trips
        </div>
      </div>
    </div>
    <div v-if="$route.name === 'adventures'" class="t-container">
      <div class="hed-txt-bg">
        <h1 class="page-h1 _w-txt">
          Adventures
        </h1>
        <div class="page-subtitle-white">
          Discover the civilization of Egypt with TaNefer adventures
        </div>
      </div>
    </div>
    <div v-if="$route.name === 'cruises'" class="t-container">
      <div class="hed-txt-bg">
        <h1 class="page-h1 _w-txt">
          Nile Cruises
        </h1>
        <div class="page-subtitle-white">
          Discover the civilization of Egypt with TaNefer Nile Cruises
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SiteNavBar',
  data () {
    return {
      toggleSidebar: false,
      sizes: null,
      links: [
        { text: 'Flights', value: 'flights' },
        { text: 'Hotels', value: 'hotels' },
        { text: 'Car rentals', value: 'cars' },
        { text: 'Nile cruises', value: 'nile' },
        { text: 'Trips', value: 'trips' },
        { text: 'Build your trip', value: 'build' },
        { text: 'Activties', value: 'activities' },
        { text: 'Experience Egypt', value: 'exEgypt' },
        { text: 'Experience world', value: 'exWorld' },
        { text: 'Hage & Omra', value: 'islamic' }
      ]
    }
  },
  created () {
    this.sizes = this.$vuetify.breakpoint
  },
  methods: {
    goTo (route) {
      if (this.$route.name !== route) {
        this.$router.push({ name: route })
      }
    },
    getBackground () {
      let bgClass = ''
      switch (this.$route.name) {
        case 'flights':
          bgClass = 'flights-bg'
          break
        case 'cars':
          bgClass = 'cars-bg'
          break
        case 'hotels':
          bgClass = 'hotels-bg'
          break
        case 'cruises':
          bgClass = 'cruises-bg'
          break
        case 'trips':
          bgClass = 'trip-bg'
          break
      }
      return bgClass
    },
    getClass () {
      let navCalss = ''
      switch (this.$route.name) {
        case 'index':
          navCalss = 'home-heder'
          break
        case 'flights':
          navCalss = 'page-head flights'
          break
        case 'flightResults':
          navCalss = 'head-bg-color'
          break
        case 'flightBook':
          navCalss = 'head-bg-hotel'
          break
        case 'hotels':
          navCalss = 'page-head hotel-bg'
          break
        case 'hotelsResults':
          navCalss = 'head-bg-hotel'
          break
        case 'hotelDetails':
          navCalss = 'head-bg-hotel'
          break
        case 'hotelBook':
          navCalss = 'head-bg-hotel'
          break
        case 'confirmHotelBooking':
          navCalss = 'head-bg-hotel'
          break
        case 'cars':
          navCalss = 'page-head car-bg'
          break
        case 'carsResults':
          navCalss = 'head-bg-car'
          break
        case 'carBook':
          navCalss = 'head-bg-car'
          break
        case 'carConfirm':
          navCalss = 'head-bg-car'
          break
        case 'trips':
          navCalss = 'page-head trip-bg'
          break
        case 'trips-city':
          navCalss = 'head-bg-cruise'
          break
        case 'tripPackage':
          navCalss = 'head-bg-trip'
          break
        case 'tripBook':
          navCalss = 'head-bg-cruise'
          break
        case 'tripConfirm':
          navCalss = 'head-bg-cruise'
          break
        case 'adventures':
          navCalss = 'page-head trip-bg'
          break
        case 'cruises':
          // eslint-disable-next-line no-console
          console.log('here')
          navCalss = 'page-head cruise-bg'
          break
        default:
          break
      }
      return navCalss
    }
  }
}
</script>

<style>
.w-nav[data-animation="over-left"] .w-nav-overlay,
.w-nav[data-animation="over-left"] [data-nav-menu-open] {
  right: auto;
  z-index: 1000;
  top: 0;
}
</style>

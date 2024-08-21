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
            <div class="row">
              <div class="col-8">
                <a
                  href="https://flights.tanefer.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  active-class="w--current"
                  class="nav-link w-nav-link"
                >
                  Flights
                </a>
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
                <a
                  href="https://tanefer.com/blog/"
                  rel="noopener noreferrer"
                  active-class="w--current"
                  class="nav-link w-nav-link"
                >
                  Blogs
                </a>
              </div>
              <div :key="isAuthenticated" class="col-4">
                <div v-if="isAuthenticated" class="dropdown">
                  <button class="dropdown-button">
                    Hi, {{ username }}
                  </button>
                  <div class="dropdown-menu">
                    <NuxtLink to="/profile" exact active-class="w--current" class="dropdown-item">
                      Profile
                    </NuxtLink>
                    <NuxtLink to="/bookingHistory" exact active-class="w--current" class="dropdown-item">
                      Booking History
                    </NuxtLink>
                    <a class="dropdown-item" @click="logout">
                      Logout
                    </a>
                  </div>
                </div>
                <div v-else class="login-container">
                  <NuxtLink to="/login" exact active-class="w--current" class="nav-link w-nav-link">
                    Login
                  </NuxtLink>
                </div>
              </div>
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
        { text: 'Activities', value: 'activities' },
        { text: 'Experience Egypt', value: 'exEgypt' },
        { text: 'Experience world', value: 'exWorld' },
        { text: 'Hage & Omra', value: 'islamic' }
      ]
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    user () {
      return this.$store.getters['auth/user']
    },
    username () {
      return this.$store.getters['auth/user']?.username || 'User'
    }
  },
  async mounted () {
    if (this.isAuthenticated) {
      await this.$store.dispatch('auth/fetchUser')
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
        case 'hotel':
          bgClass = 'hotels-bg'
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
      let navClass = ''
      switch (this.$route.name) {
        case 'index':
          navClass = 'home-header'
          break
        case 'flights':
          navClass = 'page-head flights'
          break
        case 'flightResults':
          navClass = 'head-bg-color'
          break
        case 'flightBook':
          navClass = 'head-bg-hotel'
          break
        // case 'hotel':
        //   navClass = 'page-head hotel-bg'
        //   break
        case 'hotels':
          navClass = 'page-head hotel-bg'
          break
        case 'hotelsResults':
          navClass = 'head-bg-hotel'
          break
        case 'hotelDetails':
          navClass = 'head-bg-hotel'
          break
        case 'hotelBook':
          navClass = 'head-bg-hotel'
          break
        case 'confirmHotelBooking':
          navClass = 'head-bg-hotel'
          break
        case 'cars':
          navClass = 'page-head car-bg'
          break
        case 'carsResults':
          navClass = 'head-bg-car'
          break
        case 'carBook':
          navClass = 'head-bg-car'
          break
        case 'carConfirm':
          navClass = 'head-bg-car'
          break
        case 'trips':
          navClass = 'page-head trip-bg'
          break
        case 'trips-city':
          navClass = 'head-bg-cruise'
          break
        case 'tripPackage':
          navClass = 'head-bg-trip'
          break
        case 'tripBook':
          navClass = 'head-bg-cruise'
          break
        case 'tripConfirm':
          navClass = 'head-bg-cruise'
          break
        case 'adventures':
          navClass = 'page-head trip-bg'
          break
        case 'cruises':
          // eslint-disable-next-line no-console
          console.log('here')
          navClass = 'page-head cruise-bg'
          break
        default:
          break
      }
      return navClass
    },
    async logout () {
      try {
        await this.$store.dispatch('auth/logout')
      } catch (error) {
      }
    }
  }
}
</script>

<style scoped>
.nav-bar-flex {
  display: flex;
  justify-content: space-between;
}

.login-container {
  margin-left: auto; /* Pushes the Login link to the far right */
}

.nav-link.w-nav-link {
  display: inline-block;
  margin: 0 10px;
  color: #fff; /* Adjust as needed */
}

.dropdown-button {
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8); /* Transparent black */
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-menu .dropdown-item {
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #575757;
}

.dropdown:hover .dropdown-menu {
  display: block;

}

.dropdown {
  margin-top: 8px;
  padding-left: 10px;
}

</style>

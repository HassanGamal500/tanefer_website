<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="results-container">
    <v-snackbar v-model="snackbar" top :timeout="5000" :color="color">
      <v-row>
        {{ text }}
        <v-spacer />
        <v-icon small color="white" class="ml-3" @click="snackbar = false">
          mdi-close
        </v-icon>
      </v-row>
    </v-snackbar>
    <v-expand-transition>
      <v-container fluid>
        <v-card class="px-5 pt-0">
          <v-card-title class="late--text">
            Update Search
          </v-card-title>
          <hotel-search v-show="showSearchForm" class="mb-5" @addHotels="getHotels" />
        </v-card>
      </v-container>
    </v-expand-transition>

    <div v-if="!hotels && loaded" class="text-center my-10">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <img max-width="200" class="blink-2" src="../../../assets/images/tanfer.png" />
    </div>
    <div v-if="hotels && hotels !== undefined && !loaded" class="gray-wrapper">
      <div class="t-container">
        <div class="flight-head">
          <div class="flight-title">
            <div class="d-flex-middle-fh">
              <div>{{ store.hotelSearch.destination.name }}</div>
            </div>
            <div class="div-block-2">
              <div class="flight-info">
                {{ getNights() }} night(s) |
              </div>
              <div class="flight-info">
                {{ store.hotelSearch.guestsInfo.length }} room(s) |
              </div>
              <div class="flight-info">
                {{ hotels.roomGuests.Adults }} Adult ,{{ hotels.roomGuests.Children }} children
              </div>
            </div>
          </div>
          <v-btn text color="brown" :loading="mapLoad" @click="prepareMaps">
            <v-icon>mdi-map-marker-multiple</v-icon> show all hotels on map
          </v-btn>
          <div data-w-id="19892d4d-59f2-17f4-e9b5-c0b1699f6aa6" class="serach-close" @click="showSearchForm = !showSearchForm">
            Modify Search
          </div>
        </div>
        <div class="filter-open" @click="showFilters">
          <span>&lt; Filters</span>
        </div>
        <div class="flight-serch-result">
          <aside id="aside-filter-hotel" class="aside-filter">
            <div class="aside-inner">
              <div id="close-filter" class="close-filter" @click="closeFilter">
                <img src="../../../assets/images/close-icon.png" loading="lazy" alt="">
              </div>
              <div class="filfer-block">
                <div class="aside-title-hed">
                  Filter your results
                </div>
                <div class="light-txt">
                  {{ hotelsCount }} results found<br>
                </div>
              </div>
              <div class="w-form">
                <form id="email-form-3" name="email-form-3" data-name="Email Form 3">
                  <filters @filterd="filterate" />
                </form>
              </div>
            </div>
          </aside>
          <div class="results-block">
            <p v-if="hotels.Hotels.length === 0" class="text-center headline">
              No Hotels match your filteration try to change your criteria
            </p>
            <hotelsCard v-show="hotels && hotels.Hotels.length > 0" :reset-timer="resetTimer" :hotels="hotels" :session="hotels.session_id" />
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="mapDialog"
      max-width="95%"
      style="z-index: 9999"
    >
      <GMap
        ref="gMap"
        language="en"
        :center="center"
        :zoom="12 "
      >
        <GMapMarker
          v-for="(m, index) in markers"
          :key="index"
          :position="m.position"
          @click="center=m.position"
        >
          <GMapInfoWindow :position="infoWindowPos">
            <div class="hotel-result-block">
              <div class="hotel-result-pic">
                <div class="result-img-holder">
                  <v-img :src="m.hotel.HotelPicture" class="hotel-result-img"></v-img>
                </div>
              </div>
              <div class="hotel-result-info">
                <div class="hoterl-result-name">
                  {{ m.hotel.HotelName }}
                </div>
                <div :class="`stars-bar _${m.hotel.stars}-star`" />
                <div class="hotel-result-address">
                  <img src="../../../assets/images/location-icon.png" loading="lazy" alt="">
                  <div class="hotel-address-txt">
                    {{ m.hotel.HotelAddress }}
                  </div>
                </div>
              </div>
              <div class="hotel-result-price">
                <div class="_w-md-50-sm100">
                  <div class="result-review-block">
                    <div class="result-review-block-number">
                      {{ m.hotel.TripAdviserRating }}
                    </div>
                  </div>
                  <div class="trip-atv-row">
                    <img src="../../../assets/images/trip-advisor-icon.png" loading="lazy" alt="">
                    <div class="tripatv-rating">
                      <div class="tripatv-rating">
                        <div v-for="n in parseInt(m.hotel.TripAdviserRating)" :key="n" class="tripatv-circle-outer">
                          <div class="tripatv-circle-inner"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="_w-md-50-sm100">
                  <div class="hotel-totlal-price">
                    ${{ m.hotel.pricingInfo.totalPrice }}
                  </div>
                  <div class="room-price-info">
                    {{ getNights() }} Night(s)| {{ $store.state.hotelSearch.guestsInfo.length }} Room(s)| {{ hotels.roomGuests.Adults }} Adult(s), {{ hotels.roomGuests.Children }} Children
                  </div>
                </div>
              </div>
            </div>
          </GMapInfoWindow>
        </GMapMarker>
      </GMap>
    </v-dialog>
  </div>
</template>

<script>
import hotelsCard from '~/components/hotelsComponents/HotelsCard'
import hotelSearch from '~/components/hotelsComponents/HotelSearch'
import filters from '~/components/hotelsComponents/HotelsFilters'
import hotelsServices from '~/services/HotelsServices'

export default {
  components: {
    hotelsCard,
    hotelSearch,
    filters
  },
  data () {
    return {
      hotelsNum: 0,
      city: '',
      hotels: null,
      snackbar: false,
      color: '',
      text: '',
      loaded: true,
      showSearchForm: true,
      resetTimer: false,
      hotel: null,
      sizes: null,
      hotelsCount: 0,
      markers: [],
      mapLoad: false,
      mapDialog: false,
      center: {
        lat: 0,
        lng: 0
      },
      map: null,
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    }
  },
  head () {
    return {
      title: 'Hotels In ' + this.$route.params.city
    }
  },
  computed: {
    store () {
      return this.$store.state
    }
  },
  watch: {
    '$vuetify.breakpoint.smAndDown' (val) {
      if (val) { this.showSearchForm = false } else { this.showSearchForm = true }
    }
  },
  created () {
    this.sizes = this.$vuetify.breakpoint
    let term
    if (this.$route.query.search) {
      term = this.$route.query.search
    } else { term = this.store.hotelSearchQuery }
    this.getHotels(term)
  },
  methods: {
    showFilters () {
      document.getElementById('aside-filter-hotel').style.left = 0
    },
    closeFilter () {
      document.getElementById('aside-filter-hotel').style.left = '-100%'
    },
    getNights () {
      const checkIn = new Date(this.$store.state.hotelSearch.checkInDate)
      const checkOut = new Date(this.$store.state.hotelSearch.checkOutDate)
      const DifferenceInTime = checkOut.getTime() - checkIn.getTime()
      return DifferenceInTime / (1000 * 3600 * 24)
    },
    prepareMaps () {
      this.mapLoad = true
      this.hotels.Hotels.forEach((hotel, i) => {
        if (i < 10) {
          this.markers.push({ hotel, position: { lat: parseFloat(hotel.HotelOnMap.Latitude), lng: parseFloat(hotel.HotelOnMap.Longitude) } })
        }
      })
      this.center = this.markers[0].position
      this.mapDialog = true
      this.mapLoad = false
    },
    toggleInfoWindow (marker, idx) {
      this.infoWindowPos = marker.position
      this.hotel = marker.hotel
      this.infoWinOpen = true

      // if (this.currentMidx === idx) {
      //   this.infoWinOpen = !this.infoWinOpen
      // } else {
      //   this.infoWinOpen = true
      //   this.currentMidx = idx
      // }
    },
    filterate (hotels) {
      this.hotels.Hotels = [...hotels]
      this.hotelsCount = hotels.length
    },
    // newSearch (query) {
    //   this.getHotels(query)
    // },
    getHotels (term) {
      this.loaded = true
      this.$store.dispatch('removeHotelsResults')
      this.hotels = null
      hotelsServices.getCityHotels(term).then((response) => {
        if (response.data.status === false) {
          this.snackbar = true
          this.color = 'error'
          this.text = response.data.message
          this.loaded = false
        } else {
          this.loaded = false
          this.$store.dispatch('setHotels', response.data.data)
          this.hotels = response.data.data
          this.hotelsCount = response.data.data.Hotels.length
        }
      }, () => {
        this.loaded = false
      })
    }
  }
}
</script>

  <style scoped>
    .aside-filter {
      min-width: 25%;
    }
    .booking-box {
      margin-top: 50px;
    }
    .blink-2 {
      -webkit-animation: blink-2 1.5s infinite both;
              animation: blink-2 1.5s infinite both;
    }
    @-webkit-keyframes blink-2 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes blink-2 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
      100% {
        opacity: 1;
      }
    }
    @media screen and (max-width: 991px) {
      .aside-filter {
        min-width: 250px;
      }
    }
  </style>

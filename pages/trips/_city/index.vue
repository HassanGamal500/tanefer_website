<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable indent -->
<template>
  <div>
    <v-snackbar v-model="snackbar" top :timeout="5000" :color="color">
      <v-row>
        {{ text }}
        <v-spacer />
        <v-icon small color="white" class="ml-3" @click="alert = false">
          mdi-close
        </v-icon>
      </v-row>
    </v-snackbar>
    <v-expand-transition>
      <div class="t-container">
        <cities-slider v-show="showSearchForm" module="tripsResults" @getTrips="getTrips" />
      </div>
    </v-expand-transition>
    <v-img v-if="$fetchState.pendeing" max-width="200" class="blink-2 mx-auto" src="~/assets/images/tanfer.png" />
    <div v-else class="gray-wrapper">
      <div v-if="!$fetchState.error">
        <!-- packages fetched successfuly -->
        <div v-if="trips.length && !$fetchState.pendeing" class="t-container">
          <div class="flight-head">
            <div class="flight-title">
              <div class="d-flex-middle-fh">
                <v-img v-if="tripsCity.cityImage" class="rounded-lg mr-3" max-width="100" :alt="tripsCity.cityImageAlt" :src="tripsCity.cityImage">
                  <span class="d-none">{{ tripsCity.cityImageCaption }}</span>
                </v-img>
                <div>
                  <h1 class="font-weight-medium">
                    {{ tripsCity.CityName }} trips
                  </h1>
                  <p class="body-2">
                    {{ tripsCity.CityDescription }}
                  </p>
                </div>
              </div>
            </div>
            <div data-w-id="19892d4d-59f2-17f4-e9b5-c0b1699f6aa6" class="serach-close" @click="showSearchForm = !showSearchForm">
              Modify Search
            </div>
          </div>
          <div class="filter-open" @click="showFilters">
            <span>&lt; Filters</span>
          </div>
          <div class="flight-serch-result">
            <aside id="aside-filter-trip" data-w-id="1b2006bd-cf9d-42e1-d991-e4049c7b4038" class="aside-filter">
              <div class="aside-inner">
                <div id="close-filter" class="close-filter" @click="closeFilter">
                  <img src="images/close-icon.png" loading="lazy" alt="">
                </div>
                <div class="filfer-block">
                  <div class="aside-title-hed">
                    Filter your results
                  </div>
                  <div class="light-txt">
                    {{ tripsCount }} results found<br>
                  </div>
                </div>
                <div v-if="min && max" class="w-form">
                  <div class="filfer-block">
                    <div class="aside-title">
                      price
                    </div>
                    <v-row justify="space-between">
                      <v-subheader color="secondary">
                        ${{ min }}
                      </v-subheader>
                      <v-subheader color="secondary">
                        ${{ max }}
                      </v-subheader>
                    </v-row>
                    <v-range-slider
                      v-model="prices"
                      :min="min"
                      :max="max"
                      color="pink"
                      class="align-center"
                      thumb-label
                      height="40"
                      @change="filteate"
                    />
                  </div>
                </div>
              </div>
            </aside>
            <div class="results-block">
              <div v-for="trip in trips" :key="trip.id" class="cruise-result-block pa-5">
                <v-row v-if="trip" class="pr-3">
                  <v-col cols="12" md="3" class="pa-0" @click="$router.push({name: 'trips-city-slug', params: {city: tripsCity.CityName, slug: trip.packageSlug || trip.packageTitle}})">
                    <v-img height="100%" max-width="350px" :src="trip.packageImage" />
                  </v-col>
                  <v-col cols="12" md="5">
                    <div class="trips-cityname">
                      <span v-for="(item, i) in trip.packageCities" :key="i">
                        {{ item.cityName }}
                        <span v-if="i < trip.packageCities.length - 1">, </span>
                      </span>
                      <br>
                    </div>
                    <div class="cruise-result-trip headline">
                      {{ trip.packageTitle }}<br>
                    </div>
                    <div class="more-text">
                      <!-- eslint-disable-next-line vue/html-self-closing -->
                      <p v-html="trip.packageOverview"></p>
                    </div>
                    <v-btn
                      color="blue"
                      dark
                      text
                      small
                      class="px-0"
                      @click="textDialog = true; description = trip.packageOverview"
                    >
                      show Full Description
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="3" align-self="center">
                    <div v-if="trip.expected_price && trip.expected_price !== '0' && trip.expected_price !== 'null'">
                      Expected Price
                    </div>
                    <div v-if="trip.expected_price && trip.expected_price !== '0' && trip.expected_price !== 'null'" class="hotel-totlal-price">
                      ${{ trip.expected_price }}
                    </div>
                    <div v-if="trip.starting_airport && trip.starting_airport !== 'null' && trip.starting_airport !== null && trip.starting_airport !== 'undefined'">
                      Package Starting airport
                    </div>
                    <div v-if="trip.starting_airport && trip.starting_airport !== 'null' && trip.starting_airport !== null && trip.starting_airport !== 'undefined'" class="hotel-totlal-price">
                      {{ trip.starting_airport }}
                    </div>
                    <div v-if="trip.packageStartDate && trip.packageStartDate !== 'null'" class="text-right">
                      Recommended Start Date
                    </div>
                    <div v-if="trip.packageStartDate && trip.packageStartDate !== 'null'" class="hotel-totlal-price">
                      {{ trip.packageStartDate }}
                    </div>
                    <div v-if="trip.packageDuration && trip.packageDuration !== '0' && trip.packageDuration !== 'null'">
                      Duration
                    </div>
                    <div v-if="trip.packageDuration && trip.packageDuration !== '0' && trip.packageDuration !== 'null'" class="hotel-totlal-price">
                      {{ trip.packageDuration }} Days
                    </div>
                    <div style="cursor: pointer" class="select-hotel" @click="$router.push({name: 'trips-city-slug', params: {city: tripsCity.CityName, slug: trip.packageSlug || trip.packageTitle}})">
                      Select
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </div>

        <!-- no packages available -->
        <p v-else-if="!trips.length && !$fetchState.pendeing" class="text-center headline font-weight-light">
          Currently, no available packages for this city
        </p>
      </div>

      <!-- error in getting packages -->
      <p v-else class="text-center headline font-weight-light">
        Couldn't retrieve trips!
      </p>

      <v-dialog
        v-model="textDialog"
        max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Trip Overview
          </v-card-title>

          <v-card-text>
            <p v-html="description"></p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tripsServices from '~/services/tripsServices'

export default {
  data () {
    return {
      snackbar: false,
      color: '',
      text: '',
      loaded: true,
      showSearchForm: true,
      showOverview: 'more',
      tripsCount: 0,
      trips: [],
      min: 0,
      max: 0,
      prices: [],
      durations: [],
      // cities: [],
      //   city: {},
      tripLengthes: [],
      tripLength: {},
      lastCity: {},
      textDialog: false,
      description: ''
    }
  },
  async fetch () {
    if (!this.cities.length) {
      const res = tripsServices.getCities()
      const data = await res
      this.results = data.data.cities
      this.$store.dispatch('setCities', this.results)
      await this.getTrips()
      await this.getTripsFilters()
    } else {
      await this.getTrips()
      await this.getTripsFilters()
    }
  },
  head () {
    return {
      title: 'Trips in ' + this.$route.params.city
    }
  },
  computed: {
    ...mapState(['tripsCity', 'cities'])
  },
  watch: {
    '$vuetify.breakpoint.smAndDown' (val) {
      if (val) { this.showSearchForm = false } else { this.showSearchForm = true }
    }
  },
  methods: {
    showFilters () {
      document.getElementById('aside-filter-trip').style.left = 0
      document.getElementById('aside-filter-trip').style.backgroundColor = 'white'
    },
    closeFilter () {
      document.getElementById('aside-filter-trip').style.left = '-100%'
    },
    filteate () {
      const tours = []
      let filtered = []
      this.$store.state.tripsResults.forEach((trip) => {
        if (this.prices[1] >= trip.expected_price && trip.expected_price >= this.prices[0]) {
          if (this.durations[1] >= trip.packageDuration && trip.packageDuration >= this.durations[0]) {
            tours.push(trip)
          }
        }
      })
      if (this.tripLength.nights) {
        tours.forEach((tour) => {
          if (tour.packageNightsNumber === this.tripLength.nights) {
            filtered.push(tour)
          }
        })
      } else { filtered = tours }
      this.trips = filtered
      this.tripsCount = this.trips.length
    },
    async getTrips () {
      if (this.tripsCity) {
        this.$store.dispatch('setTripCity', this.cities.find(el => el.CityName === this.$route.params.city))
      }
      this.$store.dispatch('removeTripsResults')
      this.lastCity = this.$store.state.tripsCity
      this.trips = []
      const res = tripsServices.getCityTrips(this.tripsCity.CityID)
      const results = await res
      const trips = results.data.data
      this.$store.dispatch('setTripsResults', trips.tripList)
      if (trips.tripList.length > 0) {
        this.trips = trips.tripList.filter(item => item.expected_price > 0)
        this.tripsCount = trips.tripList.filter(item => item.expected_price > 0).length
        this.min = trips.tripList.filter(item => item.expected_price > 0)[this.tripsCount - 1].expected_price
        this.max = trips.tripList.filter(item => item.expected_price > 0)[0].expected_price
        this.prices = [this.min, this.max]
      }
    },
    async getTripsFilters () {
      if (this.tripsCity) {
        this.$store.dispatch('setTripCity', this.cities.find(el => el.CityName === this.$route.params.city))
      }
      const res = tripsServices.getCityTripsFilters(this.tripsCity.CityID)
      const results = await res
      const filters = await results.data.data
      // this.cities = filters.cities
      if (filters.tripLength.length) {
        this.tripLengthes = filters.tripLength
        this.tripLength = filters.tripLength[0]
        if (this.tripLength) { this.durations = [0, this.tripLength.duration] }
      }
    }
  }
}
</script>

  <style>
  .package-overview {
    height: 100px;
    overflow-y: hidden;
    margin-bottom: 10px;
    position: relative;
  }

  details {
    overflow: hidden;
  }

  summary {
    display: block;
    position: relative;
    cursor: pointer;
    color: teal;
  }

  .more-text {
    height: 44px;
    overflow: hidden;
  }
  </style>
